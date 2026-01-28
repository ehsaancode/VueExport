<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { generateStyle } from "../../utils/helper";
import { runDynamicAnimations } from "../../utils/animationUtils";

const props = defineProps({
  width: String,
  height: String,
  bgColor: String,
  bgUrl: String,
  isImageFill: Boolean,
  isAbsoluteValue: String,
  onClick: { type: String, default: "" },
  action: { type: String, default: "" },
  navigation: { type: String, default: "" },

  // Animation Props
  isAnimationP: String,
  animationEasing: String,
  animationDirection: String,
  animationType: { type: String, default: "" },
  animationIterations: String,
  animationDelay: String,
  animationDuration: String,
  animationCurve: String,
  animationTargetPosition: String,
  isRevarsed: String,

  zIndex: [String, Number],
  tailwaindClasses: String,
  backgroundSize: String,
  boxShadow: String,
  textShadow: String,
  style: Object,
});

const router = useRouter();
const rowRef = ref(null);
const isVisible = ref(false);
const hasAnimated = ref(false);
const observer = ref(null);

onMounted(() => {
  observer.value = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !hasAnimated.value) {
        isVisible.value = true;
        hasAnimated.value = true;
      }
    },
    { threshold: 0.2 },
  );
  if (rowRef.value) observer.value.observe(rowRef.value);
});

onUnmounted(() => {
  if (observer.value && rowRef.value) observer.value.unobserve(rowRef.value);
});

watch(isVisible, (val) => {
  if (props.isAnimationP === "true" && val) {
    runDynamicAnimations({
      ref: { current: rowRef.value },
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
  }
});

const handleClick = () => {
  if (
    props.onClick === "Yes" &&
    props.action === "Navigate to" &&
    props.navigation
  ) {
    router.push(`/${props.navigation}`);
  }
};

const rowStyle = computed(() => {
  const definedProps = Object.entries({
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
  }).filter(([, val]) => val !== undefined && val !== null && val !== "");

  return {
    ...generateStyle(Object.fromEntries(definedProps)),
  };
});
</script>

<template>
  <div
    ref="rowRef"
    :class="tailwaindClasses"
    :style="{ ...rowStyle, ...style }"
    @click="handleClick"
  >
    <slot></slot>
  </div>
</template>
