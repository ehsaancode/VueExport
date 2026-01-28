<template>
  <div class="q-input-wrapper" :style="cssVars">
    <input
      :class="[tailwaindClasses, 'custom-input']"
      :placeholder="formattedHeaderText"
      :readonly="readOnly === 'true'"
      :disabled="disabled === 'true'"
      :type="actualInputType"
      :name="selectedErrorSet?.cms_form_input_Name?.replace(/\s+/g, '_')"
      :style="containerStyle"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @input="handleInput"
      v-model="inputValue"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { get, setFormErrorSet } from "../../store/index";

const props = defineProps({
  width: String,
  height: String,
  color: String,
  bgColor: String,
  bgUrl: String,
  leftPadding: String,
  fontSize: String,
  tailwaindClasses: String,
  headerText: String,
  placeHolder: String,
  placeHolderFontSize: String,
  placeHolderFontWeight: String,
  placeHolderTextColor: String,
  errorSet: [String, Object],
  cmsFormInputLabel: String,
  cms_form_Id: String,
  textInputType: {
    type: String,
    default: "text",
  },
  readOnly: String,
  disabled: String,
  // Shadow props
  shadowSpreadRadius: { type: String, default: "0px" },
  shadowBlurRadius: { type: String, default: "0px" },
  shadowOffsetX: { type: String, default: "0px" },
  shadowOffsetY: { type: String, default: "0px" },
  shadowColor: { type: String, default: "transparent" },
});

const isHovered = ref(false);
const inputValue = ref("");
const textInput = ref(props.textInputType);

// Computed for accessing the specific error set in global state
const formErrorSet = computed(() => get("formErrorSet"));
const selectedErrorSet = computed(() => {
  return formErrorSet.value?.[props.cms_form_Id]?.[props.cmsFormInputLabel];
});

// Watch for changes in error set to update input type (e.g. toggle password)
watch(
  selectedErrorSet,
  (current) => {
    if (
      current?.clickValue === true &&
      current?.trailingIconEnabled === true &&
      current?.trailingIconAction === "Toggle password"
    ) {
      textInput.value = "text";
    } else if (
      current?.clickValue === false &&
      current?.trailingIconEnabled === true &&
      current?.trailingIconAction === "Toggle password"
    ) {
      textInput.value = "password";
    }
  },
  { deep: true },
);

// Initialize error set
onMounted(() => {
  if (props.cms_form_Id && props.cmsFormInputLabel && props.errorSet) {
    let parsed = props.errorSet;
    if (typeof props.errorSet === "string") {
      try {
        parsed = JSON.parse(props.errorSet);
      } catch (err) {
        console.error("Invalid errorSet JSON:", err);
      }
    }

    setFormErrorSet({
      cms_form_Id: props.cms_form_Id,
      cmsFormInputLabel: props.cmsFormInputLabel,
      errorSet: parsed,
    });
  }
});

const formattedHeaderText = computed(() => {
  if (!props.placeHolder) return "";
  return props.placeHolder
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
});

const containerStyle = computed(() => ({
  width: props.width,
  height: props.height,
  color: props.color,
  backgroundColor: isHovered.value
    ? props.bgColor
    : props.bgColor || "transparent",
  boxShadow: `${props.shadowOffsetX} ${props.shadowOffsetY} ${props.shadowBlurRadius} ${props.shadowSpreadRadius} ${props.shadowColor}`,
  ...(props.bgUrl &&
    props.bgUrl !== "undefined" && {
      backgroundImage: `url(${props.bgUrl})`,
      backgroundSize: "cover",
    }),
  paddingLeft: props.leftPadding,
  fontSize: props.fontSize,
}));

// Validation Logic
const checkInputFunction = (value) => {
  if (!selectedErrorSet.value) return;

  const errorSetVal = selectedErrorSet.value;
  const {
    cms_form_input_Required,
    cms_form_input_Regex,
    cms_form_input_Required_Msg,
    cms_form_input_Regex_Msg,
    cms_form_input_Min,
    cms_form_input_Min_Msg,
    cms_form_input_Max,
    cms_form_input_Max_Msg,
  } = errorSetVal;

  let updated = { ...errorSetVal };

  // Required
  if (cms_form_input_Required === "1" && !value.trim()) {
    updated = {
      ...updated,
      cms_form_input_Required_validation: "Yes",
      cms_form_input_Regex_validation: "No",
      cms_form_input_Min_validation: "No",
      cms_form_input_Max_validation: "No",
      validationMessage: cms_form_input_Required_Msg,
    };
  }
  // Regex
  else if (cms_form_input_Regex) {
    const regex = new RegExp(cms_form_input_Regex);
    const valid = regex.test(value);
    updated = {
      ...updated,
      cms_form_input_Required_validation: "No",
      cms_form_input_Regex_validation: valid ? "No" : "Yes",
      cms_form_input_Min_validation: "No",
      cms_form_input_Max_validation: "No",
      validationMessage: valid ? "" : cms_form_input_Regex_Msg,
    };
  }
  // Min Length
  else if (cms_form_input_Min && value.length < Number(cms_form_input_Min)) {
    updated = {
      ...updated,
      cms_form_input_Min_validation: "Yes",
      cms_form_input_Max_validation: "No",
      cms_form_input_Required_validation: "No",
      cms_form_input_Regex_validation: "No",
      validationMessage: cms_form_input_Min_Msg,
    };
  }
  // Max Length
  else if (cms_form_input_Max && value.length > Number(cms_form_input_Max)) {
    updated = {
      ...updated,
      cms_form_input_Max_validation: "Yes",
      cms_form_input_Required_validation: "No",
      cms_form_input_Regex_validation: "No",
      cms_form_input_Min_validation: "No",
      validationMessage: cms_form_input_Max_Msg,
    };
  }
  // All Valid
  else {
    updated = {
      ...updated,
      cms_form_input_Required_validation: "No",
      cms_form_input_Regex_validation: "No",
      cms_form_input_Min_validation: "No",
      cms_form_input_Max_validation: "No",
      validationMessage: "",
    };
  }

  setFormErrorSet({
    cms_form_Id: props.cms_form_Id,
    cmsFormInputLabel: props.cmsFormInputLabel,
    errorSet: updated,
  });
};

const handleInput = (e) => {
  const value = e.target.value;
  if (selectedErrorSet.value?.cms_form_input_On_Change_Validation === "1") {
    checkInputFunction(value);
  }
};

const actualInputType = computed(() => {
  if (textInput.value === "email") return "text"; // React logic?
  if (textInput.value === "phone_number") return "number";
  return textInput.value;
});

const cssVars = computed(() => ({
  "--placeholder-color": props.placeHolderTextColor,
  "--placeholder-font-size": props.placeHolderFontSize,
  "--placeholder-font-weight": props.placeHolderFontWeight,
}));
</script>

<style scoped>
.custom-input::placeholder {
  color: var(--placeholder-color);
  font-size: var(--placeholder-font-size);
  font-weight: var(--placeholder-font-weight);
}
</style>
