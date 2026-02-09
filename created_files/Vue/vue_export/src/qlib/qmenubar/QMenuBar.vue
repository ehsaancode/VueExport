<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  setOpenMenus: Function,
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
  isAbsoluteValue: String, // Checked as === "true" in source

  onClick: {
    type: String,
    default: "",
  },
  action: {
    type: String,
    default: "",
  },
  navigation: {
    type: String,
    default: "",
  },
  tailwaindClasses: String,
  boxShadow: String,
  foreground: String,
});

const router = useRouter();
const timeoutRef = ref(null);

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
  // Handle bgColor as solid, linear, or radial gradient
  let effectiveBgColor = "transparent";
  let effectiveBgImage = "";
  if (props.bgColor) {
    if (
      props.bgColor.trim().startsWith("linear-gradient(") ||
      props.bgColor.trim().startsWith("radial-gradient(")
    ) {
      effectiveBgImage = props.bgColor;
      effectiveBgColor = "transparent";
    } else {
      effectiveBgColor = props.bgColor;
    }
  }

  // Handle background image URL
  if (props.bgUrl && props.bgUrl !== "undefined" && props.bgUrl !== undefined) {
    const imgUrl = `url(${props.bgUrl})`;
    effectiveBgImage = effectiveBgImage
      ? `${imgUrl}, ${effectiveBgImage}`
      : imgUrl;
  }

  // Inline styles for the div container
  const style = {
    width: props.width,
    height: props.height,
    position: props.isAbsoluteValue === "true" ? "absolute" : "relative",
    color: props.color,
    backgroundColor: effectiveBgColor,
    backgroundImage: effectiveBgImage || undefined,
    backgroundSize: props.isImageFill ? "cover" : "contain",
    display: "flex",
    flexDirection: "row",
    cursor: props.onClick === "Yes" ? "pointer" : "default",
    boxShadow: props.boxShadow,
  };

  if (props.foreground) {
    style.background = props.foreground;
    style.WebkitBackgroundClip = "text";
    style.WebkitTextFillColor = "transparent";
  }

  return style;
});

const handleMouseLeave = () => {
  timeoutRef.value = setTimeout(() => {
    if (props.setOpenMenus) {
      props.setOpenMenus({});
    }
  }, 200); // Delayed menu close (1 sec - comment says 1 sec but code says 200ms)
};

const handleMouseEnter = () => {
  if (timeoutRef.value) {
    clearTimeout(timeoutRef.value); // Prevent closing if hovered back
  }
};
</script>

<template>
  <div
    @mouseleave="handleMouseLeave"
    @mouseenter="handleMouseEnter"
    @click="props.onClick === 'Yes' ? handleClick() : undefined"
    :style="containerStyle"
    :class="tailwaindClasses"
  >
    <slot />
  </div>
</template>
