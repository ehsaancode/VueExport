<template>
  <div :class="tailwaindClasses || ''" @click="handleClick" :style="containerStyle">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { generateStyle } from '../../utils/helper';

const props = defineProps({
  width: [String, Number],
  height: [String, Number],
  bgColor: String,
  bgUrl: String,
  isAbsoluteValue: {
    type: Boolean,
    default: false
  },
  zIndex: [String, Number],
  imageFit: String,
  decoration: String,
  textDirection: String,
  action: String,
  navigation: String,
  backgroundSize: String,
  boxShadow: String,
  textShadow: String,
  tailwaindClasses: String,
  foreground: String,
});

const router = useRouter();

const handleClick = () => {
  if (props.action === "Navigate to" && props.navigation) {
    router.push(`/${props.navigation}`);
  }
};

const containerStyle = computed(() => {
  const baseStyle = generateStyle({
    width: props.width,
    height: props.height,
    bgColor: props.bgColor,
    bgUrl: props.bgUrl,
    isAbsoluteValue: props.isAbsoluteValue,
    zIndex: props.zIndex,
    imageFit: props.imageFit,
    decoration: props.decoration,
    textDirection: props.textDirection,
    backgroundSize: props.backgroundSize,
    boxShadow: props.boxShadow,
    textShadow: props.textShadow,
  });

  const foregroundStyle = props.foreground
    ? {
        background: props.foreground,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }
    : {};

  return {
    ...baseStyle,
    ...foregroundStyle,
    zIndex: props.zIndex || 1000,
    cursor: "pointer",
    position: "fixed",
  };
});
</script>
