<script setup>
import { ref, computed, useSlots, onMounted, onUnmounted, watch, cloneVNode, h } from 'vue';
import { generateStyle } from '../../utils/helper';

const props = defineProps({
  width: [String, Number],
  height: [String, Number],
  color: String,
  bgColor: String,
  bgUrl: String,
  isImageFill: { type: Boolean, default: false },
  isAbsoluteValue: { type: Boolean, default: false },
  overflow: { type: String, default: "" },
  zIndex: [String, Number],
  onClick: { type: Function, default: () => {} },
  tailwaindClasses: { type: String, default: "" },
  boxShadow: String,
  backgroundSize: String,
  sliderDirection: { type: String, default: "horizontal" },
  sliderIndicatorType: { type: String, default: "" },
  sliderArrowVisible: { type: String, default: "true" },
  arrowActiveColor: { type: String, default: "rgba(134, 182, 126, 0.38)" },
  arrowDeactivatedColor: { type: String, default: "rgba(33, 13, 214, 0.65)" },
  indicatorActiveColor: { type: String, default: "rgba(195, 128, 128, 0.51)" },
  indicatorDeactivatedColor: { type: String, default: "rgba(23, 21, 21, 0.97)" },
  indicatorPositionType: { type: String, default: "overlay" },
  sliderAutoPlay: { type: String, default: "true" },
  sliderAutoPlayDuration: { type: String, default: "4000ms" },
});

const slots = useSlots();
const currentIndex = ref(0);
const isTransitioning = ref(false);
const enableTransition = ref(true);
const sliderRef = ref(null);

const getChildren = () => {
    if (!slots.default) return [];
    
    // Flatten fragments and extract VNodes
    const flatten = (nodes) => {
        let result = [];
        nodes.forEach(node => {
            if (node.type === Symbol.for('v-fgt') || node.type === 'template') {
                 if (Array.isArray(node.children)) {
                     result = result.concat(flatten(node.children));
                 }
            } else if (typeof node.type !== 'symbol') {
                 result.push(node);
            }
        });
        return result;
    };
    return flatten(slots.default());
};

const children = computed(() => getChildren());
const totalSlides = computed(() => children.value.length || 0);
const isVertical = computed(() => props.sliderDirection === "vertical");

const prevSlide = () => {
    if (isTransitioning.value || currentIndex.value === 0) return;
    isTransitioning.value = true;
    currentIndex.value = currentIndex.value - 1;
};

const nextSlide = () => {
    if (isTransitioning.value || currentIndex.value === totalSlides.value - 1) return;
    isTransitioning.value = true;
    currentIndex.value = currentIndex.value + 1;
};

// AutoPlay
let autoPlayInterval = null;

const startAutoPlay = () => {
    if (props.sliderAutoPlay !== "true") return;

    const duration = parseInt(props.sliderAutoPlayDuration.toString().replace("ms", "")) || 4000;

    autoPlayInterval = setInterval(() => {
        if (currentIndex.value === totalSlides.value - 1) {
            enableTransition.value = false;
            currentIndex.value = 0;
            setTimeout(() => { enableTransition.value = true; }, 50);
        } else {
            currentIndex.value = currentIndex.value + 1;
        }
    }, duration);
};

const stopAutoPlay = () => {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
};

watch(() => [currentIndex.value, totalSlides.value, props.sliderAutoPlay, props.sliderAutoPlayDuration], () => {
    stopAutoPlay();
    startAutoPlay();
});

onMounted(() => {
    startAutoPlay();
});

onUnmounted(() => {
    stopAutoPlay();
});

// Mouse Scroll
const handleScroll = (e) => {
    const delta = isVertical.value ? e.deltaY : e.deltaX;
    if (delta > 0) nextSlide();
    else if (delta < 0) prevSlide();
};

onMounted(() => {
    if (sliderRef.value) {
        sliderRef.value.addEventListener("wheel", handleScroll);
    }
});

onUnmounted(() => {
     if (sliderRef.value) {
        sliderRef.value.removeEventListener("wheel", handleScroll);
    }
});

watch(currentIndex, () => {
    const timeout = setTimeout(() => {
        isTransitioning.value = false;
    }, 500);
});

// Styles
const containerStyle = computed(() => ({
    ...generateStyle({
        width: props.width,
        height: props.height,
        isAbsoluteValue: props.isAbsoluteValue,
        bgColor: props.bgColor,
        bgUrl: props.bgUrl,
        isImageFill: props.isImageFill,
        color: props.color,
        overflow: props.overflow,
        zIndex: props.zIndex,
        backgroundSize: props.backgroundSize,
        onClick: props.onClick,
    }),
    overflow: "hidden",
    position: "relative",
}));

const contentStyle = computed(() => {
    const count = totalSlides.value || 1; 
    return {
        display: "flex",
        flexDirection: "row",
        transition: enableTransition.value ? "transform 0.5s ease-in-out" : "none",
        transform: `translateX(-${currentIndex.value * (100 / count)}%)`,
        width: `${count * 100}%`,
        height: "100%",
    };
});

const slideStyle = computed(() => {
    const count = totalSlides.value || 1;
    return {
        flexShrink: 0,
        width: `${100 / count}%`,
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };
});

const indicatorWrapperStyle = computed(() => ({
    position: props.indicatorPositionType === "overlay" ? "absolute" : "relative",
    bottom: props.indicatorPositionType === "overlay" ? "10px" : "unset",
    width: "100%",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    padding: "8px",
    zIndex: 10,
}));

const getIndicatorStyle = (index) => {
    const isActive = currentIndex.value === index;
    const baseStyle = {
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };
    
    switch (props.sliderIndicatorType) {
        case "circle":
             return {
              ...baseStyle,
              width: isActive ? "15px" : "10px",
              height: isActive ? "15px" : "10px",
              borderRadius: "50%",
              background: isActive ? props.indicatorActiveColor : props.indicatorDeactivatedColor,
            };
        case "square":
             return {
              ...baseStyle,
              width: isActive ? "15px" : "10px",
              height: isActive ? "15px" : "10px",
              background: isActive ? props.indicatorActiveColor : props.indicatorDeactivatedColor,
            };
        case "dash":
            return {
              ...baseStyle,
              width: isActive ? "30px" : "15px",
              height: "15px",
              background: isActive ? props.indicatorActiveColor : props.indicatorDeactivatedColor,
              borderRadius: "5px",
            };
        case "number":
            return {
              ...baseStyle,
              padding: "4px 8px",
              background: isActive ? props.indicatorActiveColor : props.indicatorDeactivatedColor,
              borderRadius: "5px",
              fontSize: "12px",
            };
        case "thumbnail":
             const child = children.value[index];
             const thumbnail = child && child.props ? child.props.thumbnail : '';
             return {
              ...baseStyle,
              borderRadius: "2px",
              backgroundImage: `url(${thumbnail})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            };
        default:
            return baseStyle;
    }
}

const getThumbnailContainerStyle = (index) => {
    const isActive = currentIndex.value === index;
    return {
        width: isActive ? "30px" : "20px",
        height: isActive ? "30px" : "20px",
        overflow: "hidden",
        marginTop: props.indicatorPositionType === "overlay" ? "0px" : "30px",
        transition: "all 0.3s ease-in-out",
    };
}

const getThumbnailClone = (child) => {
    return cloneVNode(child, {
        style: {
            width: "100%",
            height: "100%",
            objectFit: "cover",
        }
    });
}
</script>

<template>
  <div class="relative w-full h-full">
     <div :class="`slider ${tailwaindClasses}`" ref="sliderRef" :style="containerStyle">
        <div class="slider-content" :style="contentStyle">
            <div 
                v-for="(child, index) in children" 
                :key="child.key || index" 
                :class="`slide ${index === currentIndex ? 'active' : ''}`"
                :style="slideStyle"
            >
                <component :is="child" />
            </div>
        </div>

        <!-- Arrows -->
        <template v-if="sliderArrowVisible === 'true'">
             <button
                class="prev absolute left-2 top-1/2 -translate-y-1/2 z-10"
                @click="prevSlide"
                :disabled="currentIndex === 0"
                :style="{
                  fontSize: '27px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: currentIndex === 0 ? arrowDeactivatedColor : arrowActiveColor,
                }"
             >❮</button>
             <button
                class="next absolute right-2 top-1/2 -translate-y-1/2 z-10"
                @click="nextSlide"
                :disabled="currentIndex === totalSlides - 1"
                :style="{
                  fontSize: '27px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: currentIndex === totalSlides - 1 ? arrowDeactivatedColor : arrowActiveColor,
                }"
             >❯</button>
        </template>
     </div>

     <!-- Indicators -->
     <div :style="indicatorWrapperStyle">
        <div v-for="(child, index) in children" :key="index" :style="getIndicatorStyle(index)" @click="currentIndex = index">
            <template v-if="sliderIndicatorType === 'number'">
                {{ index + 1 }}
            </template>
            <template v-if="sliderIndicatorType === 'thumbnail'">
                <div :style="getThumbnailContainerStyle(index)">
                     <component :is="getThumbnailClone(child)" />
                </div>
            </template>
        </div>
     </div>
  </div>
</template>

<style scoped>
    .slider-content {
    width: 100%;
    height: 100%;
    }

    .slide {
    overflow: hidden;
    }
</style>
