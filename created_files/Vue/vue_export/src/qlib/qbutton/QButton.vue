<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { runDynamicAnimations } from "../../utils/animationUtils";
import { extractFontFamily } from "../../utils/helper";

const props = defineProps({
  width: String,
  height: String,
  design: String,
  bgColor: String,
  headerText: String,
  style: Object,
  isLoading: Boolean,
  iconLeft: Object,
  iconRight: Object,
  onPressed: Function,
  onHover: Function,
  onFocusChange: Function,
  onLongPress: Function,
  isAbsoluteValue: String,
  onClick: { type: String, default: "" },
  action: { type: String, default: "" },
  navigation: { type: String, default: "" },
  buttonType: String,

  // Animation Props
  maxValue: String,
  minValue: String,
  midValue: String,
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
  flexWrap: String,
  tailwaindClasses: { type: String, default: "" },
  boxShadow: String,
  foreground: String,
  textShadow: String,
});

const router = useRouter();
const buttonRef = ref(null);
const isVisible = ref(false);
const hasAnimated = ref(false);
const isHovered = ref(false);
const isFocused = ref(false);

const observer = ref(null);

const font = extractFontFamily(props.tailwaindClasses);

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

  if (buttonRef.value) {
    observer.value.observe(buttonRef.value);
  }
});

onUnmounted(() => {
  if (observer.value && buttonRef.value) {
    observer.value.unobserve(buttonRef.value);
  }
});

watch(isVisible, (val) => {
  if (props.isAnimationP === "true" && val) {
    runDynamicAnimations({
      ref: { current: buttonRef.value },
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
      midValue: props.midValue,
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
  if (props.onPressed) props.onPressed();
};

const handleMouseEnter = () => {
  if (props.onHover) props.onHover();
  isHovered.value = true;
};
const handleMouseLeave = () => (isHovered.value = false);
const handleFocus = () => {
  isFocused.value = true;
  if (props.onFocusChange) props.onFocusChange(true);
};
const handleBlur = () => {
  isFocused.value = false;
  if (props.onFocusChange) props.onFocusChange(false);
};

const effectiveBg = computed(() => {
  let effectiveBgColor = "transparent";
  let effectiveBgImage = "";
  if (props.bgColor) {
    if (
      props.bgColor.trim().startsWith("linear-gradient(") ||
      props.bgColor.trim().startsWith("radial-gradient(")
    ) {
      effectiveBgImage = props.bgColor;
    } else {
      effectiveBgColor = props.bgColor;
    }
  }
  return { color: effectiveBgColor, image: effectiveBgImage };
});

const buttonStyles = computed(() => {
  return {
    width: props.width,
    height: props.height,
    backgroundColor: effectiveBg.value.color,
    backgroundImage: effectiveBg.value.image || undefined,
    cursor: "pointer",
    boxShadow: props.boxShadow,
    textShadow: props.textShadow,
    ...(font ? { fontFamily: font } : {}),
    ...(props.isAnimationP === "true" &&
      props.animationType?.toLowerCase() !== "none" &&
      !hasAnimated.value && { opacity: 0 }),
  };
});
</script>

<template>
  <button
    ref="buttonRef"
    :style="{ ...buttonStyles, ...style }"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focus="handleFocus"
    @blur="handleBlur"
    :disabled="isLoading"
    :type="buttonType"
    :class="tailwaindClasses"
  >
    <span v-if="iconLeft"><component :is="iconLeft" /></span>
    {{ headerText }}
    <span v-if="iconRight"><component :is="iconRight" /></span>
  </button>
</template>
