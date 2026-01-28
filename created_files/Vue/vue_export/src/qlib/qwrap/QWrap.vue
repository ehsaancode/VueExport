<template>
  <div :class="tailwaindClasses" @click="handleClick" :style="containerStyle">
    <slot></slot>
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
  onClick: String,
  action: String,
  navigation: String,
  overflow: String,
  zIndex: [String, Number],
  fontFamily: String,
  fontStyle: String,
  fontWeight: [String, Number],
  fontSize: [String, Number],
  textAlign: String,
  tailwaindClasses: String,
  boxShadow: String,
  foreground: String,
  imageFit: String,
  decoration: String,
  textDirection: String,
});

const router = useRouter();

const handleClick = () => {
  if (props.onClick === "Yes") {
    switch (props.action) {
      case "Navigate to":
        if (router && props.navigation) router.push(`/${props.navigation}`);
        break;
    }
  }
};

const containerStyle = computed(() => {
  const generated = generateStyle({
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
    fontSize: props.fontSize,
    fontWeight: props.fontWeight,
    textAlign: props.textAlign,
    fontFamily: props.fontFamily,
    fontStyle: props.fontStyle,
    boxShadow: props.boxShadow,
    imageFit: props.imageFit,
    decoration: props.decoration,
  });

  const foregroundStyle = props.foreground
    ? {
        background: props.foreground,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }
    : {};

  return {
    ...generated,
    ...foregroundStyle,
    display: "flex",
    flexWrap: "wrap",
    textTransform: "uppercase",
  };
});
</script>
