







// storageConfig.js
// ------------------------------------------------------------
// Dynamic Storage Abstraction
// Switch between: "use-local-storage-state", "localforage", "zustand"
// ------------------------------------------------------------

// const ACTIVE_STORAGE = ""; // Change this value to use a different storage system

// export async function getStorage() {
//  // console.log(`Initializing storage: ${ACTIVE_STORAGE}`);

//   // 1. use-local-storage-state (React hook)
//   if (ACTIVE_STORAGE === "use-local-storage-state") {
//     console.log("'use-local-storage-state' should only be used inside React components.");

//     return {
//       localStorageSet: () => {
//         throw new Error("use-local-storage-state cannot be used outside React components");
//       },
//       localStorageGet: () => null,
//       localStorageRemove: () => {},
//       localStorageClear: () => {},
//     };
//   }

//   // 2. localforage
//   if (ACTIVE_STORAGE === "localforage") {
//     const localforage = (await import("localforage")).default;

//     return {
//       localStorageSet: async (key, value) => localforage.setItem(key, value),
//       localStorageGet: async (key) => localforage.getItem(key),
//       localStorageRemove: async (key) => localforage.removeItem(key),
//       localStorageClear: async () => localforage.clear(),
//     };
//   }

//   // 3. Zustand (with persistence)
//   if (ACTIVE_STORAGE === "zustand") {
//     const { create } = await import("zustand");
//     const { persist } = await import("zustand/middleware");

//     const useStore = create(
//       persist(
//         (set) => ({
//           items: {},

//           setItem: (key, value) =>
//             set((state) => ({
//               items: { ...state.items, [key]: value },
//             })),

//           removeItem: (key) =>
//             set((state) => {
//               const newItems = { ...state.items };
//               delete newItems[key];
//               return { items: newItems };
//             }),

//           clearAll: () => set({ items: {} }),
//         }),
//         { name: "app-storage" }
//       )
//     );

//     return {
//       localStorageSet: async (key, value) => useStore.getState().setItem(key, value),
//       localStorageGet: async (key) => useStore.getState().items[key],
//       localStorageRemove: async (key) => useStore.getState().removeItem(key),
//       localStorageClear: async () => useStore.getState().clearAll(),
//     };
//   }

//   // 4. Fallback → Browser localStorage
//   //console.log("Using default browser localStorage fallback");

//   return {
//     localStorageSet: async (key, value) =>
//       localStorage.setItem(key, JSON.stringify(value)),

//     localStorageGet: async (key) => {
//       const val = localStorage.getItem(key);
//       try {
//         return val ? JSON.parse(val) : null;
//       } catch {
//         return val;
//       }
//     },

//     localStorageRemove: async (key) => localStorage.removeItem(key),

//     localStorageClear: async () => localStorage.clear(),
//   };
// }



const ACTIVE_STORAGE = ""; // "localforage" | "zustand" | ""

export function getStorage() {

  // 1. use-local-storage-state (React hook only)
  if (ACTIVE_STORAGE === "use-local-storage-state") {
    console.warn("'use-local-storage-state' must be used inside React components.");

    return {
      localStorageSet: () => {
        throw new Error("use-local-storage-state cannot be used outside React components");
      },
      localStorageGet: () => null,
      localStorageRemove: () => {},
      localStorageClear: () => {},
    };
  }

  // 2. localforage (lazy import)
  if (ACTIVE_STORAGE === "localforage") {
    let lf;

    const getLF = async () => {
      if (!lf) {
        lf = (await import("localforage")).default;
      }
      return lf;
    };

    return {
      localStorageSet: async (key, value) =>
        (await getLF()).setItem(key, value),

      localStorageGet: async (key) =>
        (await getLF()).getItem(key),

      localStorageRemove: async (key) =>
        (await getLF()).removeItem(key),

      localStorageClear: async () =>
        (await getLF()).clear(),
    };
  }

  // 3. Zustand (sync init)
  if (ACTIVE_STORAGE === "zustand") {
    const { create } = require("zustand");
    const { persist } = require("zustand/middleware");

    const useStore = create(
      persist(
        (set, get) => ({
          items: {},

          setItem: (key, value) =>
            set({ items: { ...get().items, [key]: value } }),

          removeItem: (key) => {
            const items = { ...get().items };
            delete items[key];
            set({ items });
          },

          clearAll: () => set({ items: {} }),
        }),
        { name: "app-storage" }
      )
    );

    return {
      localStorageSet: (key, value) =>
        Promise.resolve(useStore.getState().setItem(key, value)),

      localStorageGet: (key) =>
        Promise.resolve(useStore.getState().items[key]),

      localStorageRemove: (key) =>
        Promise.resolve(useStore.getState().removeItem(key)),

      localStorageClear: () =>
        Promise.resolve(useStore.getState().clearAll()),
    };
  }

  // 4. Browser localStorage (fallback)
  return {
    localStorageSet: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
      return Promise.resolve();
    },

    localStorageGet: (key) => {
      const val = localStorage.getItem(key);
      try {
        return Promise.resolve(val ? JSON.parse(val) : null);
      } catch {
        return Promise.resolve(val);
      }
    },

    localStorageRemove: (key) => {
      localStorage.removeItem(key);
      return Promise.resolve();
    },

    localStorageClear: () => {
      localStorage.clear();
      return Promise.resolve();
    },
  };
}