<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { get, subscribe } from '../../store/index';
import { generateStyle } from '../../utils/helper';

const props = defineProps({
  width: [String, Number],
  height: [String, Number],
  bgColor: String,
  bgUrl: String,
  isImageFill: [Boolean, String],
  cms_form_input_Id: { type: String, default: '' },
  cms_form_Id: { type: String, default: '' },
  isAbsoluteValue: [Boolean, String],
  zIndex: [String, Number],
  tailwaindClasses: String,
  backgroundSize: String,
  boxShadow: String,
  textShadow: String,
  errorMes: [String, Number, Object], // PropTypes.node
  onClick: String,
  action: String,
  navigation: String,
});

const selectedErrorSet = ref(null);

const updateErrorSet = () => {
  const formErrorSet = get('formErrorSet');
  const currentErrorSet = formErrorSet?.[props.cms_form_Id]?.[props.cms_form_input_Id];
  selectedErrorSet.value = currentErrorSet;
};

let unsubscribe = null;

onMounted(() => {
  updateErrorSet();
  unsubscribe = subscribe(updateErrorSet);
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

// Watch for prop changes to re-run the check immediately
watch(
  () => [props.cms_form_Id, props.cms_form_input_Id],
  () => {
    updateErrorSet();
  }
);

const containerStyle = computed(() => {
  const styleProps = {
    width: props.width,
    height: props.height,
    isAbsoluteValue: props.isAbsoluteValue,
    bgColor: props.bgColor,
    bgUrl: props.bgUrl,
    isImageFill: props.isImageFill,
    zIndex: props.zIndex,
    backgroundSize: props.backgroundSize,
    boxShadow: props.boxShadow,
    textShadow: props.textShadow,
  };

  // Filter undefined/null/empty strings similar to the React logical
  const filteredStyleProps = Object.fromEntries(
    Object.entries(styleProps).filter(
      ([, val]) => val !== undefined && val !== null && val !== ''
    )
  );

  return generateStyle(filteredStyleProps);
});
</script>

<template>
  <div :style="containerStyle" :class="tailwaindClasses || ''">
    <!-- Required Validation -->
    <template v-if="selectedErrorSet?.cms_form_input_Required_validation === 'Yes'">
      {{ selectedErrorSet?.cms_form_input_Required_Msg }}
    </template>

    <!-- Regex Validation -->
    <template v-if="selectedErrorSet?.cms_form_input_Regex_validation === 'Yes'">
      {{ selectedErrorSet?.cms_form_input_Regex_Msg }}
    </template>

    <!-- Min Length Validation -->
    <template v-if="selectedErrorSet?.cms_form_input_Min_validation === 'Yes'">
      {{ selectedErrorSet?.cms_form_input_Min_Msg }}
    </template>

    <!-- Max Length Validation -->
    <template v-if="selectedErrorSet?.cms_form_input_Max_validation === 'Yes'">
      {{ selectedErrorSet?.cms_form_input_Max_Msg }}
    </template>
  </div>
</template>
