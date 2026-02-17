<template>
  <div :class="props.tailwaindClasses">
    <!-- QDrawer Panel with only DrawerBody -->
    <div
      class="drawer-panel"
      :style="{
        position: 'fixed',
        top: 0,
        bottom: 0,
        zIndex: 999999,
        ...(props.position === 'left' ? { left: 0, right: 'unset' } : { right: 0, left: 'unset' }),
        transform: getTransform,
        transition: 'transform 0.4s ease-in-out',
        overflowY: 'auto',
        willChange: 'transform',
      }"
    >
      <component 
        v-if="drawerBodyNode" 
        :is="drawerBodyNode" 
      />
    </div>

    <!-- Toggle Button & All Other Children -->
    <div>
      <button
        :style="{
          zIndex: 1100,
          cursor: 'pointer'
        }"
        @click="toggleDrawer"
      >
        <!-- Render other children (trigger content) -->
         <component 
            v-for="(node, index) in otherChildrenNodes" 
            :is="node" 
            :key="node.key || index"
          />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, useSlots, watch, Fragment } from 'vue';
import { useRoute } from 'vue-router';
import QDrawerBody from '../qdrawerbody/QDrawerBody.vue';

defineOptions({
  name: 'QDrawer'
});

const props = defineProps({
  position: {
    type: String,
    default: 'left'
  },
  width: [String, Number],
  height: [String, Number],
  bgColor: String,
  color: {
    type: String, // rgba default in React
    default: 'rgba(14, 33, 61, 1.00)'
  },
  tailwaindClasses: {
    type: String,
    default: ''
  }
});

const isOpen = ref(false);
const route = useRoute();
const slots = useSlots();

// Watch for route changes to close the drawer
watch(
  () => route.path,
  () => {
    isOpen.value = false;
  }
);

const getTransform = computed(() => {
  if (isOpen.value) return 'translateX(0)';
  return props.position === 'right' ? 'translateX(100%)' : 'translateX(-100%)';
});

const toggleDrawer = () => {
  isOpen.value = !isOpen.value;
};

// Helper to flatten children (handle fragments)
const flattenChildren = (nodes) => {
  if (!nodes) return [];
  // Ensure we are working with an array
  const nodesArray = Array.isArray(nodes) ? nodes : [nodes];
  
  return nodesArray.flatMap(node => {
    if (node.type === Fragment) {
      // If it's a fragment, flatten its children
      // Handle case where children might be a function or other type if slot usage varies
      return flattenChildren(node.children);
    }
    return node;
  });
};

const separatedContent = computed(() => {
  // Access default slot
  const defaultSlot = slots.default;
  if (!defaultSlot) return { body: null, others: [] };
  
  const children = defaultSlot();
  const flatNodes = flattenChildren(children);
  
  // Find QDrawerBody
  const body = flatNodes.find(node => {
     // Check against imported component type or name property
     // node.type can be the component object or a string (for native tags)
     return (
        node.type === QDrawerBody || 
        node.type?.name === 'QDrawerBody' || 
        node.type?.__name === 'QDrawerBody' 
     );
  });

  const others = flatNodes.filter(node => node !== body);

  return { body, others };
});

const drawerBodyNode = computed(() => separatedContent.value.body);
const otherChildrenNodes = computed(() => separatedContent.value.others);

</script>
