<template>
  <div class="q-component-stub QCarousel">
    QCarousel (Stub)
    <slot></slot>
  </div>
</template>

<script setup>
// Stub component for QCarousel
const props = defineProps({
  tailwaindClasses: String,
  widgetId: String,
  // Accept any other props loosely
});
</script>

<style scoped>
.q-component-stub {
  border: 1px dashed red;
  padding: 4px;
  color: red;
}
</style>
