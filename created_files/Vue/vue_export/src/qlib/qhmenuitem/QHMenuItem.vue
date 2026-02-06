<template>
  <div
    :class="tailwaindClasses"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @click="onClick === 'Yes' ? handleClick() : null"
    :style="containerStyle"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

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
  
  isAbsoluteValue: [String, Boolean],
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
  tailwaindClasses: String,
  backgroundSize: String,
  boxShadow: String,
});

const emit = defineEmits(['mouseenter', 'mouseleave']);

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

const onMouseEnter = (e) => emit('mouseenter', e);
const onMouseLeave = (e) => emit('mouseleave', e);

const containerStyle = computed(() => {
  let effectiveBgColor = "transparent";
  let effectiveBgImage = "";

  if (props.bgColor) {
    if (props.bgColor.trim().startsWith("linear-gradient(") || props.bgColor.trim().startsWith("radial-gradient(")) {
      effectiveBgImage = props.bgColor;
      effectiveBgColor = "transparent";
    } else {
      effectiveBgColor = props.bgColor;
    }
  }

  if (props.bgUrl && props.bgUrl !== "undefined" && props.bgUrl !== undefined) {
    const imgUrl = `url(${props.bgUrl})`;
    effectiveBgImage = effectiveBgImage ? `${imgUrl}, ${effectiveBgImage}` : imgUrl;
  }

  // Handle isAbsoluteValue logic based on original React code which checked for string "true"
  // But we should encompass boolean true as well for robustness if passed as a prop
  const isAbs = props.isAbsoluteValue === "true" || props.isAbsoluteValue === true;

  const widthStyle = (props.tailwaindClasses?.includes("w-[auto]") ?? false) 
    ? "100%" 
    : `${props.width}`;

  return {
    width: widthStyle,
    height: `${props.height}`,
    position: isAbs ? "absolute" : "relative",
    backgroundColor: effectiveBgColor,
    backgroundImage: effectiveBgImage || undefined,
    backgroundSize: props.isImageFill ? "cover" : "contain",
    display: "flex",
    flexDirection: "column",
    cursor: props.onClick === "Yes" ? "pointer" : "default",
  };
});
</script>
