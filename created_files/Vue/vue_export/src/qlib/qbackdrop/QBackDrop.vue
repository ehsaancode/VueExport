<script setup>
import { computed, useSlots, cloneVNode, h, Fragment } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
  index: {
    type: Number,
    required: true,
  },
  setIndex: {
    type: Function,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
  tailwaindClasses: {
    type: String,
    default: '',
  },
});

const slots = useSlots();

const getChildren = () => {
    if (!slots.default) return [];
    
    // Helper to flatten fragments/templates
    const flatten = (nodes) => {
        let result = [];
        nodes.forEach(node => {
            if (node.type === Fragment || node.type === 'template') {
                 if (Array.isArray(node.children)) {
                     result = result.concat(flatten(node.children));
                 }
            } else if (typeof node.type !== 'symbol') { // filter out comments/text if strict
                 result.push(node);
            }
        });
        return result;
    };
    return flatten(slots.default());
};

const components = computed(() => {
  const children = getChildren();
  let carousel = null;
  let closeIcon = null;
  let nextIcon = null;
  let prevIcon = null;

  children.forEach((child) => {
    const typeName = child.type?.name || child.type?.__name || child.type?.displayName;
    const widgetType = child.props?.clickableWidget;

    if (typeName === 'QCarousel') {
        carousel = child;
    } else if ((typeName === 'QIcon') && widgetType === 'close_icon') {
        closeIcon = child;
    } else if ((typeName === 'QIcon') && widgetType === 'right_icon') {
        nextIcon = child;
    } else if ((typeName === 'QIcon') && widgetType === 'left_icon') {
        prevIcon = child;
    }
  });

  return { carousel, closeIcon, nextIcon, prevIcon };
});

const renderCarousel = () => {
    const { carousel } = components.value;
    if (!carousel) return null;
    
    if (props.images && props.images[props.index]) {
        return cloneVNode(carousel, {}, {
            default: () => [props.images[props.index]]
        });
    }
    return carousel;
}

const renderCloseIcon = () => {
    const { closeIcon } = components.value;
    if (!closeIcon) return null;
    // cloneElement(child, { onClick: onClose })
    return cloneVNode(closeIcon, { onClick: props.onClose });
};

const renderNextIcon = () => {
    const { nextIcon } = components.value;
    if (!nextIcon) return null;
    return cloneVNode(nextIcon, { 
        onClick: () => props.setIndex((props.index + 1) % props.images.length) 
    });
};

const renderPrevIcon = () => {
    const { prevIcon } = components.value;
    if (!prevIcon) return null;
    return cloneVNode(prevIcon, { 
        onClick: () => props.setIndex((props.index - 1 + props.images.length) % props.images.length) 
    });
};

</script>

<template>
  <div
    :style="{ position: 'fixed' }"
    :class="`fixed inset-0 bg-black/80 z-[9999] flex justify-center items-center ${tailwaindClasses} w-full`"
  >
    <div class="relative w-full flex items-center justify-center">
      
      <!-- Close Icon -->
      <div v-if="components.closeIcon" class="absolute top-4 right-4 z-10 cursor-pointer">
        <component :is="renderCloseIcon()" />
      </div>

      <!-- Prev Icon -->
      <div v-if="components.prevIcon" class="absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer">
        <component :is="renderPrevIcon()" />
      </div>

      <!-- Next Icon -->
      <div v-if="components.nextIcon" class="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer">
        <component :is="renderNextIcon()" />
      </div>

      <!-- Carousel -->
      <component :is="renderCarousel()" />
      
    </div>
  </div>
</template>
