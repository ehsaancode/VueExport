<template>
  <div
    :class="['checkbox-container', tailwaindClasses]"
    :style="containerStyle"
  >
    <label
      v-for="[value, label] in normalizedOptions"
      :key="value"
      :style="labelStyle"
    >
      <input
        type="checkbox"
        :value="value"
        :name="selectedErrorSet?.cms_form_input_Name?.replace(/\s+/g, '_')"
        :checked="selectedValues.includes(value)"
        @change="handleCheckboxChange(value)"
        style="display: none"
      />
      <span
        :style="{
          display: 'inline-block',
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: selectedValues.includes(value)
            ? activeColor
            : fillColor,
          position: 'relative',
          transition: 'all 0.2s ease',
          border: selectedValues.includes(value)
            ? `3px solid ${activeColor}`
            : `2px solid ${inactiveColor}`,
        }"
      >
        <svg
          v-if="selectedValues.includes(value)"
          viewBox="0 0 24 24"
          :width="parseInt(size) - 6"
          :height="parseInt(size) - 6"
          :style="{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fill: 'white',
          }"
        >
          <path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z" />
        </svg>
      </span>
      {{ label }}
    </label>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, defineProps } from "vue";
import { get, setFormErrorSet } from "../../store/index";

const props = defineProps({
  placeHolder: String,
  options: [Array, Object, String], // Can be stringified JSON
  width: String,
  height: String,
  bgColor: String,
  isAbsoluteValue: String,
  flexDirection: { type: String, default: "vertical" },
  tailwaindClasses: String,
  cmsFormInputLabel: String,
  cms_form_Id: String,
  errorSet: [Object, String],
  activeColor: { type: String, default: "#42A5F5" },
  inactiveColor: { type: String, default: "#E0E0E0" },
  size: { type: String, default: "24px" },
  radius: { type: String, default: "20%" },
  fillColor: { type: String, default: "#E0E0E0" },
  style: Object,
});

const selectedValues = ref([]);

// Computed to access store state reactively
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

// Initialization
onMounted(() => {
  if (selectedErrorSet.value) {
    selectedValues.value = selectedErrorSet.value?.cms_form_check_value || [];
  } else if (props.errorSet) {
    let parsedErrorSet = props.errorSet;
    try {
      if (typeof props.errorSet === "string")
        parsedErrorSet = JSON.parse(props.errorSet);
    } catch (err) {
      console.error("❌ Invalid errorSet JSON:", err);
    }

    const enrichedErrorSet = {
      ...parsedErrorSet,
      cms_form_check_value: Array.isArray(parsedErrorSet?.cms_form_check_value)
        ? parsedErrorSet.cms_form_check_value
        : [],
    };

    setFormErrorSet({
      cms_form_Id: props.cms_form_Id,
      cmsFormInputLabel: props.cmsFormInputLabel,
      errorSet: enrichedErrorSet,
    });
    // The watcher on selectedErrorSet will update selectedValues if needed,
    // but we can set it here too for active feedback
    selectedValues.value = enrichedErrorSet.cms_form_check_value;
  }
});

// Update local state when store changes
watch(
  selectedErrorSet,
  (newVal, oldVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      selectedValues.value = newVal?.cms_form_check_value || [];
    }
  },
  { deep: true },
);

const updateValidation = (updatedArray) => {
  if (!selectedErrorSet.value) return;

  let updatedErrorSet = {
    ...selectedErrorSet.value,
    cms_form_check_value: updatedArray,
  };

  if (updatedErrorSet?.cms_form_input_On_Change_Validation === "1") {
    if (
      updatedErrorSet.cms_form_input_Required === "1" &&
      updatedArray.length === 0
    ) {
      updatedErrorSet.cms_form_input_Required_validation = "Yes";
      updatedErrorSet.cms_form_input_Regex_validation = "No";
    } else if (updatedErrorSet.cms_form_input_Regex) {
      try {
        const regex = new RegExp(updatedErrorSet.cms_form_input_Regex);
        updatedErrorSet.cms_form_input_Regex_validation = updatedArray.some(
          (val) => regex.test(val),
        )
          ? "No"
          : "Yes";
      } catch (err) {
        console.error("❌ Invalid regex:", err);
        updatedErrorSet.cms_form_input_Regex_validation = "No";
      }
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
};

const handleCheckboxChange = (value) => {
  const updated = selectedValues.value.includes(value)
    ? selectedValues.value.filter((val) => val !== value)
    : [...selectedValues.value, value];

  // Optimistic update
  selectedValues.value = updated;
  updateValidation(updated);
};

const containerStyle = computed(() => ({
  display: "flex",
  flexDirection: props.flexDirection === "vertical" ? "column" : "row",
  gap: "10px",
  ...props.style,
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
