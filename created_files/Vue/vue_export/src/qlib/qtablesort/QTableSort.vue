<template>
  <div ref="tableSortRef" @click="handleClick" :style="containerStyle">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import { generateStyle } from "../../utils/helper";
import { runDynamicAnimations } from "../../utils/animationUtils";

const props = defineProps({
  width: [String, Number],
  height: [String, Number],
  padding: String,
  paddingLeft: String,
  paddingTop: String,
  paddingRight: String,
  paddingBottom: String,
  margin: String,
  marginLeft: String,
  marginTop: String,
  marginRight: String,
  marginBottom: String,
  positionedLeft: String,
  positionedTop: String,
  positionedRight: String,
  positionedBottom: String,
  color: String,
  bgColor: String,
  borderRadius: [String, Number],
  borderColor: String,
  borderWidth: [String, Number],
  bgUrl: String,
  isImageFill: [Boolean, String],
  widthType: String,
  heightType: String,
  widthPercent: [String, Number],
  heightPercent: [String, Number],
  alignment: String,
  mainAlignment: String,
  crossAlignment: String,
  borderTLR: [String, Number],
  borderTRR: [String, Number],
  borderBLR: [String, Number],
  borderBRR: [String, Number],
  borderTW: [String, Number],
  borderTC: String,
  borderBW: [String, Number],
  borderBC: String,
  borderLW: [String, Number],
  borderLC: String,
  borderRW: [String, Number],
  borderRC: String,
  shadowSpreadRadius: [String, Number],
  shadowBlurRadius: [String, Number],
  shadowOffsetX: [String, Number],
  shadowOffsetY: [String, Number],
  shadowColor: String,
  isAbsoluteValue: [Boolean, String],
  overflow: { type: String, default: "" },
  onClick: { type: String, default: "" },
  action: String,
  navigation: String,
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
});

const tableSortRef = ref(null);
const router = useRouter();
const isVisible = ref(false);
const hasAnimated = ref(false);

let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !hasAnimated.value) {
        isVisible.value = true;
        hasAnimated.value = true; // Prevents the animation from running again
      }
    },
    { threshold: 0.2 }
  );

  if (tableSortRef.value) {
    observer.observe(tableSortRef.value);
  }
});

onUnmounted(() => {
  if (observer && tableSortRef.value) {
    observer.unobserve(tableSortRef.value);
  }
});

watch(isVisible, (newVal) => {
  if (props.isAnimationP === "true" && newVal) {
    runDynamicAnimations({
      ref: tableSortRef,
      isVisible: newVal,
      isAnimationP: props.isAnimationP,
      animationType: props.animationType,
      animationDirection: props.animationDirection,
      animationEasing: props.animationEasing,
      animationIterations: props.animationIterations,
      animationDelay: props.animationDelay,
      isRevarsed: props.isRevarsed,
      animationDuration: props.animationDuration,
    });
  }
});

const handleClick = () => {
  if (props.onClick === "Yes") {
    switch (props.action) {
      case "Navigate to":
        if (router && props.navigation) router.push(`/${props.navigation}`);
        break;
    }
  }
};

const containerStyle = computed(() => ({
  ...generateStyle({
    width: props.width,
    height: props.height,
    isAbsoluteValue: props.isAbsoluteValue,
    positionedLeft: props.positionedLeft,
    positionedTop: props.positionedTop,
    positionedRight: props.positionedRight,
    positionedBottom: props.positionedBottom,
    bgColor: props.bgColor,
    bgUrl: props.bgUrl,
    isImageFill: props.isImageFill,
    color: props.color,
    borderRadius: props.borderRadius,
    borderTLR: props.borderTLR,
    borderTRR: props.borderTRR,
    borderBLR: props.borderBLR,
    borderBRR: props.borderBRR,
    borderWidth: props.borderWidth,
    borderColor: props.borderColor,
    borderTW: props.borderTW,
    borderBW: props.borderBW,
    borderLW: props.borderLW,
    borderRW: props.borderRW,
    borderTC: props.borderTC,
    borderBC: props.borderBC,
    borderLC: props.borderLC,
    borderRC: props.borderRC,
    paddingLeft: props.paddingLeft,
    paddingRight: props.paddingRight,
    paddingTop: props.paddingTop,
    paddingBottom: props.paddingBottom,
    marginLeft: props.marginLeft,
    marginRight: props.marginRight,
    marginTop: props.marginTop,
    marginBottom: props.marginBottom,
    shadowOffsetX: props.shadowOffsetX,
    shadowOffsetY: props.shadowOffsetY,
    shadowBlurRadius: props.shadowBlurRadius,
    shadowSpreadRadius: props.shadowSpreadRadius,
    shadowColor: props.shadowColor,
    overflow: props.overflow,
    mainAlignment: props.mainAlignment,
    crossAlignment: props.crossAlignment,
    onClick: props.onClick,
    zIndex: props.zIndex,
  }),
  display: "flex",
  flexDirection: "row",
}));
</script>