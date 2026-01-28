<template>
  <div :class="['radio-container', tailwaindClasses]" :style="containerStyle">
    <label
      v-for="[key, value] in normalizedOptions"
      :key="key"
      :style="labelStyle"
    >
      <input
        type="radio"
        :value="key"
        :name="selectedErrorSet?.cms_form_input_Name?.replace(/\s+/g, '_')"
        :checked="selectedValue === key"
        @change="handleRadioChange(key)"
        style="display: none"
      />
      <span
        :style="{
          display: 'inline-block',
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: selectedValue === key ? '' : fillColor,
          position: 'relative',
          transition: 'all 0.2s ease',
          border:
            selectedValue === key
              ? `2px solid ${activeColor}`
              : `2px solid ${inactiveColor}`,
        }"
      >
        <svg
          v-if="selectedValue === key"
          viewBox="0 0 24 24"
          :width="size ? parseInt(size) - 6 : 18"
          :height="size ? parseInt(size) - 6 : 18"
          :style="{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fill: activeColor,
          }"
        >
          <circle cx="12" cy="12" r="7" />
        </svg>
      </span>
      {{ value }}
    </label>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { get, setFormErrorSet } from "../../store/index";

const props = defineProps({
  placeHolder: String,
  options: [Array, Object, String],
  width: String,
  height: String,
  bgColor: String,
  isAbsoluteValue: String,
  flexDirection: { type: String, default: "horizontal" },
  tailwaindClasses: String,
  cmsFormInputLabel: String,
  cms_form_Id: String,
  errorSet: [Object, String],
  activeColor: { type: String, default: "#42A5F5" },
  inactiveColor: { type: String, default: "#E0E0E0" },
  size: { type: String, default: "24px" },
  radius: { type: String, default: "50%" },
  fillColor: { type: String, default: "#E0E0E0" },
});

const selectedValue = ref("");

// Reactive store access
const formErrorSet = computed(() => get("formErrorSet"));
const selectedErrorSet = computed(
  () => formErrorSet.value?.[props.cms_form_Id]?.[props.cmsFormInputLabel],
);

// Normalize options
const normalizedOptions = computed(() => {
  let opts =
    selectedErrorSet.value?.cms_form_input_Options || props.options || [];
  if (typeof opts === "string") {
    try {
      opts = JSON.parse(opts);
    } catch (e) {
      console.error("❌ Invalid cms_form_input_Options JSON:", opts);
      opts = {};
    }
  }
  const values = opts?.values || [];
  return Array.isArray(values)
    ? values.map((opt) =>
        typeof opt === "string" ? [opt, opt] : [opt.v, opt.l],
      )
    : Object.entries(values || {});
});

// Helper for deep cloning
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// Initialization
onMounted(() => {
  if (selectedErrorSet.value?.cms_form_radio_value !== undefined) {
    selectedValue.value = selectedErrorSet.value.cms_form_radio_value;
  } else if (props.errorSet) {
    let parsedErrorSet = props.errorSet;
    try {
      if (typeof props.errorSet === "string") {
        parsedErrorSet = JSON.parse(props.errorSet);
      }
    } catch (err) {
      console.error("❌ Invalid errorSet JSON:", err);
    }

    const valueToSet = parsedErrorSet.cms_form_radio_value || "";

    setFormErrorSet({
      cms_form_Id: props.cms_form_Id,
      cmsFormInputLabel: props.cmsFormInputLabel,
      errorSet: deepClone({
        ...parsedErrorSet,
        cms_form_radio_value: valueToSet,
      }),
    });
    selectedValue.value = valueToSet;
  }
});

// Watch store changes
watch(
  selectedErrorSet,
  (newVal, oldVal) => {
    if (
      newVal?.cms_form_radio_value !== selectedValue.value ||
      JSON.stringify(newVal) !== JSON.stringify(oldVal)
    ) {
      selectedValue.value = newVal?.cms_form_radio_value || "";
    }
  },
  { deep: true },
);

const handleSelectedRadio = (selected) => {
  if (!selectedErrorSet.value) return;

  const clonedErrorSet = deepClone(selectedErrorSet.value);

  clonedErrorSet.cms_form_radio_value = selected;
  clonedErrorSet.cms_form_input_Required_validation =
    clonedErrorSet.cms_form_input_Required === "1" && !selected ? "Yes" : "No";
  clonedErrorSet.cms_form_input_Regex_validation = "No";

  setFormErrorSet({
    cms_form_Id: props.cms_form_Id,
    cmsFormInputLabel: props.cmsFormInputLabel,
    errorSet: clonedErrorSet,
  });
};

const handleRadioChange = (key) => {
  selectedValue.value = key;
  handleSelectedRadio(key);
};

const containerStyle = computed(() => ({
  display: "flex",
  flexDirection: props.flexDirection === "vertical" ? "column" : "row",
  gap: "10px",
}));

const labelStyle = computed(() => ({
  width: props.width,
  height: props.height,
  display: "flex",
  alignItems: "center",
  gap: "10px",
  position: props.isAbsoluteValue === "true" ? "absolute" : "static",
  cursor: "pointer",
}));
</script>
