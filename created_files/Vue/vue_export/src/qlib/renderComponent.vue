<script setup>
import { computed } from "vue";
import componentsMap from "./componentsMap";

const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
  index: {
    type: [Number, String],
    default: undefined,
  },
});

const componentType = computed(() => {
  const type = props.config.type;
  return componentsMap[type] || type;
});

const componentProps = computed(() => props.config.props || {});
const children = computed(() => props.config.children || []);
const key = computed(() => props.config.key);
</script>

<template>
  <component
    v-if="componentType"
    :is="componentType"
    v-bind="componentProps"
    :index="index"
    :key="key"
  >
    <!-- Recursive rendering of children -->
    <renderComponent
      v-for="(child, idx) in children"
      :key="child.key || idx"
      :config="child"
      :index="idx"
    />
  </component>
</template>

<script>
// Recursive component needs a name for self-reference (in options API or with defineOptions in 3.3+)
// Since we are using <script setup>, we can use a separate script block or assume the filename is the name (renderComponent).
export default {
  name: "renderComponent",
};
</script>
