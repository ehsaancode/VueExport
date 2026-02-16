<script>
import { h, defineComponent, ref, onMounted, onUnmounted, cloneVNode, isVNode } from 'vue';
import { get, subscribe } from "../../store/index";

export default defineComponent({
  name: "QRepeat",
  props: {
    repeaterDefaultData: {
      type: Array,
      default: () => [],
    },
    widgetId: {
      type: String,
      default: undefined,
    },
    applyIntoTableCell: {
      type: String,
      default: undefined,
    },
    tailwaindClasses: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    }
  },
  setup(props, { slots }) {
    const dataRepeat = ref([]);
    const targetKey = ref(null);
    let unsubscribe = null;

    const textComponents = [
      "QText",
      "QParagraph",
      "QTextH1",
      "QTextH2",
      "QTextH3",
      "QTextH4",
      "QTextH5",
      "QTextH6",
      "QButton",
    ];

    onMounted(() => {
      unsubscribe = subscribe(() => {
        const newValue = get(props.widgetId);
        dataRepeat.value = newValue;

        const datasetPath = get(props.widgetId + "_dataset_path");
        if (datasetPath) targetKey.value = datasetPath;
      });
    });

    onUnmounted(() => {
      if (unsubscribe) unsubscribe();
    });

    const processElement = (element, row, rowIndex) => {
      if (!isVNode(element)) return element;

      const type = element.type;
      const typeName = type.name || type.__name || type.displayName || ((typeof type === 'string') ? type : 'Unknown');

      let newProps = { ...(element.props || {}) };

      if (textComponents.includes(typeName) && newProps.tagKey) {
        newProps.headerText = row[newProps.tagKey] ?? "";
      }

      if (typeName === "QImage" && newProps.tagKey) {
        newProps.bgUrl = row[newProps.tagKey] ?? "";
      }

      if (typeName === "QActionFlow") {
        newProps.index = rowIndex;
        newProps["data-index"] = rowIndex;
      }

      // Rebuild children
      let newChildren = element.children;

      if (Array.isArray(element.children)) {
        newChildren = element.children.map((child) =>
          processElement(child, row, rowIndex)
        );
      } else if (element.children && typeof element.children === 'object') {
          // Handle slots for components
          const newSlots = {};
          for (const key in element.children) {
              const slotFn = element.children[key];
               newSlots[key] = (...args) => {
                   const vnodes = slotFn(...args);
                   if (Array.isArray(vnodes)) {
                       return vnodes.map(child => processElement(child, row, rowIndex));
                   }
                   return processElement(vnodes, row, rowIndex);
               }
          }
          newChildren = newSlots;
      }

      return cloneVNode(element, {
        key: `${rowIndex}-${typeName}-${Math.random()}`,
        ...newProps
      }, newChildren);
    };

    return () => {
      const selectedData = props.repeaterDefaultData; 

      if (!selectedData || !selectedData.length) return null;

      return selectedData.map((row, rowIndex) => {
          const children = slots.default ? slots.default() : [];
          
          return children.map(child => {
             // Clone first to attach unique key (replicating React logic, though overwritten later by processElement)
             // Using rowIndex as fallback for key if cart_id missing
             const keyedChild = cloneVNode(child, { key: row.cart_id || rowIndex });
             return processElement(keyedChild, row, rowIndex);
          });
      });
    };
  },
});
</script>
