<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { generateStyle } from "../../utils/helper";
import { runDynamicAnimations } from "../../utils/animationUtils";

const props = defineProps({
  width: [String, Number],
  height: [String, Number],
  bgColor: String,
  bgUrl: String,
  isImageFill: Boolean,
  
  isAbsoluteValue: [Boolean, String],
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
  style: {
    type: Object,
    default: () => ({}),
  },
});

const menuRef = ref(null);
const router = useRouter();
const isVisible = ref(false);
const hasAnimated = ref(false);
let observer = null;

const handleClick = () => {
  if (
    props.onClick === "Yes" &&
    props.action === "Navigate to" &&
    props.navigation
  ) {
    router.push(`/${props.navigation}`);
  }
};

const computedStyle = computed(() => {
  const generated = generateStyle(
    Object.fromEntries(
      Object.entries({
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
      }).filter(([, val]) => val !== undefined && val !== null && val !== "")
    )
  );

  return {
    ...generated,
    zIndex: 99999, // From original code
    ...props.style,
  };
});

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !hasAnimated.value) {
        isVisible.value = true;
        hasAnimated.value = true;
      }
    },
    { threshold: 0.2 }
  );

  if (menuRef.value) {
    observer.observe(menuRef.value);
  }
});

onUnmounted(() => {
  if (observer && menuRef.value) {
    observer.unobserve(menuRef.value);
  }
});

watch(isVisible, (newVal) => {
  if (props.isAnimationP === "true" && newVal) {
    // Create a ref-like object for the utility if it expects a React ref
    const refAdapter = { current: menuRef.value };
    
    runDynamicAnimations({
      ref: refAdapter,
      isVisible: newVal,
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
</script>

<template>
  <div
    ref="menuRef"
    @click="props.onClick === 'Yes' ? handleClick() : undefined"
    :style="computedStyle"
    :class="tailwaindClasses || ''"
  >
    <slot />
  </div>
</template>
