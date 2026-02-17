<template>
  <div
    :class="['accordion flex flex-col gap-[20px]', tailwaindClasses]"
    :style="finalStyle"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, computed, provide } from "vue";
import { generateStyle } from "@/utils/helper";

defineOptions({
  name: "QAccordion",
});

const props = defineProps({
  tailwaindClasses: {
    type: String,
    default: "",
  },
  width: [String, Number],
  height: [String, Number],
  positionedLeft: [String, Number],
  positionedTop: [String, Number],
  positionedRight: [String, Number],
  positionedBottom: [String, Number],
  color: String,
  bgColor: String,
  bgUrl: String,
  isImageFill: Boolean,
  isAbsoluteValue: Boolean,
  onClick: {
    type: [Function, String],
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
  boxShadow: String,
  foreground: String,
  customStyle: {
    type: Object,
    default: () => ({}),
  },
});

// State for open items
const openItems = ref([]);
const itemCount = ref(0);

// Toggle function mimicking React's logic
const toggleItem = (index) => {
  const itemIndex = openItems.value.findIndex((item) => item.index === index);
  if (itemIndex !== -1) {
    openItems.value[itemIndex].open = !openItems.value[itemIndex].open;
  } else {
      // If for some reason the item isn't tracked yet (shouldn't happen with registration)
      // fallback or ignore
  }
};

// Registration for children to get their index
const registerItem = () => {
    const index = itemCount.value++;
    openItems.value.push({ index, open: false });
    return index;
};

// Provide context to children (QAccordionItem will inject this)
provide("accordionContext", {
  openItems,
  toggleItem,
  registerItem
});

// Compute styles
const finalStyle = computed(() => {
  const containerStyle = {
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
      overflow: props.overflow,
      onClick: props.onClick,
      zIndex: props.zIndex,
      fontSize: props.fontSize,
      fontWeight: props.fontWeight,
      textAlign: props.textAlign,
      fontFamily: props.fontFamily,
      fontStyle: props.fontStyle,
      imageFit: props.imageFit,
      decoration: props.decoration,
      boxShadow: props.boxShadow,
    }),
    ...(props.foreground
      ? {
          background: props.foreground,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }
      : {}),
  };

  return { ...containerStyle, ...props.customStyle };
});
</script>
