<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  get,
  subscribe,
  setFormErrorSet,
  getPaginationValues,
  setPaginationCurrentPage,
} from '../../store';
import { generateStyle } from '../../utils/helper';
import { runDynamicAnimations } from '../../utils/animationUtils';

const props = defineProps({
  height: String,
  width: String,
  bgColor: String,
  isAbsoluteValue: [Boolean, String],
  imageFit: String,
  alt: String,
  bgUrl: String,
  isImageFill: [Boolean, String],
  action: { type: String, default: '' },
  navigation: { type: String, default: '' },
  isAnimationP: [Boolean, String],
  animationEasing: String,
  animationDirection: String,
  animationType: String,
  animationIterations: [String, Number],
  animationDelay: [String, Number],
  animationDuration: [String, Number],
  isRevarsed: [Boolean, String],
  maxValue: [String, Number],
  minValue: [String, Number],
  shadowOffsetX: [String, Number],
  shadowOffsetY: [String, Number],
  shadowBlurRadius: [String, Number],
  shadowSpreadRadius: { type: [String, Number], default: '0px' },
  shadowColor: String,
  overflow: { type: String, default: '' },
  zIndex: [String, Number],
  iconLink: String,
  Pagination: [Boolean, String],
  taggedKey: String,
  tailwaindClasses: String,
  boxShadow: String,
  foreground: String,
  useCase: String,
  cms_form_Id: String,
  cms_form_input_Id: String,
  onClick: Function,
});

const router = useRouter();
const iconRef = ref(null);

/** Pagination state */
const paginationValues = ref({
  totalItemsValue: 0,
  itemsPerPageValue: 5,
  currentPageValue: 1,
});

let paginationInterval = null;

const updatePagination = () => {
  paginationValues.value = getPaginationValues();
};

onMounted(() => {
  updatePagination();
  paginationInterval = setInterval(updatePagination, 120);
});

onUnmounted(() => {
  if (paginationInterval) clearInterval(paginationInterval);
});

const canNextPage = computed(() => {
  const { currentPageValue, totalItemsValue, itemsPerPageValue } = paginationValues.value;
  return currentPageValue < Math.ceil(totalItemsValue / itemsPerPageValue);
});

const canPreviousPage = computed(() => {
  return paginationValues.value.currentPageValue > 1;
});

/** Animation on scroll */
const isVisible = ref(false);
const hasAnimated = ref(false);
let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !hasAnimated.value) {
      isVisible.value = true;
      hasAnimated.value = true;
    }
  }, { threshold: 0.2 });

  if (iconRef.value) observer.observe(iconRef.value);
});

onUnmounted(() => {
  if (observer && iconRef.value) observer.unobserve(iconRef.value);
});

// Watch iconRef to re-attach observer if the element changes (e.g. switching between div and img)
watch(iconRef, (newEl, oldEl) => {
  if (observer) {
    if (oldEl) observer.unobserve(oldEl);
    if (newEl) observer.observe(newEl);
  }
});

const runAnimationShim = () => {
  if (props.isAnimationP === 'true' || props.isAnimationP === true) {
    // Shim for React ref structure { current: element }
    const reactRefShim = { current: iconRef.value };
    runDynamicAnimations({
      ref: reactRefShim,
      isVisible: isVisible.value,
      animationType: props.animationType,
      animationDirection: props.animationDirection,
      animationEasing: props.animationEasing,
      animationIterations: props.animationIterations,
      animationDelay: props.animationDelay,
      animationDuration: props.animationDuration,
      isRevarsed: props.isRevarsed,
      maxValue: props.maxValue,
      minValue: props.minValue,
    });
  }
};

watch(isVisible, (newVal) => {
  if (newVal) runAnimationShim();
});

/** style logic */
const baseImageStyle = computed(() => {
  return generateStyle({
    width: props.width,
    height: props.height,
    isAbsoluteValue: props.isAbsoluteValue,
    bgColor: props.bgColor,
    bgUrl: props.bgUrl,
    isImageFill: props.isImageFill,
    overflow: props.overflow,
    zIndex: props.zIndex,
    imageFit: props.imageFit,
    boxShadow: props.boxShadow,
    ...(props.foreground && {
      background: props.foreground,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }),
  });
});

const imageStyle = computed(() => ({
  ...baseImageStyle.value,
  cursor: 'pointer',
}));

const imageStyle1 = computed(() => ({
  ...imageStyle.value,
  cursor: !canNextPage.value ? 'not-allowed' : 'pointer',
  opacity: !canNextPage.value ? 0.5 : 1,
  pointerEvents: !canNextPage.value ? 'none' : 'auto',
}));

const imageStyle2 = computed(() => ({
  ...imageStyle.value,
  cursor: !canPreviousPage.value ? 'not-allowed' : 'pointer',
  opacity: !canPreviousPage.value ? 0.5 : 1,
  pointerEvents: !canPreviousPage.value ? 'none' : 'auto',
}));

/** trailing icon */
const selectedErrorSet = ref(null);
const clickIndexState = ref(false);

const getSelectedErrorSetFn = () => {
  const global = get('formErrorSet');
  return global?.[props.cms_form_Id]?.[props.cms_form_input_Id];
};

const updateErrorSet = () => {
  const formData = getSelectedErrorSetFn();
  if (formData) selectedErrorSet.value = formData;
};

onMounted(() => {
  updateErrorSet();
  const unsub = subscribe(updateErrorSet);
  onUnmounted(() => {
    unsub();
  });
});

/** INTERNAL CLICK HANDLER */
const handleInternalClick = () => {
  // trailing icon
  if (props.useCase === 'trailingIcon') {
    const newValue = !clickIndexState.value;
    clickIndexState.value = newValue;

    const updatedErrorSet = {
      ...(selectedErrorSet.value || {}),
      clickValue: newValue,
    };

    setFormErrorSet({
      cms_form_Id: props.cms_form_Id,
      cmsFormInputLabel: props.cms_form_input_Id,
      errorSet: updatedErrorSet,
    });

    selectedErrorSet.value = updatedErrorSet;
    return;
  }

  // pagination
  if (props.Pagination === 'true' || props.Pagination === true) {
    if (props.taggedKey === 'increment' && canNextPage.value) {
      setPaginationCurrentPage(paginationValues.value.currentPageValue + 1);
    } else if (props.taggedKey === 'decrement' && canPreviousPage.value) {
      setPaginationCurrentPage(paginationValues.value.currentPageValue - 1);
    }
    return;
  }

  // normal navigation
  if (props.navigation) {
    router.push(props.navigation);
  }
};

/** FINAL CLICK HANDLER */
const handleClick = (e) => {
  // 1. Run gallery/backdrop click first (close/next/prev)
  if (props.onClick) props.onClick(e);

  // 2. Run internal click logic (pagination/trailing/navigation)
  handleInternalClick(e);
};

const hasForeground = computed(() => {
  return (
    (props.foreground && props.foreground !== 'undefined') ||
    props.tailwaindClasses?.includes('text-')
  );
});

const activeStyle = computed(() => {
  if (props.taggedKey === 'increment') return imageStyle1.value;
  if (props.taggedKey === 'decrement') return imageStyle2.value;
  return imageStyle.value;
});

const fgStyle = computed(() => {
  return props.foreground && props.foreground !== 'undefined'
    ? { background: props.foreground }
    : { backgroundColor: 'currentColor' };
});
</script>

<template>
  <div
    v-if="hasForeground"
    ref="iconRef"
    :aria-label="alt"
    role="img"
    @click="handleClick"
    :class="tailwaindClasses || ''"
    :style="{
      ...activeStyle,
      display: activeStyle.display || 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }"
  >
    <div
      :style="{
        width: '100%',
        height: '100%',
        maskImage: `url(${iconLink})`,
        WebkitMaskImage: `url(${iconLink})`,
        maskSize: imageFit === 'cover' ? 'cover' : imageFit === 'fill' ? '100% 100%' : 'contain',
        WebkitMaskSize: imageFit === 'cover' ? 'cover' : imageFit === 'fill' ? '100% 100%' : 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        ...fgStyle,
      }"
    ></div>
  </div>

  <img
    v-else
    ref="iconRef"
    :src="iconLink"
    :alt="alt"
    @click="handleClick"
    :class="tailwaindClasses || ''"
    :style="activeStyle"
  />
</template>
