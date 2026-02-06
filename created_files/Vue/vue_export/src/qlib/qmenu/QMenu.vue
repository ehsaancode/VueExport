<template>
  <div
    class="cursor-pointer relative h-auto"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  id: String
});

const emit = defineEmits(['mouseenter', 'mouseleave']);

const handleMouseEnter = (event) => {
  emit('mouseenter', event);
};

const handleMouseLeave = (event) => {
  emit('mouseleave', event);
};
</script>
