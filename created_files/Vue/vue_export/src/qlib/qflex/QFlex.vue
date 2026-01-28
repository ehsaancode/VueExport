<template>
  <div
    ref="divRef"
    @click="handleClick"
    :class="[classes, tailwaindClasses]"
    :style="combinedStyle"
  >
    <slot></slot>
  </div>
</template>

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
  isImageFill: [Boolean, String],
  isAbsoluteValue: [Boolean, String],
  onClick: String,
  action: String,
  navigation: String,
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
  tailwaindClasses: String,
  backgroundSize: String,
  boxShadow: String,
  textShadow: String,
  style: Object,
});

const divRef = ref(null);
const router = useRouter();
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

  if (divRef.value) {
    observer.observe(divRef.value);
  }

  onUnmounted(() => {
    if (divRef.value) observer.unobserve(divRef.value);
  });
});

watch(isVisible, async (val) => {
  if (props.isAnimationP === "true" && val) {
    const reactRefMock = { current: divRef.value };
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

    classes.value = divRef.value.className;
  }
});

const handleClick = () => {
  if (
    props.onClick === "Yes" &&
    props.action === "Navigate to" &&
    props.navigation
  ) {
    if (router) router.push(`/${props.navigation}`);
  }
};

const combinedStyle = computed(() => {
  // Filter style props
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

  const filteredProps = Object.fromEntries(
    Object.entries(styleProps).filter(
      ([, val]) => val !== undefined && val !== null && val !== "",
    ),
  );

  const baseStyle = generateStyle(filteredProps);

  const animationStyle =
    props.isAnimationP === "true" &&
    props.animationType?.toLowerCase() !== "none" &&
    !hasAnimated.value
      ? { opacity: 0 }
      : {};

  return {
    ...baseStyle,
    ...animationStyle,
    ...props.style,
  };
});
</script>
