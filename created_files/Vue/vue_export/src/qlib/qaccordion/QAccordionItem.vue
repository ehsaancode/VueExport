<template>
  <div class="accordion-item">
    <div
      class="accordion-title flex flex-row justify-between items-center"
      style="cursor: pointer"
      @click="toggle"
    >
      <!-- Render non-icon title content first -->
      <component 
        v-for="(child, i) in otherTitleChildren" 
        :is="child" 
        :key="child.key || i" 
      />
      
      <!-- Then render the icon -->
      <div class="mr-[10px]">
         <component v-if="iconChild" :is="iconChild" />
      </div>
    </div>

    <div
      class="accordion-content"
      :style="{ display: isOpen ? 'block' : 'none' }"
    >
      <component v-if="bodyChild" :is="bodyChild" />
    </div>
  </div>
</template>

<script setup>
import { inject, ref, computed, useSlots, onMounted, Fragment } from 'vue';

defineOptions({
  name: 'QAccordionItem'
});

const context = inject('accordionContext');
const index = ref(null);
const slots = useSlots();

onMounted(() => {
  if (context?.registerItem) {
    index.value = context.registerItem();
  }
});

const isOpen = computed(() => {
  if (!context || index.value === null) return false;
  const item = context.openItems.value.find((item) => item.index === index.value);
  return item ? item.open : false;
});

const toggle = () => {
  if (context?.toggleItem && index.value !== null) {
    context.toggleItem(index.value);
  }
};

// Helper for VNode inspection
const getTypeOptions = (vnode) => {
    if (!vnode) return null;
    return vnode.type || {};
};

const isAccordionBody = (vnode) => {
    const type = getTypeOptions(vnode);
    // Component might be registered with various name formats
    return type.name === 'QAccordionBody' || type.__name === 'QAccordionBody' || type.displayName === 'QAccordionBody';
};

const isIcon = (vnode) => {
    const type = getTypeOptions(vnode);
    return type.name === 'QIcon' || type.__name === 'QIcon' || type.displayName === 'QIcon'; 
};

// Flatten children to handle fragments (Vue's equivalent of React.Children.toArray behavior for nested arrays/fragments)
const flattenChildren = (nodes) => {
  if (!nodes) return [];
  const nodesArray = Array.isArray(nodes) ? nodes : [nodes];
  return nodesArray.flatMap(node => {
     if (node.type === Fragment) {
       return flattenChildren(node.children);
     }
     return node;
  });
};

const processedChildren = computed(() => {
    if (!slots.default) return { bodyChild: null, iconChild: null, otherTitleChildren: [] };
    
    // Execute the slot function to get current VNodes
    const children = flattenChildren(slots.default());
    
    const bodyChild = children.find(isAccordionBody);
    const titleChildren = children.filter(c => !isAccordionBody(c));
    
    // Find QIcon within the title components
    const iconChild = titleChildren.find(isIcon);
    const otherTitleChildren = titleChildren.filter(c => !isIcon(c));
    
    return { bodyChild, iconChild, otherTitleChildren };
});

const bodyChild = computed(() => processedChildren.value.bodyChild);
const iconChild = computed(() => processedChildren.value.iconChild);
const otherTitleChildren = computed(() => processedChildren.value.otherTitleChildren);

</script>
