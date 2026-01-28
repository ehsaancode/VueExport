<template>
  <div
    ref="divRef"
    @click="handleClick"
    :style="combinedStyle"
    :class="[classes, tailwaindClasses]"
  >
    <slot />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
// Adjust paths as necessary. In src/qlib/qdiv/QDiv.vue, utils are in ../../utils
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
  maxValue: String,
  minValue: String
});

const divRef = ref(null);
const router = useRouter(); // Might be undefined if not set up, but okay.
const isVisible = ref(false);
const hasAnimated = ref(false);
const classes = ref("");

// Intersection Observer
onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !hasAnimated.value) {
        isVisible.value = true;
        hasAnimated.value = true;
      }
    },
    { threshold: 0.2 }
  );

  if (divRef.value) observer.observe(divRef.value);
  // cleanup handle in onUnmounted if needed
});

// Animations
watch(isVisible, async (val) => {
    if (props.isAnimationP === "true" && val) {
       // Mocking React ref structure for the utility
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
          maxValue: props.maxValue,
          minValue: props.minValue,
        });
        
        classes.value = divRef.value.className; // Update classes
    }
});

const handleClick = () => {
    if (props.onClick === "Yes" && props.action === "Navigate to" && props.navigation) {
      if (router) router.push(`/${props.navigation}`);
      else console.warn("Router not initialized");
    }
};

const combinedStyle = computed(() => {
    const generated = generateStyle({
        width: props.width,
        height: props.height,
        isAbsoluteValue: props.isAbsoluteValue,
        bgColor: props.bgColor,
        bgUrl: props.bgUrl,
        isImageFill: props.isImageFill,
        zIndex: props.zIndex,
        backgroundSize: props.backgroundSize,
        boxShadow: props.boxShadow,
        textShadow: props.textShadow
    });
    
    return { ...generated, ...props.style };
});

</script>
