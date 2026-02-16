<template>
  <div
    :style="{ ...containerStyle, ...style }"
    :class="tailwaindClasses"
    @click="handleClick"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { generateStyle } from "../../utils/helper";

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
  borderRadius: String,
  borderColor: String,
  borderWidth: String,
  bgUrl: String,
  isImageFill: Boolean,
  overflow: String,
  zIndex: [String, Number],
  widthType: String,
  heightType: String,
  widthPercent: String,
  heightPercent: String,
  alignment: String,
  mainAlignment: String,
  crossAlignment: String,
  borderTLR: String,
  borderTRR: String,
  borderBLR: String,
  borderBRR: String,
  borderTW: String,
  borderTC: String,
  borderBW: String,
  borderBC: String,
  borderLW: String,
  borderLC: String,
  borderRW: String,
  borderRC: String,
  shadowSpreadRadius: String,
  shadowBlurRadius: String,
  shadowOffsetX: String,
  shadowOffsetY: String,
  shadowColor: String,
  isAbsoluteValue: [Boolean, String],
  onClick: String,
  action: String,
  navigation: String,
  tailwaindClasses: String,
  boxShadow: String,
  foreground: String,
  style: Object,
  maxValue: String,
  minValue: String,
  midValue: String,
});

const router = useRouter();

const handleClick = () => {
  if (props.onClick === "Yes") {
    switch (props.action) {
      case "Navigate to":
        router.push(`/${props.navigation}`);
        break;
    }
  }
};

const containerStyle = computed(() => {
  const baseStyle = generateStyle({
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
    boxShadow: props.boxShadow,
    maxValue: props.maxValue,
    minValue: props.minValue,
    midValue: props.midValue,
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
  };
});
</script>
