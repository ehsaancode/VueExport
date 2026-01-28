<template>
  <template v-for="(toastsInGroup, pos) in groupedToasts" :key="pos">
    <div
      class="fixed z-50 flex gap-3 pointer-events-none"
      :class="positionStyles[pos] || positionStyles['top-right']"
    >
      <ToastItem
        v-for="toast in toastsInGroup"
        :key="toast.id"
        v-bind="toast"
        @close="removeToast(toast.id)"
      />
    </div>
  </template>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from "vue";

/* ================= Event System ================= */

const toastEvents = {
  listeners: [],
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  },
  emit(event) {
    this.listeners.forEach(l => l(event));
  },
};

/* ================= Presets ================= */

const PRESETS = {
  success: {
    bg: "bg-green-200",
    text: "text-green-600",
    icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
    </svg>`,
  },
  error: {
    bg: "bg-red-200",
    text: "text-red-600",
    icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
    </svg>`,
  },
  info: {
    bg: "bg-blue-200",
    text: "text-blue-600",
    icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`,
  },
  warning: {
    bg: "bg-yellow-200",
    text: "text-yellow-600",
    icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>`,
  },
};

/* ================= Toast Item ================= */

const ToastItem = {
  props: {
    message: { default: "Default Toast Message" },
    duration: { default: 3000 },
    position: { default: "top-right" },
    type: { default: "success" },
    show: { default: true },
    mode: { default: "light" },
  },
  emits: ["close"],
  setup(props, { emit }) {
    const isVisible = ref(false);
    const shouldRender = ref(false);

    let expiry = 0;
    let timer = null;

    const preset = computed(() => PRESETS[props.type] || PRESETS.success);

    const showToast = () => {
      shouldRender.value = true;
      setTimeout(() => (isVisible.value = true), 10);
    };

    const closeToast = () => {
      isVisible.value = false;
      setTimeout(() => {
        shouldRender.value = false;
        emit("close");
      }, 300);
    };

    watch(() => props.show, (val) => {
      val ? showToast() : closeToast();
    }, { immediate: true });

    watch(isVisible, (val) => {
      if (val) {
        expiry = Date.now() + Number(props.duration);
        timer = setTimeout(closeToast, props.duration);
      }
    });

    const pause = () => clearTimeout(timer);

    const resume = () => {
      const remain = expiry - Date.now();
      if (remain <= 0) closeToast();
      else timer = setTimeout(closeToast, remain);
    };

    const hiddenClasses = computed(() => {
      let cls = "opacity-0";
      if (props.position.includes("left")) cls += " -translate-x-10";
      else if (props.position.includes("right")) cls += " translate-x-10";
      else if (props.position.includes("top")) cls += " -translate-y-10";
      else if (props.position.includes("bottom")) cls += " translate-y-10";
      else if (props.position === "center") cls += " scale-50";
      return cls;
    });

    const themeClasses = computed(() =>
      props.mode === "dark"
        ? "bg-gray-800 text-white shadow-black/50"
        : "bg-white text-black shadow-gray-500"
    );

    return {
      isVisible,
      shouldRender,
      preset,
      closeToast,
      pause,
      resume,
      hiddenClasses,
      themeClasses,
      transitionClasses: "transition-all duration-300 ease-in-out transform",
      visibleClasses: "opacity-100 scale-100 translate-x-0 translate-y-0",
    };
  },
  template: `
  <div
    v-if="show || shouldRender"
    @mouseenter="pause"
    @mouseleave="resume"
    class="relative flex items-center justify-between max-w-sm w-auto min-w-[300px] px-4 py-2 rounded-xl shadow-lg z-50 pointer-events-auto"
    :class="[themeClasses, transitionClasses, isVisible ? visibleClasses : hiddenClasses]"
  >
    <div class="flex items-center gap-3 overflow-hidden">
      <div
        class="shrink-0 flex items-center justify-center w-6 h-6 rounded-full transition-transform duration-500 delay-100"
        :class="[preset.bg, preset.text, isVisible ? 'scale-100 rotate-0' : 'scale-0 -rotate-90']"
        v-html="preset.icon"
      ></div>
      <span class="break-words text-sm">{{ message }}</span>
    </div>
    <button
      @click="closeToast"
      class="rounded-full p-1 hover:transition hover:text-red-500"
      :class="mode === 'dark' ? 'text-gray-400' : 'text-gray-900'"
    >×</button>
  </div>
  `
};

/* ================= Container ================= */

export default {
  name: "QToast",
  components: { ToastItem },

  setup() {
    const toasts = reactive([]);

    let unsubscribe;

    onMounted(() => {
      unsubscribe = toastEvents.subscribe(event => {
        if (event.type === "ADD") {
          toasts.push({ ...event.payload, id: Date.now() + Math.random() });
        }
      });
    });

    onUnmounted(() => unsubscribe && unsubscribe());

    const removeToast = (id) => {
      const i = toasts.findIndex(t => t.id === id);
      if (i !== -1) toasts.splice(i, 1);
    };

    const groupedToasts = computed(() => {
      return toasts.reduce((acc, t) => {
        const pos = t.position || "top-right";
        if (!acc[pos]) acc[pos] = [];
        acc[pos].push(t);
        return acc;
      }, {});
    });

    const positionStyles = {
      "top-left": "top-4 left-4 flex-col",
      "top-right": "top-4 right-4 flex-col",
      "bottom-left": "bottom-4 left-4 flex-col-reverse",
      "bottom-right": "bottom-4 right-4 flex-col-reverse",
      "top-center": "top-4 left-1/2 -translate-x-1/2 flex-col",
      "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 flex-col-reverse",
      "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col",
      "center-right": "top-1/2 right-4 -translate-y-1/2 flex-col",
      "center-left": "top-1/2 left-4 -translate-y-1/2 flex-col",
    };

    return {
      groupedToasts,
      positionStyles,
      removeToast,
    };
  },
};

/* ================= Static API ================= */

export const QToastAPI = {
  success(message, options = {}) {
    toastEvents.emit({ type: "ADD", payload: { message, type: "success", ...options } });
  },
  error(message, options = {}) {
    toastEvents.emit({ type: "ADD", payload: { message, type: "error", ...options } });
  },
  info(message, options = {}) {
    toastEvents.emit({ type: "ADD", payload: { message, type: "info", ...options } });
  },
  warning(message, options = {}) {
    toastEvents.emit({ type: "ADD", payload: { message, type: "warning", ...options } });
  },
  show(message, options = {}) {
    toastEvents.emit({ type: "ADD", payload: { message, ...options } });
  },
};
</script>