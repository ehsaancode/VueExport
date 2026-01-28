<template>
  <QCustom>
    <div class="default-layout">
      <router-view />
    </div>
  </QCustom>
</template>

<script setup>
import { ref, watch, onUnmounted, provide } from "vue";
import { useRoute } from "vue-router";
import QCustom from "../../qlib/qcustom/QCustom.vue";

const route = useRoute();
const openMenus = ref({});
const hoverTimeouts = ref({});

// Watch for route changes to clear menus
watch(
  () => route.path,
  () => {
    openMenus.value = {};
  }
);

// Cleanup timeouts on unmount
onUnmounted(() => {
  Object.values(hoverTimeouts.value).forEach(clearTimeout);
});

// Menu state management functions (ported from React version)
const handleMouseEnter = (menuId, parentIds = []) => {
  let newMenus = { ...openMenus.value, [menuId]: true };
  
  // Ensure all parent menus remain open
  parentIds.forEach((parent) => {
    newMenus[parent] = true;
  });

  // Logic to close siblings after delay
  const timeout = setTimeout(() => {
    const freshMenus = { ...openMenus.value };
    // Close menus that are not the current one or its parents
    Object.keys(freshMenus).forEach((key) => {
      if (key !== menuId && !parentIds.includes(key)) {
         delete freshMenus[key];
      }
    });
    openMenus.value = freshMenus;
  }, 1500);
  
  openMenus.value = newMenus;
};

const handleMouseLeave = (menuId) => {
  const timeout = setTimeout(() => {
    const updatedMenus = { ...openMenus.value };
    delete updatedMenus[menuId];
    openMenus.value = updatedMenus;
  }, 1500);
  
  hoverTimeouts.value = {
    ...hoverTimeouts.value,
    [menuId]: timeout
  };
};

const handleTopMenuEnter = (menuId) => {
  openMenus.value = {};
  if (hoverTimeouts.value[menuId]) {
    clearTimeout(hoverTimeouts.value[menuId]);
  }
};

// Provide menu state/functions to descendants (e.g. QMenuBar, QMenu)
provide('menuState', {
  openMenus,
  handleMouseEnter,
  handleMouseLeave,
  handleTopMenuEnter
});
</script>

<style scoped>
.default-layout {
  width: 100%;
  height: 100%;
}
</style>


