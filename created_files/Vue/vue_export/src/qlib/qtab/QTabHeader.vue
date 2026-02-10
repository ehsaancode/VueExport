<template>
  <div
    :class="[`cursor-pointer`, tailwaindClasses, isActive ? 'font-bold' : '']"
    :style="headerStyle"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';

defineOptions({
  name: 'QTabHeader'
})

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  },
  indicatorColor: {
    type: String,
    default: ""
  },
  indicatorHeight: {
    type: String,
    default: "3px" // defaulting to likely value if not passed, though QTabBar passes it
  },
  tailwaindClasses: {
    type: String,
    default: ""
  },
  tabDirection: {
    type: String,
    default: "Top"
  }
})

const headerStyle = computed(() => {
  if (!props.isActive) return {};

  switch (props.tabDirection) {
    case "Top":
      return { borderBottom: `${props.indicatorHeight} solid ${props.indicatorColor}` };
    case "Bottom":
      return { borderTop: `${props.indicatorHeight} solid ${props.indicatorColor}` };
    case "Left":
      return {
        backgroundColor: props.indicatorColor,
      };
    case "Right":
      return {
        backgroundColor: props.indicatorColor,
      };
    default:
      return {};
  }
})
</script>
