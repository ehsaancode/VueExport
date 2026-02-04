<template>
  <div :style="containerStyle" :class="tailwaindClasses" @click="handleClick">
    <div class="q-marquee-inner">
      <slot></slot>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { generateStyle } from '../../utils/helper';

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
  positionedBottom: String,
  positionedRight: String,
  color: String,
  bgColor: String,
  borderRadius: String,
  borderColor: String,
  borderWidth: String,
  bgUrl: String,
  isImageFill: Boolean,
  widthType: String,
  heightType: String,
  widthPercent: [String, Number],
  heightPercent: [String, Number],
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
  onClick: {
    type: String,
    default: ""
  },
  action: {
    type: String,
    default: ""
  },
  navigation: {
    type: String,
    default: ""
  },
  isAbsoluteValue: Boolean,
  overflow: String,
  zIndex: [String, Number],
  fontSize: [String, Number],
  fontWeight: [String, Number],
  textAlign: String,
  fontFamily: String,
  fontStyle: String,
  imageFit: String,
  decoration: String,
  textDirection: String,
  tailwaindClasses: String
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
  return {
    ...generateStyle({
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
      imageFit: props.imageFit,
      decoration: props.decoration,
      textDirection: props.textDirection
    }),
    display: "flex",
    overflow: "hidden",
    position: "relative",
    whiteSpace: "nowrap",
    alignItems: "center"
  };
});
</script>

<style scoped>
@keyframes marqueeAnimation {
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(-50%);
  }
}

.q-marquee-inner {
  display: flex;
  flex-wrap: nowrap;
  min-width: 200%; /* Ensure the content is at least twice as wide as the container */
  animation: marqueeAnimation 25s linear infinite;
  will-change: transform; /* Optimizes performance and reduces flicker */
  transition: transform 25s linear;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
