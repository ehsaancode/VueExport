<template>
  <div
    ref="wrapperRef"
    :style="{ height: (isSticky && !isAbsoluteValue) ? `${headerHeight}px` : 'auto' }"
  >
    <div
      ref="headerRef"
      :class="tailwaindClasses || ''"
      @click="onClick === 'Yes' ? handleClick() : null"
      :style="containerStyle"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { generateStyle } from '../../utils/helper';

const props = defineProps({
  width: [String, Number],
  height: [String, Number],
  color: String,
  bgColor: String,
  bgUrl: String,
  isImageFill: Boolean,
  isAbsoluteValue: Boolean,
  overflow: String,
  zIndex: [String, Number],
  imageFit: String,
  decoration: String,
  textDirection: String,
  onClick: {
    type: String,
    default: ''
  },
  action: {
    type: String,
    default: ''
  },
  navigation: {
    type: String,
    default: ''
  },
  tailwaindClasses: String,
  boxShadow: String,
  foreground: String,
});

const router = useRouter();
const headerRef = ref(null);
const wrapperRef = ref(null);
const isSticky = ref(false);
const headerHeight = ref(0);
const headerWidth = ref("100%");

const handleClick = () => {
  if (props.onClick === "Yes") {
    if (props.action === "Navigate to" && props.navigation) {
      router.push(`/${props.navigation}`);
    }
  }
};

const handleScroll = () => {
  if (wrapperRef.value) {
    const rect = wrapperRef.value.getBoundingClientRect();
    isSticky.value = rect.top <= 0;
  }
};

let resizeObserver = null;

onMounted(() => {
  // Initial measurement
  nextTick(() => {
    if (headerRef.value) headerHeight.value = headerRef.value.offsetHeight;
    if (wrapperRef.value) headerWidth.value = `${wrapperRef.value.offsetWidth}px`;
    
    // Trigger scroll check once on mount
    handleScroll();
  });

  // Setup ResizeObserver
  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === headerRef.value) {
        headerHeight.value = entry.target.offsetHeight;
      }
      if (entry.target === wrapperRef.value) {
        headerWidth.value = `${entry.target.offsetWidth}px`;
      }
    }
  });

  if (headerRef.value) resizeObserver.observe(headerRef.value);
  if (wrapperRef.value) resizeObserver.observe(wrapperRef.value);

  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect();
  window.removeEventListener("scroll", handleScroll);
});

const containerStyle = computed(() => {
  const baseStyle = generateStyle({
    width: props.width,
    height: props.height,
    isAbsoluteValue: props.isAbsoluteValue,
    bgColor: props.bgColor,
    bgUrl: props.bgUrl,
    isImageFill: props.isImageFill,
    color: props.color,
    overflow: props.overflow,
    zIndex: props.zIndex,
    imageFit: props.imageFit,
    decoration: props.decoration,
    textDirection: props.textDirection,
    boxShadow: props.boxShadow,
  });

  const foregroundStyle = props.foreground
    ? {
        background: props.foreground,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }
    : {};

  const stickyWidth = (isSticky.value && !props.isAbsoluteValue) 
    ? headerWidth.value 
    : (props.width || "100%");

  return {
    ...baseStyle,
    ...foregroundStyle,
    position: props.isAbsoluteValue ? "absolute" : isSticky.value ? "fixed" : "relative",
    top: props.isAbsoluteValue ? undefined : isSticky.value ? "0px" : undefined,
    width: stickyWidth,
    zIndex: props.zIndex ?? 999,
  };
});
</script>
