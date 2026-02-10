<template>
  <div v-if="isVisible" :class="tailwaindClasses" :style="{ background: bgColor }">
    <slot></slot>
  </div>
</template>

<script setup>
defineOptions({
  name: 'QTabBody'
})

defineProps({
  isVisible: {
    type: Boolean,
    default: true
  },
  tailwaindClasses: {
    type: String,
    default: ""
  },
  bgColor: {
    type: String,
    default: ""
  }
})
</script>
