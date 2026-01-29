<script setup>
import { ref, useSlots, computed, cloneVNode, Fragment } from 'vue';

const props = defineProps({
  column: { type: [Number, String], default: 3 },
  vSpace: { type: String, default: '10px' },
  hSpace: { type: String, default: '10px' },
  tailwaindClasses: { type: String, default: '' },
});

const showBackDrop = ref(false);
const activeIndex = ref(0);

const slots = useSlots();

const getChildren = () => {
    const defaultSlot = slots.default ? slots.default() : [];
    
    const flatten = (nodes) => {
        let result = [];
        nodes.forEach(node => {
            if (node.type === Fragment) {
                 if (Array.isArray(node.children)) {
                     result = result.concat(flatten(node.children));
                 }
            } else if(node.type === 'template') {
                 if (Array.isArray(node.children)) {
                     result = result.concat(flatten(node.children));
                 }
            } else if (typeof node.type !== 'symbol' || node.type !== Symbol.for('v-cmt')) {
                // Filter out comments if possible, but keep other nodes
                result.push(node);
            }
        });
        return result;
    };
    return flatten(defaultSlot);
}

// Separate images and BackDrop
const childInfo = computed(() => {
    // We invoke getChildren() inside computed, this works but relies on slot updates triggering re-render
    const allChildren = getChildren();
    let backDropNode = null;
    const imageNodes = [];

    allChildren.forEach(child => {
        // Check for QBackDrop
        // child.type.name for Options API / displayName
        // child.type.__name for Script Setup
        const name = child.type?.name || child.type?.__name || child.type?.displayName;
        if (name === 'QBackDrop') {
            backDropNode = child;
        } else {
            imageNodes.push(child);
        }
    });

    return { backDropNode, imageNodes };
});

const enhancedBackDrop = computed(() => {
    const { backDropNode, imageNodes } = childInfo.value;
    if (!showBackDrop.value || !backDropNode) return null;

    // cloneVNode allows adding/overriding props
    return cloneVNode(backDropNode, {
        backDrop: backDropNode,
        images: imageNodes, 
        index: activeIndex.value,
        setIndex: (val) => { activeIndex.value = val; },
        onClose: () => { showBackDrop.value = false; }
    });
});

const openBackDrop = (index) => {
    activeIndex.value = index;
    showBackDrop.value = true;
};
</script>

<template>
  <div> <!-- Root element needed for Fragment support in some contexts, but Vue 3 fully supports fragments. Keeping div for safety with siblings. -->
    <div
      :class="tailwaindClasses"
      :style="{ columnGap: hSpace, rowGap: vSpace, columnCount: column }"
    >
        <div 
            v-for="(child, index) in childInfo.imageNodes" 
            :key="child.key || index" 
            @click="openBackDrop(index)"
            :style="{ cursor: 'pointer', marginBottom: hSpace }"
        >
            <component :is="child" />
        </div>
    </div>

    <component :is="enhancedBackDrop" v-if="enhancedBackDrop" />
  </div>
</template>
