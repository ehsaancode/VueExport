<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  width: [String, Number],
  bgUrl: String,
  onClick: { type: String, default: '' },
  action: { type: String, default: '' },
  navigation: { type: String, default: '' },
  tailwaindClasses: { type: String, default: '' },
  type: { type: String, default: '' }, // horizontal / vertical
});

const router = useRouter();
const parallaxRef = ref(null);
const backgroundRef = ref(null);

const baseHeight = ref(600);
const finalHeight = ref(600);

const updateHeightFromClasses = () => {
    // Match only `h-[...]` (not min-h or max-h)
    const match = props.tailwaindClasses ? props.tailwaindClasses.match(/(?:^|\s)h-\[(\d+(?:\.\d+)?)px\](?=\s|$)/) : null;

    if (match) {
        const parsed = parseFloat(match[1]);
        baseHeight.value = parsed;
        finalHeight.value = parsed;
    }
}

onMounted(() => {
    updateHeightFromClasses();
});

watch(() => props.tailwaindClasses, updateHeightFromClasses);

const handleClick = () => {
    if (props.onClick === "Yes" && props.action === "Navigate to" && props.navigation) {
        router.push(`/${props.navigation}`);
    }
};

const normalizedType = computed(() => props.type ? props.type.toLowerCase() : "vertical");

const handleScroll = () => {
    if (!parallaxRef.value || !backgroundRef.value) return;

    const rect = parallaxRef.value.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top >= windowHeight || rect.bottom <= 0) {
        backgroundRef.value.style.transform = normalizedType.value === "horizontal" ? "translateX(0px)" : "translateY(0px)";
        return;
    }

    const progress = Math.max(0, Math.min((windowHeight - rect.top) / (windowHeight + rect.height), 1));
    const rawOffset = (progress - 0.5) * 120;
    // Clamp transform offset to avoid excessive movement
    const offsetBackground = Math.max(-60, Math.min(rawOffset, 60));

    if (normalizedType.value === "horizontal") {
         backgroundRef.value.style.transform = `translateX(${offsetBackground}px)`;
    } else {
         backgroundRef.value.style.transform = `translateY(${offsetBackground}px)`;
    }
    
    finalHeight.value = baseHeight.value; 
};

onMounted(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount to set initial position
    handleScroll();
});

onUnmounted(() => {
     window.removeEventListener("scroll", handleScroll);
});

const containerStyle = computed(() => ({
    position: "relative",
    width: props.width || "100%",
    height: `${finalHeight.value}px`,
    overflow: "hidden",
    transition: "height 0.2s ease-out",
}));

const computedBgStyle = computed(() => {
    const isHorizontal = normalizedType.value === 'horizontal';
    
    // Logic matching React's object spread overriding
    return {
        ...(isHorizontal ? { width: "calc(100% + 120px)", height: "100%" } : { width: "100%", height: "calc(100% + 120px)" }),
        height: "calc(100% + 120px)", 
        backgroundImage: props.bgUrl ? `url(${props.bgUrl})` : "",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "transform 0.2s ease-out",
        willChange: "transform",
    };
});

const bgClasses = computed(() => normalizedType.value === "horizontal"
    ? "absolute top-0 -left-[60px] h-full z-[1]"
    : "absolute -top-[60px] left-0 w-full z-[1]"
);
</script>

<template>
    <div
      ref="parallaxRef"
      @click="onClick === 'Yes' ? handleClick($event) : undefined"
      :style="containerStyle"
      :class="tailwaindClasses"
    >
      <div v-if="bgUrl" ref="backgroundRef" :class="bgClasses" :style="computedBgStyle"></div>
      <div class="relative z-[2]"><slot></slot></div>
    </div>
</template>
