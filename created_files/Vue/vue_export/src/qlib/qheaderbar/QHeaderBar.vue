<template>
  <div ref="placeholderRef"></div>
  <div
    ref="headerRef"
    @click="onClick === 'Yes' ? handleClick() : null"
    :class="tailwaindClasses"
    :style="containerStyle"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
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
  isAbsoluteValue: String, // Note: passed as string "true"/"false" in React code usually if from XML attributes
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
  boxShadow: String,
  foreground: String,
  tailwaindClasses: String
});

const router = useRouter();
const headerRef = ref(null);
const placeholderRef = ref(null);
const isSticky = ref(false);
const headerHeight = ref(0);

const handleClick = () => {
  if (props.onClick === "Yes") {
    switch (props.action) {
      case "Navigate to":
        if (props.navigation) {
          router.push(`/${props.navigation}`);
        }
        break;
    }
  }
};

const handleScroll = () => {
  if (headerRef.value && placeholderRef.value) {
    const placeholderTop = placeholderRef.value.getBoundingClientRect().top;
    isSticky.value = placeholderTop <= 0;
  }
};

onMounted(() => {
  if (headerRef.value) {
    headerHeight.value = headerRef.value.offsetHeight;
  }
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const ensurePx = (value) =>
  value && typeof value === "string" && value.includes("px")
    ? value
    : `${value}px`;

const containerStyle = computed(() => {
  // Handle bgColor as solid, linear, or radial gradient
  let effectiveBgColor = "transparent";
  let effectiveBgImage = "";
  
  if (props.bgColor) {
    const bg = props.bgColor.trim();
    if (bg.startsWith("linear-gradient(") || bg.startsWith("radial-gradient(")) {
      effectiveBgImage = props.bgColor;
      effectiveBgColor = "transparent";
    } else {
      effectiveBgColor = props.bgColor;
    }
  }

  // Handle background image URL
  if (props.bgUrl && props.bgUrl !== "undefined" && props.bgUrl !== undefined) {
    const imgUrl = `url(${props.bgUrl})`;
    effectiveBgImage = effectiveBgImage ? `${imgUrl}, ${effectiveBgImage}` : imgUrl;
  }

  const foregroundStyle = props.foreground
    ? {
        background: props.foreground,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }
    : {};

  return {
    width: props.width,
    height: props.height,
    top: isSticky.value
      ? "0px"
      : props.positionedTop != null && props.isAbsoluteValue === "true"
      ? ensurePx(props.positionedTop)
      : "auto",
    left:
      props.positionedLeft != null && props.isAbsoluteValue === "true"
        ? ensurePx(props.positionedLeft)
        : "auto",
    right:
      props.positionedRight != null && props.isAbsoluteValue === "true"
        ? ensurePx(props.positionedRight)
        : "auto",
    bottom:
      props.positionedBottom != null && props.isAbsoluteValue === "true"
        ? ensurePx(props.positionedBottom)
        : "auto",
    color: props.color,
    backgroundColor: effectiveBgColor,
    backgroundImage: effectiveBgImage || undefined,
    boxShadow: props.boxShadow,
    zIndex: 50,
    display: "flex",
    flexDirection: props.crossAlignment === "align_center" ? "row" : "column",
    cursor: props.onClick === "Yes" ? "pointer" : "",
    ...foregroundStyle
  };
});
</script>
