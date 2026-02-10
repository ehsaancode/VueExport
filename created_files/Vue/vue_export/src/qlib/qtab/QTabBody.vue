<template>
  <div v-if="isVisible" :class="tailwaindClasses">
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
  }
})
</script>
