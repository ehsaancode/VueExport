<template>
  <div class="relative w-full">
    <textarea
      :class="`${props.tailwaindClasses} custom-textarea w-full`"
      :placeholder="formattedHeaderText"
      :name="selectedErrorSet?.cms_form_input_Name?.replace(/\s+/g, '_')"
      :style="containerStyle"
      :value="value"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @input="checkInputFunction($event.target.value)"
    />

    <!-- Character count -->
    <div
      v-if="props.showNumberCount === '1'"
      class="absolute bottom-2 right-3 text-xs text-gray-500"
    >
      {{ value.length }}/{{ props.maxWords }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { get, setFormErrorSet, subscribe } from "../../store/index";

const props = defineProps({
  width: [String, Number],
  height: [String, Number],
  color: String,
  bgColor: String,
  bgUrl: String,
  headerText: { type: String, default: "" },
  tailwaindClasses: { type: String, default: "" },
  placeHolder: { type: String, default: "" },
  errorSet: [String, Object],
  cmsFormInputLabel: String,
  cms_form_Id: String,
  maxWords: { type: String, default: "20" },
  showNumberCount: { type: String, default: "1" },
  showResizeButton: { type: String, default: "1" },
});

const isHovered = ref(false);
const value = ref("");
const selectedErrorSet = ref(null);

/** 🔹 Deep clone helper */
const deepClone = (obj) =>
  typeof structuredClone === "function"
    ? structuredClone(obj)
    : JSON.parse(JSON.stringify(obj));

/** 🔹 Get selected error set from utility state */
const getSelectedErrorSet = () => {
  const formErrorSet = get("formErrorSet");
  return formErrorSet?.[props.cms_form_Id]?.[props.cmsFormInputLabel]
    ? deepClone(formErrorSet[props.cms_form_Id][props.cmsFormInputLabel])
    : null;
};

onMounted(() => {
  if (!props.cms_form_Id || !props.cmsFormInputLabel) return;

  let parsed = props.errorSet;

  if (typeof props.errorSet === "string") {
    try {
      parsed = JSON.parse(props.errorSet);
    } catch {
      console.error("Invalid errorSet JSON:", props.errorSet);
      return;
    }
  }

  setFormErrorSet({
    cms_form_Id: props.cms_form_Id,
    cmsFormInputLabel: props.cmsFormInputLabel,
    errorSet: parsed,
  });

  selectedErrorSet.value = parsed;
});

/** 🔹 Sync with global store */
let unsubscribe = null;
watch(
  () => [props.cms_form_Id, props.cmsFormInputLabel, props.errorSet],
  () => {
    const currentErrorSet = getSelectedErrorSet();

    if (currentErrorSet?.cms_form_text_area_value !== undefined) {
      selectedErrorSet.value = currentErrorSet;
      value.value = currentErrorSet.cms_form_text_area_value;
    } else if (props.errorSet) {
      // Dispatch initial errorSet if provided
      let parsedErrorSet = props.errorSet;
      try {
        if (typeof props.errorSet === "string") {
          parsedErrorSet = JSON.parse(props.errorSet);
        }
      } catch (err) {
        console.error("Invalid errorSet JSON:", err);
      }

      const enrichedErrorSet = {
        ...parsedErrorSet,
        cms_form_text_area_value: parsedErrorSet?.cms_form_text_area_value || "",
      };

      setFormErrorSet({
        cms_form_Id: props.cms_form_Id,
        cmsFormInputLabel: props.cmsFormInputLabel,
        errorSet: deepClone(enrichedErrorSet),
      });

      selectedErrorSet.value = enrichedErrorSet;
      value.value = enrichedErrorSet.cms_form_text_area_value;
    }

    // 🔹 Subscribe to store updates
    if (unsubscribe) unsubscribe();
    unsubscribe = subscribe(() => {
      const updatedErrorSet = getSelectedErrorSet();
      if (
        updatedErrorSet?.cms_form_text_area_value !== value.value ||
        JSON.stringify(updatedErrorSet) !== JSON.stringify(selectedErrorSet.value)
      ) {
        value.value = updatedErrorSet?.cms_form_text_area_value || "";
        selectedErrorSet.value = updatedErrorSet;
      }
    });
  },
  { immediate: true }
);

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

/** 🔹 Format placeholder */
const formattedHeaderText = computed(() =>
  props.placeHolder
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
);

/** 🔹 Styles */
const containerStyle = computed(() => ({
  width: props.width,
  height: props.height,
  color: props.color,
  backgroundColor: props.bgColor || "transparent",
  ...(props.bgUrl &&
    props.bgUrl !== "undefined" && {
      backgroundImage: `url(${props.bgUrl})`,
    }),
  resize: props.showResizeButton === "1" ? "both" : "none",
}));

/** 🔹 Validation + sync cms_form_text_area_value */
const checkInputFunction = (inputValue) => {
  if (!selectedErrorSet.value) return;

  if (
    props.showNumberCount === "1" &&
    inputValue.length > parseInt(props.maxWords, 10)
  ) {
    return; // enforce char limit
  }

  value.value = inputValue;

  let updatedErrorSet = deepClone(selectedErrorSet.value);
  updatedErrorSet.cms_form_text_area_value = inputValue;

  if (selectedErrorSet.value?.cms_form_input_On_Change_Validation === "1") {
    const { cms_form_input_Required, cms_form_input_Regex } =
      selectedErrorSet.value;

    if (cms_form_input_Required === "1" && !inputValue.trim()) {
      updatedErrorSet.cms_form_input_Required_validation = "Yes";
      updatedErrorSet.cms_form_input_Regex_validation = "No";
    } else if (cms_form_input_Regex) {
      const regex = new RegExp(cms_form_input_Regex);
      updatedErrorSet.cms_form_input_Regex_validation = regex.test(inputValue)
        ? "No"
        : "Yes";
      updatedErrorSet.cms_form_input_Required_validation = "No";
    } else {
      updatedErrorSet.cms_form_input_Required_validation = "No";
      updatedErrorSet.cms_form_input_Regex_validation = "No";
    }
  }

  setFormErrorSet({
    cms_form_Id: props.cms_form_Id,
    cmsFormInputLabel: props.cmsFormInputLabel,
    errorSet: updatedErrorSet,
  });

  selectedErrorSet.value = updatedErrorSet;
};
</script>