<template>
  <div
    ref="FormInputElemetRef"
    @click="handleClick"
    :class="tailwaindClasses"
    :style="containerStyle"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { generateStyle } from "../../utils/helper";

const props = defineProps({
  width: String,
  height: String,
  color: String,
  bgColor: String,
  bgUrl: String,
  isImageFill: [Boolean, String],
  isAbsoluteValue: [Boolean, String],
  onClick: String,
  action: String,
  navigation: String,
  overflow: String,
  zIndex: [String, Number],
  tailwaindClasses: String,
  // Animation Props (Present in propTypes but unused in original React component)
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
});

const FormInputElemetRef = ref(null);
const router = useRouter();

const handleClick = () => {
  if (
    props.onClick === "Yes" &&
    props.action === "Navigate to" &&
    props.navigation
  ) {
    if (router) router.push(`/${props.navigation}`);
  }
};

const containerStyle = computed(() => {
  return generateStyle({
    width: props.width,
    height: props.height,
    isAbsoluteValue: props.isAbsoluteValue,
    bgColor: props.bgColor,
    bgUrl: props.bgUrl,
    isImageFill: props.isImageFill,
    overflow: props.overflow,
    onClick: props.onClick,
    zIndex: props.zIndex,
  });
});
</script>
