<template>
  <p
    ref="textRef"
    @click="handleClick"
    :style="combinedStyle"
    :class="[classes, tailwaindClasses]"
    v-html="displayText"
  ></p>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { generateStyle, extractFontFamily } from "../../utils/helper";
import { runDynamicAnimations } from "../../utils/animationUtils";
import { usePagination } from "../../store/hooks/pagination";

const props = defineProps({
  width: String,
  height: String,
  headerText: String,
  bgColor: String,
  color: String,
  bgUrl: String,
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
  maxValue: String,
  minValue: String,
  overflow: String,
  zIndex: [String, Number],
  Pagination: String, // String "true" or "false" usually
  tailwaindClasses: {
    type: String,
    default: ''
  },
  boxShadow: String,
  foreground: String,
  textDecorationLine: String,
  style: Object
});

const textRef = ref(null);
const router = useRouter();
const isVisible = ref(false);
const hasAnimated = ref(false);
const classes = ref("");
const isLoading = ref(true);

const { totalItemsValue, itemsPerPageValue, currentPageValue } = usePagination();

// Computed property for handling text logic including pagination
const displayText = computed(() => {
    let currentText = props.headerText ?? "";
    
    // Pagination Logic
    if (props.Pagination === "true" && !isNaN(parseInt(props.headerText))) {
        // Assuming hook values are Refs. If usePagination returned standard objects, remove .value
        const start = (currentPageValue.value - 1) * itemsPerPageValue.value + 1;
        const end = Math.min(
            currentPageValue.value * itemsPerPageValue.value,
            totalItemsValue.value
        );
        currentText = `${start} to ${end} of ${totalItemsValue.value}`;
    }

    return String(currentText).replace(/\n/g, "<br/>");
});

const font = computed(() => extractFontFamily(props.tailwaindClasses));

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

  if (textRef.value) {
    observer.observe(textRef.value);
  }

  // Shimmer Effect Timer
  const timeout = setTimeout(() => {
      isLoading.value = false;
  }, 1000);
  
  onUnmounted(() => clearTimeout(timeout));
});

watch(isVisible, async (val) => {
    if (props.isAnimationP === "true" && val) {
        const reactRefMock = { current: textRef.value };
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
        classes.value = textRef.value.className;
    }
});

const handleClick = () => {
    if (props.onClick === "Yes" && props.action === "Navigate to" && props.navigation) {
      if (router) router.push(`/${props.navigation}`);
      else console.warn("Router not initialized");
    }
};

const combinedStyle = computed(() => {
    // Stroke logic
    const matchStroke = props.tailwaindClasses.match(/stroke-\[(\d+px)\]/);
    const matchStrokeColor = props.tailwaindClasses.match(/strokeColor-\[#([0-9A-Fa-f]{6,8})\]/);
    const strokeWidth = matchStroke?.[1] ?? null;
    const fullStrokeColor = matchStrokeColor?.[1] ?? null;
    const strokeColor = fullStrokeColor ? `#${fullStrokeColor}` : null;

    const baseStyle = generateStyle({
        width: props.width,
        height: props.height,
        isAbsoluteValue: props.isAbsoluteValue,
        bgColor: props.bgColor,
        bgUrl: props.bgUrl,
        color: props.color,
        overflow: props.overflow,
        onClick: props.onClick,
        zIndex: props.zIndex,
        boxShadow: props.boxShadow,
    });
    
    // Foreground gradient logic
    const foregroundStyle = props.foreground ? {
        background: props.foreground,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    } : {};

    // Stroke style
    const strokeStyle = (strokeWidth && strokeColor) ? {
        WebkitTextStroke: `${strokeWidth} ${strokeColor}`,
        color: "transparent",
    } : {};

    // Animation initial opacity
    const animationStyle = (props.isAnimationP === "true" && props.animationType?.toLowerCase() !== "none" && !hasAnimated.value) 
        ? { opacity: 0 } 
        : {};
    
    const fontStyle = font.value ? { fontFamily: font.value } : {};

    return {
        margin: "0px",
        ...baseStyle,
        ...foregroundStyle,
        ...strokeStyle,
        textDecorationLine: props.textDecorationLine,
        ...animationStyle,
        ...fontStyle,
        ...props.style
    };
});
</script>
