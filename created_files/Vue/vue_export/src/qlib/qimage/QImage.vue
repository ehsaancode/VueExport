<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { generateStyle, HexToFilter } from "../../utils/helper";
import { runDynamicAnimations } from "../../utils/animationUtils";

const props = defineProps({
  width: String,
  height: String,
  bgUrl: String,
  bgColor: String,
  isAbsoluteValue: String,
  imageFit: String,
  color: String,
  onClick: { type: String, default: "" },
  action: { type: String, default: "" },
  navigation: { type: String, default: "" },

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
  maxValue: String,
  minValue: String,
  overflow: { type: String, default: "" },
  zIndex: String,
  tailwaindClasses: { type: String, default: "" },
  seoAlt: String,
  seoTitle: String,
  boxShadow: String,
  foreground: String,
  backgroundSize: String,
  style: Object,
});

const router = useRouter();
const imgRef = ref(null);
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

  if (imgRef.value) {
    observer.value.observe(imgRef.value);
  }
});

onUnmounted(() => {
  if (observer.value && imgRef.value) {
    observer.value.unobserve(imgRef.value);
  }
});

watch(isVisible, (val) => {
  if (props.isAnimationP === "true" && val) {
    runDynamicAnimations({
      ref: { current: imgRef.value }, // Adapt for util expecting React ref
      isVisible: val,
      isAnimationP: props.isAnimationP,
      animationType: props.animationType,
      animationDirection: props.animationDirection,
      animationEasing: props.animationEasing,
      animationIterations: props.animationIterations,
      animationDelay: props.animationDelay,
      isRevarsed: props.isRevarsed,
      animationDuration: props.animationDuration,
      maxValue: props.maxValue,
      minValue: props.minValue,
    });
  }
});

const handleClick = () => {
  if (props.onClick === "Yes") {
    switch (props.action) {
      case "Navigate to":
        router.push(`/${props.navigation}`);
        break;
    }
  }
};

const objectFitCtx = computed(() => {
  switch (props.backgroundSize) {
    case "cover":
      return "cover";
    case "contain":
      return "contain";
    case "fill":
      return "fill";
    case "fitHeight":
    case "fitWidth":
      return "contain";
    case "none":
      return "none";
    default:
      return props.isAbsoluteValue !== "true" ? "scale-down" : undefined;
  }
});

const imageStyle = computed(() => {
  return {
    ...generateStyle({
      width: props.width,
      height: props.height,
      isAbsoluteValue: props.isAbsoluteValue,
      bgColor: props.bgColor,
      color: props.color,
      overflow: props.overflow,
      onClick: props.onClick,
      zIndex: props.zIndex,
      boxShadow: props.boxShadow,
    }),
    ...(props.foreground
      ? {
          background: props.foreground,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }
      : {}),
    objectFit: objectFitCtx.value,
    ...(props.isAnimationP === "true" &&
      props.animationType?.toLowerCase() !== "none" &&
      !hasAnimated.value && { opacity: 0 }),
  };
});

const filterStyle = computed(() => {
  const match = props.tailwaindClasses.match(/text-\[#([A-Fa-f0-9]{8})\]/);
  const textColorHex = match ? `#${match[1].toUpperCase()}` : null;

  if (textColorHex) {
    const filterConverter = new HexToFilter();
    return filterConverter.getFilter(textColorHex);
  }
  return "";
});
</script>

<template>
  <img
    :class="tailwaindClasses"
    ref="imgRef"
    @click="handleClick"
    :src="bgUrl"
    :alt="seoAlt"
    :title="seoTitle"
    :style="{
      ...imageStyle,
      ...style,
      filter: filterStyle,
    }"
  />
</template>
