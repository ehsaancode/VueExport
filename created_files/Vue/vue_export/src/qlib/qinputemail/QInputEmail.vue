<template>
  <input
    :placeholder="formattedHeaderText"
    type="email"
    required
    :name="headerText"
    :style="containerStyle"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  />
</template>

<script setup>
import { ref, computed } from "vue";

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
  shadowBlurRadius: String,
  shadowColor: String,
  shadowOffsetX: String,
  shadowOffsetY: String,
  shadowSpreadRadius: String,
  widthType: String,
  heightType: String,
  headerText: { type: String, default: "" },
  fontSize: String,
  fontFamily: String,
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
  isAbsoluteValue: String,
});

const isHovered = ref(false);

const ensurePx = (value) =>
  value && typeof value === "string" && value.includes("px")
    ? value
    : `${value}px`;

const formattedHeaderText = computed(() => {
  return props.headerText
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
});

const containerStyle = computed(() => {
  const defaultBorderWidth = "1px";
  const defaultBorderColor = "rgb(153, 147, 147)";

  const finalBorderTW = props.borderTW || defaultBorderWidth;
  const finalBorderTC = props.borderTC || defaultBorderColor;
  const finalBorderBW = props.borderBW || defaultBorderWidth;
  const finalBorderBC = props.borderBC || defaultBorderColor;
  const finalBorderLW = props.borderLW || defaultBorderWidth;
  const finalBorderLC = props.borderLC || defaultBorderColor;
  const finalBorderRW = props.borderRW || defaultBorderWidth;
  const finalBorderRC = props.borderRC || defaultBorderColor;

  const style = {
    width: props.width,
    height: props.height,
    position: props.isAbsoluteValue === "true" ? "absolute" : "",
    left:
      props.positionedLeft != null && props.isAbsoluteValue === "true"
        ? ensurePx(props.positionedLeft)
        : "auto",
    top:
      props.positionedTop != null && props.isAbsoluteValue === "true"
        ? ensurePx(props.positionedTop)
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
    backgroundColor: isHovered.value
      ? "#f2f2f2"
      : props.bgColor || "transparent",

    // Borders
    borderTop: `${finalBorderTW} solid ${finalBorderTC}`,
    borderBottom: `${finalBorderBW} solid ${finalBorderBC}`,
    borderLeft: `${finalBorderLW} solid ${finalBorderLC}`,
    borderRight: `${finalBorderRW} solid ${finalBorderRC}`,

    boxShadow: `${props.shadowOffsetX || "0px"} ${props.shadowOffsetY || "0px"} ${props.shadowBlurRadius || "0px"} ${props.shadowSpreadRadius || "0px"} ${props.shadowColor || "transparent"}`,
    fontSize: props.fontSize,
    fontFamily:
      props.fontFamily &&
      props.fontFamily !== "" &&
      props.fontFamily !== "undefined"
        ? props.fontFamily
        : "unset",
  };

  // Padding
  if (props.paddingTop) style.paddingTop = props.paddingTop;
  if (props.paddingRight) style.paddingRight = props.paddingRight;
  if (props.paddingBottom) style.paddingBottom = props.paddingBottom;
  if (props.paddingLeft) style.paddingLeft = props.paddingLeft;

  // Margin
  if (props.marginLeft) style.marginLeft = props.marginLeft;
  if (props.marginTop) style.marginTop = props.marginTop;
  if (props.marginRight) style.marginRight = props.marginRight;
  if (props.marginBottom) style.marginBottom = props.marginBottom;

  // Background Image
  if (props.bgUrl && props.bgUrl !== "undefined" && props.bgUrl !== undefined) {
    style.backgroundImage = `url(${props.bgUrl})`;
  }

  // Border Radius
  if (
    props.borderTLR !== undefined ||
    props.borderTRR !== undefined ||
    props.borderBLR !== undefined ||
    props.borderBRR !== undefined
  ) {
    if (props.borderTLR !== undefined)
      style.borderTopLeftRadius = `${props.borderTLR}px`;
    if (props.borderTRR !== undefined)
      style.borderTopRightRadius = `${props.borderTRR}px`;
    if (props.borderBLR !== undefined)
      style.borderBottomLeftRadius = `${props.borderBLR}px`;
    if (props.borderBRR !== undefined)
      style.borderBottomRightRadius = `${props.borderBRR}px`;
  } else if (props.borderRadius) {
    style.borderRadius = props.borderRadius;
  }

  return style;
});
</script>
