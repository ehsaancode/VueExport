<script setup>
// Defines the props for the component
defineProps({
  tailwaindClasses: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div :class="tailwaindClasses">
    <slot />
  </div>
</template>
