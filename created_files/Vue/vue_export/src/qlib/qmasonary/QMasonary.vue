<script setup>
import { ref, computed, useSlots, cloneVNode, isVNode, Fragment, defineComponent } from 'vue';

const props = defineProps({
  column: {
    type: Number,
    default: 3,
  },
  vSpace: {
    type: String,
    default: "10px",
  },
  hSpace: {
    type: String,
    default: "10px",
  },
  tailwaindClasses: {
    type: String,
    default: "",
  },
});

const slots = useSlots();
const showBackDrop = ref(false);
const activeIndex = ref(0);

// Helper to flatten fragments and filter valid elements
const getValidChildren = () => {
    if (!slots.default) return [];
    
    const flatten = (nodes) => {
        let result = [];
        nodes.forEach(node => {
            if (node.type === Fragment) {
                 if (Array.isArray(node.children)) {
                     result = result.concat(flatten(node.children));
                 }
            } else if (isVNode(node)) {
                 // React's isValidElement returns false for strings/numbers. 
                 // We filter for Components (object) or Elements (string tags).
                 // We exclude Symbol types (Text, Comment, etc.)
                 if (typeof node.type !== 'symbol') {
                    result.push(node);
                 }
            }
        });
        return result;
    };
    
    return flatten(slots.default());
};

const processedChildren = computed(() => {
    const children = getValidChildren();
    let backDrop = null;
    const itemCandidates = [];

    children.forEach((child) => {
        // Identify QBackDrop
        // Checking .name (options API) or .__name (script setup)
        const typeName = child.type?.name || child.type?.__name || child.type?.displayName;
        
        if (typeName === 'QBackDrop') {
            backDrop = child;
        } else {
            itemCandidates.push(child);
        }
    });

    // Arrange images column-wise
    const { column } = props;
    const reorderedImages = [];
    
    // Simulate the React logic: 
    // for (let i = 1; i <= column; i++) ...
    for (let i = 1; i <= column; i++) {
        for (let j = 1; j <= itemCandidates.length; j++) {
            if ((j - i) % column === 0) {
                reorderedImages.push(itemCandidates[j - 1]);
            }
        }
    }

    return { 
        images: reorderedImages, 
        baseImages: itemCandidates, // The original list, but we use reordered for display
        backDrop 
    };
});

const openBackDrop = (index) => {
    activeIndex.value = index;
    showBackDrop.value = true;
};

const closeBackDrop = () => {
    showBackDrop.value = false;
};

// Render the backdrop with injected props
const renderedBackDrop = computed(() => {
    const { backDrop, images } = processedChildren.value;
    
    if (showBackDrop.value && backDrop) {
        return cloneVNode(backDrop, {
            // Pass the reordered images array to backdrop as 'images' prop
            // (Note: The React code passed 'temImageArray' which is the reordered one)
            images: images,
            index: activeIndex.value,
            setIndex: (val) => activeIndex.value = val,
            onClose: closeBackDrop,
        });
    }
    return null;
});

</script>

<template>
  <div>
    <!-- Grid/Masonry Container -->
    <div
      :class="tailwaindClasses"
      :style="{ columnCount: column, columnGap: hSpace }"
    >
      <div
        v-for="(child, index) in processedChildren.images"
        :key="index"
        @click="openBackDrop(index)"
        :style="{ marginBottom: vSpace }"
      >
        <component :is="child" />
      </div>
    </div>

    <!-- BackDrop -->
    <component :is="renderedBackDrop" v-if="renderedBackDrop" />
  </div>
</template>
