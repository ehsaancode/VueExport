<template>
  <form
    ref="formRef"
    :id="`form_${cms_form_Id}`"
    @submit.prevent="handleSubmit"
    :class="[classes, tailwaindClasses]"
    :style="formStyle"
  >
    <slot></slot>
  </form>
</template>

<script setup>
import { ref, onMounted, watch, computed, onUnmounted } from "vue";
import { generateStyle } from "../../utils/helper";
import { runDynamicAnimations } from "../../utils/animationUtils";

const props = defineProps({
  cms_form_Id: {
    type: String,
    required: true,
  },
  width: String,
  height: String,
  bgColor: String,
  bgUrl: String,
  isImageFill: [Boolean, String],
  isAbsoluteValue: [Boolean, String],
  tailwaindClasses: String,
  backgroundSize: String,
  boxShadow: String,
  textShadow: String,
  // Animation Props
  isAnimationP: String,
  animationEasing: String,
  animationDirection: String,
  animationType: String,
  animationIterations: String,
  animationDelay: String,
  animationDuration: String,
  animationCurve: String,
  animationTargetPosition: String,
  isRevarsed: String,
  zIndex: [String, Number],
  // Events
  // onSubmit is emitted via plain 'submit' event on the form element?
  // But standard Vue form submit is @submit.
  // The react code takes an onSubmit prop.
  onSubmit: Function,
});

const emit = defineEmits(["submit"]);

const formRef = ref(null);
const isVisible = ref(false);
const hasAnimated = ref(false);
const classes = ref("");

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !hasAnimated.value) {
        isVisible.value = true;
        hasAnimated.value = true;
      }
    },
    { threshold: 0.2 },
  );

  if (formRef.value) {
    observer.observe(formRef.value);
  }

  onUnmounted(() => {
    if (formRef.value) observer.unobserve(formRef.value);
  });
});

watch(isVisible, async (val) => {
  if (props.isAnimationP === "true" && val) {
    const reactRefMock = { current: formRef.value };
    await runDynamicAnimations({
      ref: reactRefMock,
      isVisible: val,
      isAnimationP: props.isAnimationP,
      animationType: props.animationType,
      animationDirection: props.animationDirection,
      animationEasing: props.animationEasing,
      animationIterations: props.animationIterations,
      animationDelay: props.animationDelay,
      animationDuration: props.animationDuration,
      isRevarsed: props.isRevarsed,
    });

    classes.value = formRef.value.className;
  }
});

const handleSubmit = (e) => {
  // e.preventDefault() is handled by @submit.prevent in template
  emit("submit", e);
};

const formStyle = computed(() => {
  const styleProps = {
    width: props.width,
    height: props.height,
    bgColor: props.bgColor,
    bgUrl: props.bgUrl,
    isImageFill: props.isImageFill,
    isAbsoluteValue: props.isAbsoluteValue,
    zIndex: props.zIndex,
    backgroundSize: props.backgroundSize,
    boxShadow: props.boxShadow,
    textShadow: props.textShadow,
  };

  const filteredProps = Object.fromEntries(
    Object.entries(styleProps).filter(
      ([, v]) => v !== undefined && v !== null && v !== "",
    ),
  );

  return generateStyle(filteredProps);
});
</script>
