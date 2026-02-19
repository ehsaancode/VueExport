<template>
  <div ref="containerRef" :class="containerClass" :style="outerStyle">
    <div
      :style="borderedContainerStyle"
      :class="innerClassName"
      :title="seoTitle"
      :aria-label="seoAlt"
    >
      <svg
        ref="svgRef"
        :class="svgClassName"
        v-bind="svgAttrs"
        @mouseleave="handleMouseLeave"
      >
        <defs>
          <template v-if="useGradientForText">
            <template v-if="isForegroundGradient && foreground.startsWith('linear-gradient')">
               <linearGradient
                  v-if="parsedLinearGradient"
                  id="fgGrad"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                  gradientUnits="objectBoundingBox"
                  :gradientTransform="`rotate(${parsedLinearGradient.angle}, 0.5, 0.5)`"
                >
                  <stop
                    v-for="(stop, i) in parsedLinearGradient.colorStops"
                    :key="i"
                    :offset="`${stop.offset}%`"
                    :stop-color="stop.color"
                  />
                </linearGradient>
            </template>
            <template v-else-if="useRadialGradientForeground">
               <radialGradient
                  id="fgGrad"
                  cx="0.5"
                  cy="0.5"
                  r="0.5"
                  gradientUnits="objectBoundingBox"
                >
                  <stop
                    v-for="(color, i) in radialForegroundStops"
                    :key="i"
                    :offset="radialForegroundOffsets[i]"
                    :stop-color="color"
                  />
                </radialGradient>
            </template>
            <template v-else>
               <linearGradient
                  id="fgGrad"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                  gradientUnits="objectBoundingBox"
                  :gradientTransform="`rotate(${gradientAngleForeground}, 0.5, 0.5)`"
                >
                  <stop
                    v-for="(color, i) in linearForegroundStops"
                    :key="i"
                    :offset="linearForegroundOffsets[i]"
                    :stop-color="color"
                  />
                </linearGradient>
            </template>
          </template>
        </defs>

        <g v-for="(slice, i) in displaySlices" :key="i" :transform="getSliceTransform(slice)">
           <path
              :d="getPath(slice.startAngle, slice.endAngle, radius, innerRadius)"
              :fill="slice.color"
              class="cursor-pointer opacity-80 hover:opacity-100"
              style="transition: fill 0.3s ease"
              @mouseenter="handleMouseEnter(slice, $event)"
              @mousemove="handleMouseMove"
              @mouseleave="handleMouseLeave"
           />
           <g v-if="fullSlices[i].angle > 30">
              <rect
                 :x="getTextPos(slice).x - labelBoxXOffset"
                 :y="getTextPos(slice).y - labelBoxYOffset"
                 :width="labelBoxWidth"
                 :height="labelBoxHeight"
                 :rx="borderRadiusX"
                 :ry="borderRadiusY"
                 :fill="labelBgColor"
              />
              <text
                 :x="getTextPos(slice).x"
                 :y="getTextPos(slice).y"
                 text-anchor="middle"
                 dominant-baseline="middle"
                 :style="sliceTextStyle"
              >
                 {{ slice.value }}
              </text>
           </g>
        </g>

        <foreignObject
           v-if="data.title && data.title.trim() !== '' && titleSize.width > 0"
           :x="adjustedCenterX - titleSize.width / 2"
           :y="adjustedCenterY - titleSize.height / 2"
           :width="titleSize.width"
           :height="titleSize.height"
        >
           <div :style="titleStyle">{{ data.title }}</div>
        </foreignObject>
      </svg>

      <!-- External Tooltip -->
      <div
         v-if="effectiveShowTooltip && hoveredPoint"
         class="absolute z-50 pointer-events-none"
         :style="tooltipStyle"
      >
         <div class="flex items-center gap-2 mb-2">
            <div
               class="w-3 h-3 rounded-full flex-shrink-0"
               :style="{ backgroundColor: hoveredPoint.color }"
            />
            <span
               class="font-bold truncate"
               :style="{ color: effectiveTooltipTextColor, fontSize: `${tooltipFontSize}px` }"
            >
               {{ hoveredPoint.label }}
            </span>
         </div>
         <div
            class="text-sm mb-1"
            :style="{ color: effectiveTooltipTextColor, fontSize: `${tooltipFontSize}px`, fontWeight: tooltipFontWeight }"
         >
            Value: {{ hoveredPoint.value }}
         </div>
         <div
            class="text-sm"
            :style="{ color: effectiveTooltipTextColor, fontSize: `${tooltipFontSize}px`, fontWeight: tooltipFontWeight }"
         >
            Percentage: {{ hoveredPoint.percent }}%
         </div>
      </div>

      <!-- Visible Legend -->
      <div v-if="effectiveShowLegend" :style="legendStyle" :class="legendClassName">
         <div v-for="(d, i) in data.data" :key="i" class="flex items-center gap-3">
            <div
               class="w-5 h-5 rounded-full flex-shrink-0"
               :style="{ backgroundColor: getColor(d.value) }"
            />
            <span :style="legendTextStyle">
               {{ d.label }}: {{ d.value }}
            </span>
         </div>
      </div>
    </div>
  </div>
  
  <!-- Hidden Elements for Size Calculation -->
  <div
     v-if="data.title && data.title.trim() !== ''"
     ref="titleRef"
     :style="{ position: 'absolute', left: '-9999px', visibility: 'hidden', ...titleStyle }"
  >
     {{ data.title }}
  </div>
  
  <div
     v-if="effectiveShowLegend"
     ref="legendRef"
     :style="{ position: 'absolute', left: '-9999px', visibility: 'hidden' }"
     :class="legendClassName"
  >
     <div v-for="(d, i) in data.data" :key="i" class="flex items-center gap-3">
        <div class="w-5 h-5 rounded-full flex-shrink-0" />
        <span :style="legendTextStyle">
           {{ d.label }}: {{ d.value }}
        </span>
     </div>
  </div>

</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      title: "Departments",
      data: [
        { label: "Sales", value: 35 },
        { label: "Marketing", value: 20 },
        { label: "Support", value: 25 },
      ],
    }),
  },
  pieChartType: String,
  width: { type: String, default: "550px" },
  height: { type: String, default: "400px" },
  minWidth: { type: String, default: "0px" },
  maxWidth: { type: String, default: "none" },
  minHeight: { type: String, default: "100px" },
  maxHeight: { type: String, default: "none" },
  legendPosition: { type: String, default: "Right" },
  showLegend: { type: [Boolean, String], default: "true" },
  childAlign: String,
  legendTextColor: String,
  baseFontSize: { type: Number, default: 10 },
  fontWeight: { type: Number, default: 600 },
  labelBgColor: { type: String, default: "#9caddf" },
  labelTextColor: { type: String, default: "#ffffff" },
  foreground: { type: String, default: "" },
  useLinearGradientForeground: Boolean,
  gradientColorsForeground: { type: Array, default: () => ["red", "white", "green"] },
  gradientAngleForeground: { type: Number, default: 30 },
  gradientStopsForeground: { type: Array, default: () => [0, 50, 100] },
  useRadialGradientForeground: Boolean,
  radialGradientColorsForeground: { type: Array, default: () => ["red", "pink", "green"] },
  radialGradientStopsForeground: { type: Array, default: () => [0, 50, 100] },
  labelBoxWidth: { type: Number, default: 30 },
  labelBoxHeight: { type: Number, default: 20 },
  labelBoxXOffset: { type: Number, default: 15 },
  labelBoxYOffset: { type: Number, default: 11 },
  borderRadiusX: { type: Number, default: 4 },
  borderRadiusY: { type: Number, default: 4 },
  showTooltip: { type: [Boolean, String], default: "true" },
  tooltipFontSize: { type: [Number, String], default: 10 },
  tooltipFontWeight: { type: [Number, String], default: 400 },
  pieTooltipborderRadiusType: [Number, String],
  pieTooltipborderRadiusValueTopLeft: { type: [Number, String], default: 10 },
  pieTooltipborderRadiusValueTopRight: { type: [Number, String], default: 10 },
  pieTooltipborderRadiusValueBottomRight: { type: [Number, String], default: 10 },
  pieTooltipborderRadiusValueBottomLeft: { type: [Number, String], default: 10 },
  tooltipTextColor: String,
  tooltipBgColor: String,
  tooltipWidth: { type: Number, default: 150 },
  tooltipHeight: { type: Number, default: 60 },
  showTooltipShadow: [Boolean, String],
  borderTop: { type: Number, default: 0 },
  borderRight: { type: Number, default: 0 },
  borderBottom: { type: Number, default: 0 },
  borderLeft: { type: Number, default: 0 },
  borderColor: String,
  borderStyle: String,
  borderTopColor: String,
  borderRightColor: { type: String, default: "" },
  borderBottomColor: { type: String, default: "" },
  borderLeftColor: { type: String, default: "" },
  borderRadiusAll: { type: Number, default: 0 },
  borderRadiusTopLeft: Number,
  borderRadiusTopRight: Number,
  borderRadiusBottomRight: Number,
  borderRadiusBottomLeft: Number,
  boxShadowColor: String,
  boxShadowOffsetX: Number,
  boxShadowOffsetY: Number,
  boxShadowBlurRadius: Number,
  boxShadowSpreadRadius: Number,
  boxShadow: { type: String, default: "" },
  textShadow: { type: String, default: "" },
  bgColor: String,
  useLinearGradient: { type: Boolean, default: true },
  gradientColors: Array,
  gradientAngle: { type: Number, default: 30 },
  gradientStops: { type: Array, default: () => [20, 50, 90] },
  useRadialGradient: Boolean,
  radialGradientColors: Array,
  radialGradientStops: { type: Array, default: () => [10, 50, 90] },
  paddingAll: { type: Number, default: 0 },
  paddingTop: { type: Number, default: 0 },
  paddingRight: { type: Number, default: 0 },
  paddingBottom: { type: Number, default: 0 },
  paddingLeft: { type: Number, default: 0 },
  marginAll: { type: Number, default: 0 },
  marginTop: { type: Number, default: 0 },
  marginRight: { type: Number, default: 0 },
  marginBottom: { type: Number, default: 0 },
  marginLeft: { type: Number, default: 0 },
  bgUrl: String,
  backgroundImageFit: { type: String, default: "cover" },
  seoAlt: String,
  seoTitle: String,
  backgroundImageRepeat: { type: String, default: "repeat Y" },
  tailwaindClasses: { type: String, default: "" },
});

// Helper Functions
const parseSize = (size) => {
  if (typeof size === "number") return size;
  const match = size?.toString().match(/^([0-9.]+)(px|%|vw)?$/);
  if (!match) return 0;
  const num = parseFloat(match[1]);
  if (isNaN(num)) return 0;
  return num;
};

const parseLinearGradient = (gradientStr) => {
  if (!gradientStr || !gradientStr.startsWith("linear-gradient")) return null;
  const match = gradientStr.match(/^linear-gradient\s*\(\s*([^,]+)\s*,\s*(.+)\s*\)$/);
  if (!match) return null;
  let angle = 0;
  const angleStr = match[1].trim();
  const angleMatch = angleStr.match(/^([0-9.-]+)deg$/);
  if (angleMatch) angle = parseFloat(angleMatch[1]);
  
  let stopsStr = match[2].replace(/\)$/, "").trim();
  const stopRegex = /((?:rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|[a-z]+)\s*(?:([0-9.-]+)%?)?)/g;
  const stopMatches = [];
  let m;
  while ((m = stopRegex.exec(stopsStr)) !== null) stopMatches.push(m[0]);
  
  if (stopMatches.length === 0) return null;
  const colorStops = [];
  stopMatches.forEach((part) => {
    const percentMatch = part.match(/\s+([0-9.-]+)%?$/);
    let offset = percentMatch ? parseFloat(percentMatch[1]) : null;
    let color = part;
    let index = -1;
    if (percentMatch) {
      index = percentMatch.index;
      color = part.slice(0, index).trim();
    }
    if (offset === null || isNaN(offset)) {
      offset = (colorStops.length / (stopMatches.length - 1)) * 100;
    }
    colorStops.push({ color: color.trim(), offset });
  });
  return { angle, colorStops };
};

// State
const containerRef = ref(null);
const titleRef = ref(null);
const legendRef = ref(null);
const svgRef = ref(null);
const hoveredPoint = ref(null);
const progress = ref(0);
const isVisible = ref(false);
const titleSize = ref({ width: 0, height: 0 });
const legendSize = ref({ width: 0, height: 0 });
const tooltipPosition = ref({ x: 0, y: 0 });
let timeoutId = null;

// Props Coercion
const useTailwind = computed(() => !!props.tailwaindClasses);
const effectiveShowLegend = computed(() => props.showLegend === "true" || props.showLegend === true);
const effectiveShowTooltip = computed(() => props.showTooltip === "true" || props.showTooltip === true);
const effectiveShowTooltipShadow = computed(() => props.showTooltipShadow === "true" || props.showTooltipShadow === true);

// Styles & Colors
const effectiveLabelTextColor = computed(() => props.foreground || props.labelTextColor);
const effectiveLegendTextColor = computed(() => props.foreground || props.legendTextColor);

const isForegroundGradient = computed(() => 
    typeof props.foreground === "string" && 
    (props.foreground.startsWith("linear-gradient(") || props.foreground.startsWith("radial-gradient("))
);

const useGradientForText = computed(() => 
    props.useLinearGradientForeground || props.useRadialGradientForeground || isForegroundGradient.value
);

const parsedLinearGradient = computed(() => isForegroundGradient.value ? parseLinearGradient(props.foreground) : null);

const radialForegroundStops = computed(() => props.radialGradientColorsForeground);
const radialForegroundOffsets = computed(() => {
    const stops = props.radialGradientStopsForeground.length === props.radialGradientColorsForeground.length
        ? props.radialGradientStopsForeground
        : Array.from({ length: props.radialGradientColorsForeground.length }, (_, i) => Math.round((i / (props.radialGradientColorsForeground.length - 1)) * 100));
    return stops.map(s => `${s}%`);
});

const linearForegroundStops = computed(() => props.gradientColorsForeground);
const linearForegroundOffsets = computed(() => {
    const stops = props.gradientStopsForeground.length === props.gradientColorsForeground.length
          ? props.gradientStopsForeground
          : Array.from({ length: props.gradientColorsForeground.length }, (_, i) => Math.round((i / (props.gradientColorsForeground.length - 1)) * 100));
    return stops.map(s => `${s}%`);
});


const getForegroundGradientCSS = () => {
    if (isForegroundGradient.value) return props.foreground;
    if (props.useRadialGradientForeground && props.radialGradientColorsForeground?.length > 0) {
        const stops = radialForegroundOffsets.value;
        const colorStops = props.radialGradientColorsForeground.map((color, i) => `${color} ${stops[i]}`).join(", ");
        return `radial-gradient(circle at center, ${colorStops})`;
    } else if (props.useLinearGradientForeground && props.gradientColorsForeground?.length > 0) {
        const stops = linearForegroundOffsets.value;
        const colorStops = props.gradientColorsForeground.map((color, i) => `${color} ${stops[i]}`).join(", ");
        return `linear-gradient(${props.gradientAngleForeground}deg, ${colorStops})`;
    }
    return null;
};

const foregroundGradientCSS = computed(() => useGradientForText.value ? getForegroundGradientCSS() : null);

const titleStyle = computed(() => ({
    display: "inline-block",
    backgroundColor: props.labelBgColor,
    color: useGradientForText.value ? "transparent" : effectiveLabelTextColor.value,
    ...(useGradientForText.value && {
      backgroundImage: foregroundGradientCSS.value,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
    }),
    padding: "0.25rem 0.75rem",
    borderRadius: `${props.borderRadiusX}px`,
    fontSize: `${props.baseFontSize * 1.5}px`,
    fontWeight: 700,
    lineHeight: 1.2,
    whiteSpace: "normal",
    wordWrap: "break-word",
}));

// Effects for sizing
watch(() => [props.data.title, props.baseFontSize, props.labelBgColor, effectiveLabelTextColor.value, props.borderRadiusX], async () => {
    await nextTick();
    if (titleRef.value) {
      const rect = titleRef.value.getBoundingClientRect();
      titleSize.value = { width: rect.width, height: rect.height };
    }
}, { immediate: true });

watch(() => [effectiveShowLegend.value, props.baseFontSize, props.fontWeight, props.data.data, props.legendPosition], async () => {
    await nextTick();
    if (effectiveShowLegend.value && legendRef.value) {
        const rect = legendRef.value.getBoundingClientRect();
        legendSize.value = { width: rect.width, height: rect.height };
    } else {
        legendSize.value = { width: 0, height: 0 };
    }
}, { immediate: true });

// Data Processing
const values = computed(() => props.data?.data?.map((d) => d.value) || []);
const minValue = computed(() => Math.min(...values.value));
const maxValue = computed(() => Math.max(...values.value));
const total = computed(() => props.data?.data?.reduce((sum, d) => sum + d.value, 0) || 0);

const getColor = (value) => {
    if (maxValue.value === minValue.value) return "hsl(210, 100%, 75%)";
    const intensity = (value - minValue.value) / (maxValue.value - minValue.value);
    const lightness = 85 - intensity * 25;
    return `hsl(210, 100%, ${lightness}%)`;
};

// Layout calculations
const getBackgroundRepeat = (rep) => {
    const normalized = rep.toLowerCase().replace(/\s+/g, "");
    const map = {
      none: "no-repeat",
      repeatx: "repeat-x",
      repeaty: "repeat-y",
      repeat: "repeat",
    };
    return map[normalized] || "no-repeat";
};

const getBackgroundSize = (fit) => {
    const map = {
      none: "auto",
      cover: "cover",
      contain: "contain",
      fill: "100% 100%",
      "fit-height": "auto 100%",
      "fit-width": "100% auto",
    };
    return map[fit] || "auto";
};

const effectiveBgColor = computed(() => props.bgColor || "#ffffff");
const isGradient = computed(() => effectiveBgColor.value.startsWith("linear-gradient(") || effectiveBgColor.value.startsWith("radial-gradient("));

const bgStyle = computed(() => {
    if (isGradient.value) {
        let bgImage = effectiveBgColor.value;
        if (props.bgUrl) bgImage = `url(${props.bgUrl}), ${effectiveBgColor.value}`;
        return {
            backgroundImage: bgImage,
            backgroundColor: "transparent",
            ...(props.bgUrl && {
                backgroundRepeat: getBackgroundRepeat(props.backgroundImageRepeat),
                backgroundSize: getBackgroundSize(props.backgroundImageFit),
                backgroundPosition: "center center",
            })
        }
    } else {
        let style = { backgroundColor: effectiveBgColor.value };
        let fallbackBgImage = null;
        if (props.useRadialGradient && props.radialGradientColors?.length > 0) {
            // ... construct fallback radial
             const stops = props.radialGradientStops.length === props.radialGradientColors.length ? props.radialGradientStops : Array.from({ length: props.radialGradientColors.length }, (_, i) => Math.round((i / (props.radialGradientColors.length - 1)) * 100));
             const colorStops = props.radialGradientColors.map((color, i) => `${color} ${stops[i]}%`).join(", ");
             fallbackBgImage = `radial-gradient(circle at center, ${colorStops})`;
        } else if (props.useLinearGradient && props.gradientColors?.length > 0) {
             const stops = props.gradientStops.length === props.gradientColors.length ? props.gradientStops : Array.from({ length: props.gradientColors.length }, (_, i) => Math.round((i / (props.gradientColors.length - 1)) * 100));
             const colorStops = props.gradientColors.map((color, i) => `${color} ${stops[i]}%`).join(", ");
             fallbackBgImage = `linear-gradient(${props.gradientAngle}deg, ${colorStops})`;
        }

        if (props.bgUrl) {
            style.backgroundImage = `url(${props.bgUrl})`;
            if (fallbackBgImage) style.backgroundImage += `, ${fallbackBgImage}`;
            style.backgroundRepeat = getBackgroundRepeat(props.backgroundImageRepeat);
            style.backgroundSize = getBackgroundSize(props.backgroundImageFit);
            style.backgroundPosition = "center center";
        } else if (fallbackBgImage) {
            style.backgroundImage = fallbackBgImage;
            style.backgroundColor = "transparent";
        }
        return style;
    }
});


const calculatedLayout = computed(() => {
    const eBorderTop = useTailwind.value ? 0 : props.borderTop || 0;
    const eBorderRight = useTailwind.value ? 0 : props.borderRight || 0;
    const eBorderBottom = useTailwind.value ? 0 : props.borderBottom || 0;
    const eBorderLeft = useTailwind.value ? 0 : props.borderLeft || 0;

    const ePadding = {
        top: useTailwind.value ? 0 : props.paddingTop || props.paddingAll || 0,
        right: useTailwind.value ? 0 : props.paddingRight || props.paddingAll || 0,
        bottom: useTailwind.value ? 0 : props.paddingBottom || props.paddingAll || 0,
        left: useTailwind.value ? 0 : props.paddingLeft || props.paddingAll || 0,
    };

    return { eBorderTop, eBorderRight, eBorderBottom, eBorderLeft, ePadding };
});

const getSizedValue = (value) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === "number") return `${value}px`;
    return value.toString();
};

const borderedContainerStyle = computed(() => {
    if (useTailwind.value) {
         return {
            ...bgStyle.value,
            position: 'relative',
            boxShadow: props.boxShadow || (props.boxShadowColor ? `${props.boxShadowOffsetX || 0}px ${props.boxShadowOffsetY || 0}px ${props.boxShadowBlurRadius || 0}px ${props.boxShadowSpreadRadius || 0}px ${props.boxShadowColor}` : undefined),
            textShadow: props.textShadow || undefined,
            overflow: "hidden",
         }
    }
    const { eBorderTop, eBorderRight, eBorderBottom, eBorderLeft, ePadding } = calculatedLayout.value;
    
    return {
        width: typeof props.width === "string" ? props.width : `${parseSize(props.width)}px`,
        height: typeof props.height === "string" ? props.height : `${parseSize(props.height)}px`,
        minWidth: getSizedValue(props.minWidth),
        maxWidth: getSizedValue(props.maxWidth),
        minHeight: getSizedValue(props.minHeight),
        maxHeight: getSizedValue(props.maxHeight),
        boxSizing: "border-box",
        borderTopWidth: `${eBorderTop}px`,
        borderRightWidth: `${eBorderRight}px`,
        borderBottomWidth: `${eBorderBottom}px`,
        borderLeftWidth: `${eBorderLeft}px`,
        borderTopColor: props.borderTopColor || props.borderColor,
        borderRightColor: props.borderRightColor || props.borderColor,
        borderBottomColor: props.borderBottomColor || props.borderColor,
        borderLeftColor: props.borderLeftColor || props.borderColor,
        borderStyle: props.borderStyle,
        borderTopLeftRadius: `${props.borderRadiusTopLeft || props.borderRadiusAll || 0}px`,
        borderTopRightRadius: `${props.borderRadiusTopRight || props.borderRadiusAll || 0}px`,
        borderBottomRightRadius: `${props.borderRadiusBottomRight || props.borderRadiusAll || 0}px`,
        borderBottomLeftRadius: `${props.borderRadiusBottomLeft || props.borderRadiusAll || 0}px`,
        paddingTop: `${ePadding.top}px`,
        paddingRight: `${ePadding.right}px`,
        paddingBottom: `${ePadding.bottom}px`,
        paddingLeft: `${ePadding.left}px`,
        position: "relative",
        boxShadow: props.boxShadow || (props.boxShadowColor ? `${props.boxShadowOffsetX || 0}px ${props.boxShadowOffsetY || 0}px ${props.boxShadowBlurRadius || 0}px ${props.boxShadowSpreadRadius || 0}px ${props.boxShadowColor}` : undefined),
        textShadow: props.textShadow || undefined,
        ...bgStyle.value,
        overflow: "hidden",
    };
});


// Container Classes & Styles (Outer)
const outerItemsClass = computed(() => props.childAlign === "baseline" ? "items-baseline" : "items-center");
const outerJustifyClass = computed(() => {
    switch (props.childAlign) {
      case "left": return "justify-start";
      case "center": return "justify-center";
      case "right": return "justify-end";
      case "stretch": return "justify-between";
      case "baseline": return "justify-start";
      case "auto": default: return "justify-center";
    }
});
const containerClass = computed(() => `flex ${outerItemsClass.value} ${outerJustifyClass.value}`);

const outerStyle = computed(() => {
    if (useTailwind.value) return {};
    return {
        marginTop: `${props.marginTop || props.marginAll || 0}px`,
        marginRight: `${props.marginRight || props.marginAll || 0}px`,
        marginBottom: `${props.marginBottom || props.marginAll || 0}px`,
        marginLeft: `${props.marginLeft || props.marginAll || 0}px`,
    };
});

// Chart Dimensions Calculation
const dimensions = computed(() => {
    const totalWidth = parseSize(props.width);
    const totalHeight = parseSize(props.height);
    const { eBorderLeft, eBorderRight, eBorderTop, eBorderBottom, ePadding } = calculatedLayout.value;
    
    let svgW = Math.max(0, totalWidth - (eBorderLeft + eBorderRight) - (ePadding.left + ePadding.right));
    let svgH = Math.max(0, totalHeight - (eBorderTop + eBorderBottom) - (ePadding.top + ePadding.bottom));
    
    return { svgW, svgH };
});

const chartGeometry = computed(() => {
    const { svgW, svgH } = dimensions.value;
    const isVerticalLayout = effectiveShowLegend.value && (props.legendPosition === "Top" || props.legendPosition === "Bottom");
    let chartW = svgW;
    let chartH = svgH;
    
    const svgPadding = 50;
    const innerW = Math.max(0, chartW - 2 * svgPadding);
    const innerH = Math.max(0, chartH - 2 * svgPadding);
    
    let adjCenterX = innerW / 2 + svgPadding;
    let adjCenterY = innerH / 2 + svgPadding;

    if (effectiveShowLegend.value) {
        const lh = legendSize.value.height || (props.data.data.length * 24);
        const lw = legendSize.value.width || 200;
        const shiftGap = 16;
        
        if (isVerticalLayout) {
            const dim = lh;
            if (props.legendPosition === "Top") adjCenterY += dim / 2 + shiftGap;
            else if (props.legendPosition === "Bottom") adjCenterY -= dim / 2 + shiftGap;
        } else {
             const dim = lw;
             if (props.legendPosition === "Left") adjCenterX += dim / 2 + shiftGap;
             else if (props.legendPosition === "Right") adjCenterX -= dim / 2 + shiftGap;
        }
    }
    
    return { chartW, chartH, innerW, innerH, adjCenterX, adjCenterY };
});

const adjustedCenterX = computed(() => chartGeometry.value.adjCenterX);
const adjustedCenterY = computed(() => chartGeometry.value.adjCenterY);
const radiusGeometry = computed(() => {
    const { innerW, innerH } = chartGeometry.value;
    const r = (Math.min(innerW, innerH) / 2) * 0.75;
    const ir = props.pieChartType === "Ring" ? r * 0.5 : 0;
    const tr = Math.max(ir, r * 0.55);
    return { radius: r, innerRadius: ir, textRadius: tr };
});
const radius = computed(() => radiusGeometry.value.radius);
const innerRadius = computed(() => radiusGeometry.value.innerRadius);
const textRadius = computed(() => radiusGeometry.value.textRadius);

// Slicing Logic
const fullSlices = computed(() => {
    let fullCumulative = 0;
    const tot = total.value;
    if (tot === 0) return [];
    
    return props.data.data.map((d) => {
        const fullAngle = (d.value / tot) * 360;
        const startAngle = fullCumulative;
        const endAngle = fullCumulative + fullAngle;
        const midAngle = (startAngle + endAngle) / 2;
        fullCumulative += fullAngle;
        const percent = ((d.value / tot) * 100).toFixed(1);
        const color = getColor(d.value);
        return { ...d, startAngle, endAngle, midAngle, angle: fullAngle, percent, color };
    });
});

const displaySlices = computed(() => {
    return fullSlices.value.map((slice) => ({
        ...slice,
        startAngle: slice.startAngle * progress.value,
        endAngle: slice.endAngle * progress.value,
        midAngle: slice.midAngle * progress.value,
        angle: slice.angle * progress.value,
    }));
});

const getPath = (start, end, outerR, innerR) => {
    const cx = adjustedCenterX.value;
    const cy = adjustedCenterY.value;
    
    const sa = (start - 90) * (Math.PI / 180);
    const ea = (end - 90) * (Math.PI / 180);
    
    const x1o = cx + outerR * Math.cos(sa);
    const y1o = cy + outerR * Math.sin(sa);
    const x2o = cx + outerR * Math.cos(ea);
    const y2o = cy + outerR * Math.sin(ea);
    
    const large = end - start > 180 ? 1 : 0;
    
    if (innerR === 0) {
        return `M ${cx} ${cy} L ${x1o} ${y1o} A ${outerR} ${outerR} 0 ${large} 1 ${x2o} ${y2o} Z`;
    } else {
        const x1i = cx + innerR * Math.cos(sa);
        const y1i = cy + innerR * Math.sin(sa);
        const x2i = cx + innerR * Math.cos(ea);
        const y2i = cy + innerR * Math.sin(ea);
        return `M ${x1o} ${y1o} A ${outerR} ${outerR} 0 ${large} 1 ${x2o} ${y2o} L ${x2i} ${y2i} A ${innerR} ${innerR} 0 ${large} 0 ${x1i} ${y1i} Z`;
    }
};

const getSliceTransform = (slice) => {
    if (hoveredPoint.value?.label !== slice.label) return '';
    const popDistance = 18;
    const midRad = (slice.midAngle - 90) * (Math.PI / 180);
    const dx = Math.cos(midRad) * popDistance;
    const dy = Math.sin(midRad) * popDistance;
    return `translate(${dx}, ${dy})`;
};

const getTextPos = (slice) => {
    const midRad = (slice.midAngle - 90) * (Math.PI / 180);
    return {
        x: adjustedCenterX.value + Math.cos(midRad) * textRadius.value,
        y: adjustedCenterY.value + Math.sin(midRad) * textRadius.value
    };
};

// Tooltip & Mouse Handling
const handleMouseEnter = (slice, event) => {
    if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
    const fullSlice = fullSlices.value.find(s => s.label === slice.label);
    hoveredPoint.value = fullSlice;
    
    if (containerRef.value && event) {
        const containerRect = containerRef.value.getBoundingClientRect();
        tooltipPosition.value = {
            x: event.clientX - containerRect.left + 10,
            y: event.clientY - containerRect.top - 10
        };
    }
};

const handleMouseMove = (event) => {
    if (hoveredPoint.value && containerRef.value) {
        const containerRect = containerRef.value.getBoundingClientRect();
         tooltipPosition.value = {
            x: event.clientX - containerRect.left + 10,
            y: event.clientY - containerRect.top - 10
        };
    }
};

const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
        hoveredPoint.value = null;
        timeoutId = null;
    }, 150);
};

// SVG Config
const svgAttrs = computed(() => ({
    width: "100%",
    height: "100%",
    viewBox: `0 0 ${chartGeometry.value.chartW} ${chartGeometry.value.chartH}`
}));

const svgClassName = "";
const innerClassName = computed(() => props.tailwaindClasses);

const sliceTextStyle = computed(() => ({
    fill: useGradientForText.value ? "url(#fgGrad)" : effectiveLabelTextColor.value,
    fontSize: `${props.baseFontSize}px`,
    fontWeight: props.fontWeight,
}));

// Legend
const legendClassName = computed(() => {
   const isVertical = effectiveShowLegend.value && (props.legendPosition === "Top" || props.legendPosition === "Bottom");
   return isVertical ? "flex gap-4 justify-center" : "space-y-4";
});

const legendStyle = computed(() => {
    let style = { position: "absolute", zIndex: 10, pointerEvents: "none" };
    const gapPx = "16px";
    if (["Top", "Bottom"].includes(props.legendPosition)) {
        style[props.legendPosition.toLowerCase()] = gapPx;
        style.left = "50%";
        style.transform = "translateX(-50%)";
    } else {
        style[props.legendPosition.toLowerCase()] = gapPx;
        style.top = "50%";
        style.transform = "translateY(-50%)";
    }
    return style;
});

const legendTextStyle = computed(() => ({
    fontSize: `${props.baseFontSize}px`,
    fontWeight: props.fontWeight,
    color: useGradientForText.value ? "transparent" : effectiveLegendTextColor.value,
    ...(useGradientForText.value && {
        backgroundImage: foregroundGradientCSS.value,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
    })
}));

// Tooltip Style
const effectiveTooltipTextColor = computed(() => props.tooltipTextColor || "white");
const effectiveTooltipBgColor = computed(() => props.tooltipBgColor || "#1874da");

const tooltipStyle = computed(() => ({
    left: `${tooltipPosition.value.x}px`,
    top: `${tooltipPosition.value.y}px`,
    transform: "translateY(-100%)",
    minWidth: `${props.tooltipWidth}px`,
    backgroundColor: effectiveTooltipBgColor.value,
    borderRadius: `${props.pieTooltipborderRadiusValueTopLeft || props.pieTooltipborderRadiusType || 0}px ${props.pieTooltipborderRadiusValueTopRight || props.pieTooltipborderRadiusType || 0}px ${props.pieTooltipborderRadiusValueBottomRight || props.pieTooltipborderRadiusType || 0}px ${props.pieTooltipborderRadiusValueBottomLeft || props.pieTooltipborderRadiusType || 0}px`,
    padding: "12px",
    boxShadow: effectiveShowTooltipShadow.value ? "0 4px 14px rgba(0, 0, 0, 0.3)" : "none",
    border: "1px solid rgba(255, 255, 255, 0.1)",
}));


// Animation Logic
onMounted(() => {
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            observer.disconnect();
            isVisible.value = true;
        }
    }, { threshold: 0.1 });
    
    if (containerRef.value) observer.observe(containerRef.value);
});

watch(isVisible, (visible) => {
    if (visible) {
        progress.value = 0;
        const duration = 1500;
        let startTime = null;
        const animate = (timestamp) => {
            if (startTime === null) startTime = timestamp;
            const elapsed = timestamp - startTime;
            let p = Math.min(elapsed / duration, 1);
            p = 1 - Math.pow(1 - p, 3); // easeOutCubic
            progress.value = p;
            if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }
});

onUnmounted(() => {
    if (timeoutId) clearTimeout(timeoutId);
});

</script>
