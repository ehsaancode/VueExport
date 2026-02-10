<template>
  <div :class="tailwaindClasses">
    <slot></slot>
  </div>
</template>

<script setup>
defineOptions({
  name: 'QTab'
})

defineProps({
  tailwaindClasses: {
    type: String,
    default: ""
  }
})
</script>
