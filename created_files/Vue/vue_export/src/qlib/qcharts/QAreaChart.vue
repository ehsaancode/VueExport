<template>
  <div ref="containerRef" :class="outerClassName">
    <div :style="marginStyle">
      <div
        :class="tailwaindClasses"
        :style="borderedContainerStyle"
        :title="seoTitle"
        :aria-label="seoAlt"
      >
        <svg
          ref="svgRef"
          v-bind="svgAttrs"
          :style="{
            flex: effectiveShowLegend ? 1 : undefined,
            width: '100%',
            height: '100%',
          }"
          class=""
          @mouseleave="handleMouseLeave"
        >
          <defs>
            <template v-if="useGradientForText">
              <radialGradient
                v-if="useRadialGradientForeground"
                id="fgGrad"
                cx="0.5"
                cy="0.5"
                r="0.5"
                gradientUnits="objectBoundingBox"
              >
                <stop
                  v-for="(color, i) in radialGradientColorsForeground"
                  :key="i"
                  :offset="`${radialGradientStopsForeground[i] || Math.round((i / (radialGradientColorsForeground.length - 1)) * 100)}%`"
                  :stop-color="color"
                />
              </radialGradient>
              <linearGradient
                v-else
                id="fgGrad"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
                gradientUnits="objectBoundingBox"
                :gradientTransform="`rotate(${gradientAngleForeground}, 0.5, 0.5)`"
              >
                <stop
                  v-for="(color, i) in gradientColorsForeground"
                  :key="i"
                  :offset="`${gradientStopsForeground[i] || Math.round((i / (gradientColorsForeground.length - 1)) * 100)}%`"
                  :stop-color="color"
                />
              </linearGradient>
            </template>
            <clipPath id="areaClip">
              <rect
                ref="clipRectRef"
                :x="leftPadding"
                :y="padding"
                width="0"
                :height="Math.max(0, svgHeight - 2 * padding)"
              />
            </clipPath>
          </defs>

          <!-- Grid lines -->
          <template v-if="effectiveXAxisGridLines">
            <line
              v-for="x in xTicks"
              :key="`gx-${x}`"
              :x1="scaleX(x)"
              :y1="padding"
              :x2="scaleX(x)"
              :y2="svgHeight - padding"
              :stroke="gridLineXColor"
              :stroke-width="xAxisLineWidth"
            />
          </template>
          <template v-if="effectiveYAxisGridLines">
            <line
              v-for="y in yTicks"
              :key="`gy-${y}`"
              :x1="leftPadding"
              :y1="scaleY(y)"
              :x2="svgWidth - padding"
              :y2="scaleY(y)"
              :stroke="gridLineYColor"
              :stroke-width="yAxisLineWidth"
            />
          </template>

          <!-- Axes -->
          <line
            :x1="leftPadding"
            :y1="svgHeight - padding"
            :x2="svgWidth - padding"
            :y2="svgHeight - padding"
            class="stroke-black"
          />
          <line
            :x1="leftPadding"
            :y1="padding"
            :x2="leftPadding"
            :y2="svgHeight - padding"
            class="stroke-black"
          />

          <!-- Smooth fill with clip animation -->
          <path
            :d="areaD"
            :fill="fillColor"
            stroke="none"
            class="opacity-60"
            clip-path="url(#areaClip)"
          />

          <!-- Smooth line with draw animation -->
          <path
            ref="linePathRef"
            :d="curveD"
            fill="none"
            :stroke="color"
            stroke-width="4"
            class="opacity-60"
            clip-path="url(#areaClip)"
          />

          <g v-for="(p, i) in data.data" :key="i">
            <circle
              v-if="effectiveShowMarker || effectiveShowTooltip"
              :cx="scaleX(p.x)"
              :cy="scaleY(p.y)"
              :r="effectiveShowMarker ? markerSize : 8"
              :fill="effectiveShowMarker ? color : 'transparent'"
              :class="effectiveShowMarker ? 'stroke-white cursor-pointer' : 'cursor-pointer'"
              :stroke="effectiveShowMarker ? 'white' : 'none'"
              :stroke-width="effectiveShowMarker ? 1.5 : 0"
              @mouseenter="handleMouseEnter(p, $event)"
              @mousemove="handleMouseMove"
              @mouseleave="handleMouseLeave"
            />
          </g>

          <!-- Axis labels -->
          <template v-if="effectiveXAxisLabel">
            <text
              v-for="x in xTicks"
              :key="`tx-${x}`"
              :x="scaleX(x)"
              :y="svgHeight - padding + 20"
              class="text-xs text-center"
              text-anchor="middle"
              :fill="useGradientForText ? 'url(#fgGrad)' : effectiveForegroundColor"
              :style="{ textShadow }"
            >
              {{ x }}
            </text>
          </template>
          <template v-if="effectiveYAxisLabel">
            <text
              v-for="y in yTicks"
              :key="`ty-${y}`"
              :x="leftPadding - 10"
              :y="scaleY(y) + 4"
              class="text-xs text-right"
              text-anchor="end"
              :fill="useGradientForText ? 'url(#fgGrad)' : effectiveForegroundColor"
              :style="{ textShadow }"
            >
              {{ y.toFixed(1) }}
            </text>
          </template>
        </svg>

        <!-- External tooltip div -->
        <div
          v-if="effectiveShowTooltip && tooltip.visible"
          class="absolute z-50 pointer-events-none whitespace-nowrap rounded-lg p-2 shadow-lg"
          :style="{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: 'white',
            fontSize: '12px',
            borderRadius: '8px',
            transform: 'translateY(-100%)',
          }"
        >
          <div class="font-bold mb-1">{{ data.title }}</div>
          <div>
             x: {{ hoveredPoint?.x }}, y: {{ hoveredPoint?.y }}
          </div>
        </div>

        <div v-if="effectiveShowLegend" class="flex items-center justify-center mt-4 gap-2">
           <div
             class="w-3 h-3 rounded-xs opacity-60"
             :style="{ backgroundColor: color }"
           />
           <span class="text-xs" :style="titleTextStyle">
             {{ data.title }}
           </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      title: "Product B",
      data: [
        { x: 0, y: 25 }, { x: 2, y: 50 }, { x: 3, y: 30 }, { x: 4, y: 20 },
        { x: 5, y: 40 }, { x: 6, y: 95 }, { x: 7, y: 30 }, { x: 8, y: 60 },
        { x: 9, y: 10 }, { x: 10, y: 50 },
      ],
    }),
  },
  xMin: { type: Number, default: 0 },
  xMax: { type: Number, default: 10 },
  yMin: { type: Number, default: 0 },
  yMax: { type: Number, default: 100 },
  minWidth: String,
  maxWidth: String,
  minHeight: { type: String, default: "none" },
  maxHeight: String,
  color: { type: String, default: "#4A90E2" },
  fillColor: { type: String, default: "#d3e0ed" },
  showLegend: { type: [Boolean, String], default: "true" },
  showTooltip: { type: [Boolean, String], default: "true" },
  showMarker: { type: [Boolean, String], default: "true" },
  markerSize: { type: [Number, String], default: "4" },
  xAxisGridLines: { type: [Boolean, String], default: "true" },
  yAxisGridLines: { type: [Boolean, String], default: "true" },
  xAxisLineWidth: { type: [Number, String], default: "1" },
  yAxisLineWidth: { type: [Number, String], default: "1" },
  gridLineXColor: { type: String, default: "#E0E0E0" },
  gridLineYColor: { type: String, default: "#E0E0E0" },
  xAxisLabel: { type: [Boolean, String], default: true },
  yAxisLabel: { type: [Boolean, String], default: true },
  borderAll: Number,
  borderTop: Number,
  borderRight: Number,
  borderBottom: Number,
  borderLeft: Number,
  borderColor: String,
  borderStyle: String,
  borderTopColor: String,
  borderRightColor: String,
  borderBottomColor: String,
  borderLeftColor: String,
  borderRadiusAll: Number,
  borderRadiusTopLeft: Number,
  borderRadiusTopRight: Number,
  borderRadiusBottomRight: Number,
  borderRadiusBottomLeft: Number,
  boxShadow: String,
  boxShadowColor: String,
  boxShadowOffsetX: Number,
  boxShadowOffsetY: Number,
  boxShadowBlurRadius: Number,
  boxShadowSpreadRadius: Number,
  textShadow: String,
  paddingAll: Number,
  paddingTop: Number,
  paddingRight: Number,
  paddingBottom: Number,
  paddingLeft: Number,
  marginAll: Number,
  marginTop: Number,
  marginRight: Number,
  marginBottom: Number,
  marginLeft: Number,
  bgColor: String,
  useLinearGradient: Boolean,
  gradientColors: { type: Array, default: () => ["pink", "white"] },
  gradientAngle: Number,
  gradientStops: Array,
  useRadialGradient: [Boolean, String],
  radialGradientColors: Array,
  radialGradientStops: Array,
  bgUrl: String,
  backgroundSize: String,
  seoAlt: { type: String, default: "test img" },
  seoTitle: String,
  backgroundRepeat: { type: String, default: "repeat" },
  useLinearGradientForeground: { type: [Boolean, String], default: false },
  gradientColorsForeground: { type: Array, default: () => ["red", "white", "green"] },
  gradientAngleForeground: { type: Number, default: 30 },
  gradientStopsForeground: { type: Array, default: () => [0, 50, 100] },
  useRadialGradientForeground: { type: [Boolean, String], default: false },
  radialGradientColorsForeground: { type: Array, default: () => ["red", "pink", "green"] },
  radialGradientStopsForeground: { type: Array, default: () => [0, 50, 100] },
  foregroundColor: { type: String, default: "" },
  childAlign: String,
  tailwaindClasses: { type: String, default: "" },
  width: String,
  height: String,
});

const hoveredPoint = ref(null);
const isVisible = ref(false);
const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
});
const linePathRef = ref(null);
const clipRectRef = ref(null);
const containerRef = ref(null);
const svgRef = ref(null);

const useTailwind = computed(() => !!props.tailwaindClasses);

// Coerce string values to booleans
const effectiveShowLegend = computed(() => props.showLegend === "true" || props.showLegend === true);
const effectiveShowTooltip = computed(() => props.showTooltip === "true" || props.showTooltip === true);
const effectiveShowMarker = computed(() => props.showMarker === "true" || props.showMarker === true);
const effectiveXAxisGridLines = computed(() => props.xAxisGridLines === "true" || props.xAxisGridLines === true);
const effectiveYAxisGridLines = computed(() => props.yAxisGridLines === "true" || props.yAxisGridLines === true);
const effectiveXAxisLabel = computed(() => props.xAxisLabel === "true" || props.xAxisLabel === true);
const effectiveYAxisLabel = computed(() => props.yAxisLabel === "true" || props.yAxisLabel === true);

const svgDimensions = ref({
  width: 560,
  height: 400 - (effectiveShowLegend.value ? 40 : 0),
});

// Update dimensions relative to showLegend change
watch(effectiveShowLegend, (newVal) => {
    // Re-trigger dimension usage or just let ResizeObserver handle it if it resizes the container
});

// Background logic
const chartBgColor = computed(() => {
  if (props.bgColor) {
    if (props.bgColor.trim().startsWith("linear-gradient(") || props.bgColor.trim().startsWith("radial-gradient(")) {
      return "transparent";
    }
    return props.bgColor;
  }
  return "transparent";
});

const chartBgImage = computed(() => {
  let bgImage = "";
  if (props.bgColor && (props.bgColor.trim().startsWith("linear-gradient(") || props.bgColor.trim().startsWith("radial-gradient("))) {
    bgImage = props.bgColor;
  }

  // Fallback
  if (!bgImage) {
    if (props.useRadialGradient && props.radialGradientColors && props.radialGradientColors.length > 0) {
       const stops = props.radialGradientStops?.length === props.radialGradientColors.length
          ? props.radialGradientStops
          : Array.from({ length: props.radialGradientColors.length }, (_, i) => Math.round((i / (props.radialGradientColors.length - 1)) * 100));
       const colorStops = props.radialGradientColors.map((color, i) => `${color} ${stops[i]}%`).join(", ");
       bgImage = `radial-gradient(circle at center, ${colorStops})`;
    } else if (props.useLinearGradient && props.gradientColors && props.gradientColors.length > 0) {
       const stops = props.gradientStops?.length === props.gradientColors.length
          ? props.gradientStops
          : Array.from({ length: props.gradientColors.length }, (_, i) => Math.round((i / (props.gradientColors.length - 1)) * 100));
       const colorStops = props.gradientColors.map((color, i) => `${color} ${stops[i]}%`).join(", ");
       bgImage = `linear-gradient(${props.gradientAngle}deg, ${colorStops})`;
    }
  }

  if (props.bgUrl) {
    const imgUrl = `url(${props.bgUrl})`;
    bgImage = bgImage ? `${imgUrl}, ${bgImage}` : imgUrl;
  }
  return bgImage;
});

// Foreground
const effectiveForegroundColor = computed(() => props.foregroundColor || "#374151");
const useGradientForText = computed(() => props.useLinearGradientForeground || props.useRadialGradientForeground);

const getForegroundGradientCSS = () => {
    if (props.useRadialGradientForeground && props.radialGradientColorsForeground?.length > 0) {
        const stops = props.radialGradientStopsForeground?.length === props.radialGradientColorsForeground.length
            ? props.radialGradientStopsForeground
            : Array.from({ length: props.radialGradientColorsForeground.length }, (_, i) => Math.round((i / (props.radialGradientColorsForeground.length - 1)) * 100));
        const colorStops = props.radialGradientColorsForeground.map((color, i) => `${color} ${stops[i]}%`).join(", ");
        return `radial-gradient(circle at center, ${colorStops})`;
    } else if (props.useLinearGradientForeground && props.gradientColorsForeground?.length > 0) {
         const stops = props.gradientStopsForeground?.length === props.gradientColorsForeground.length
            ? props.gradientStopsForeground
            : Array.from({ length: props.gradientColorsForeground.length }, (_, i) => Math.round((i / (props.gradientColorsForeground.length - 1)) * 100));
         const colorStops = props.gradientColorsForeground.map((color, i) => `${color} ${stops[i]}%`).join(", ");
         return `linear-gradient(${props.gradientAngleForeground}deg, ${colorStops})`;
    }
    return null;
};

const titleTextStyle = computed(() => {
    const gradientCSS = useGradientForText.value ? getForegroundGradientCSS() : null;
    return {
        color: useGradientForText.value ? "transparent" : effectiveForegroundColor.value,
        textShadow: props.textShadow,
        ...(useGradientForText.value && {
            backgroundImage: gradientCSS,
            WebkitBackgroundClip: "text",
            backgroundClip: "text"
        })
    };
});

const getBackgroundSize = (fit) => {
    const map = {
      none: "auto",
      cover: "cover",
      contain: "contain",
      fill: "100% 100%",
      fitHeight: "auto 100%",
      fitWidth: "100% auto",
    };
    return map[fit] || "auto";
};

const getBackgroundRepeat = (rep) => {
    const map = {
      none: "no-repeat",
      repeatX: "repeat-x",
      repeatY: "repeat-y",
      repeat: "repeat",
    };
    return map[rep] || "no-repeat";
};

// Styles
const getSizedValue = (value) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === "number") return `${value}px`;
    return value.toString();
};

const effectiveBoxShadow = computed(() => 
    props.boxShadow || (props.boxShadowColor 
    ? `${props.boxShadowOffsetX || 10}px ${props.boxShadowOffsetY || 10}px ${props.boxShadowBlurRadius || 50}px ${props.boxShadowSpreadRadius || 5}px ${props.boxShadowColor}`
    : undefined)
);

const marginStyle = computed(() => {
    if (useTailwind.value) return {};
    const eMarginTop = props.marginTop || props.marginAll || 0;
    const eMarginRight = props.marginRight || props.marginAll || 0;
    const eMarginBottom = props.marginBottom || props.marginAll || 0;
    const eMarginLeft = props.marginLeft || props.marginAll || 0;
    return {
        marginTop: `${eMarginTop}px`,
        marginRight: `${eMarginRight}px`,
        marginBottom: `${eMarginBottom}px`,
        marginLeft: `${eMarginLeft}px`,
    };
});

const layoutStyles = computed(() => {
   if (useTailwind.value) return {};
   
   const eBorderTop = props.borderTop || props.borderAll || 0;
   const eBorderRight = props.borderRight || props.borderAll || 0;
   const eBorderBottom = props.borderBottom || props.borderAll || 0;
   const eBorderLeft = props.borderLeft || props.borderAll || 0;

   const ePaddingTop = props.paddingTop || props.paddingAll || 0;
   const ePaddingRight = props.paddingRight || props.paddingAll || 0;
   const ePaddingBottom = props.paddingBottom || props.paddingAll || 0;
   const ePaddingLeft = props.paddingLeft || props.paddingAll || 0;

   const radiusStyles = {
        borderTopLeftRadius: `${props.borderRadiusTopLeft || props.borderRadiusAll || 0}px`,
        borderTopRightRadius: `${props.borderRadiusTopRight || props.borderRadiusAll || 0}px`,
        borderBottomRightRadius: `${props.borderRadiusBottomRight || props.borderRadiusAll || 0}px`,
        borderBottomLeftRadius: `${props.borderRadiusBottomLeft || props.borderRadiusAll || 0}px`,
   };

   return {
       width: getSizedValue(props.width),
       height: getSizedValue(props.height),
       minWidth: getSizedValue(props.minWidth),
       maxWidth: getSizedValue(props.maxWidth),
       minHeight: getSizedValue(props.minHeight),
       maxHeight: getSizedValue(props.maxHeight),
       boxSizing: "border-box",
       borderTopWidth: `${eBorderTop}px`,
       borderRightWidth: `${eBorderRight}px`,
       borderBottomWidth: `${eBorderBottom}px`,
       borderLeftWidth: `${eBorderLeft}px`,
       borderTopColor: props.borderTopColor || props.borderColor || "#000000",
       borderRightColor: props.borderRightColor || props.borderColor || "#000000",
       borderBottomColor: props.borderBottomColor || props.borderColor || "#000000",
       borderLeftColor: props.borderLeftColor || props.borderColor || "#000000",
       borderStyle: props.borderStyle === "none" ? "none" : props.borderStyle || "solid",
       paddingTop: `${ePaddingTop}px`,
       paddingRight: `${ePaddingRight}px`,
       paddingBottom: `${ePaddingBottom}px`,
       paddingLeft: `${ePaddingLeft}px`,
       ...radiusStyles
   };
});

const borderedContainerStyle = computed(() => ({
    ...(effectiveBoxShadow.value && { boxShadow: effectiveBoxShadow.value }),
    ...layoutStyles.value,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    backgroundColor: chartBgColor.value,
    ...(chartBgImage.value && { backgroundImage: chartBgImage.value }),
    ...(props.bgUrl && {
        backgroundRepeat: getBackgroundRepeat(props.backgroundRepeat),
        backgroundSize: getBackgroundSize(props.backgroundSize),
        backgroundPosition: "center center",
    })
}));

const outerClassName = computed(() => {
    let alignClass = "items-center";
    switch(props.childAlign) {
        case "left": alignClass = "items-start"; break;
        case "center": alignClass = "items-center"; break;
        case "right": alignClass = "items-end"; break;
        case "stretch": alignClass = "items-stretch"; break;
        case "baseline": alignClass = "items-baseline"; break;
        case "auto": default: alignClass = "items-center"; break;
    }
    return `relative flex flex-col ${useTailwind.value ? "" : "mt-20"} ${alignClass}`;
});

// Chart Logic
const svgWidth = computed(() => svgDimensions.value.width);
const svgHeight = computed(() => svgDimensions.value.height);

const basePadding = 60;
const dynamicPadding = computed(() => Math.max(
    20,
    Math.min(basePadding, svgWidth.value * 0.1, svgHeight.value * 0.1)
));
const padding = computed(() => dynamicPadding.value);
const leftPadding = computed(() => Math.max(50, dynamicPadding.value));

const dataXValues = computed(() => props.data?.data?.map((d) => d.x) || []);
const dataYValues = computed(() => props.data?.data?.map((d) => d.y) || []);

const effectiveXMin = computed(() => Math.min(props.xMin, Math.min(...dataXValues.value)));
const effectiveXMax = computed(() => {
    let val = Math.max(props.xMax, Math.max(...dataXValues.value));
    if (val === effectiveXMin.value) val = effectiveXMin.value + 1;
    return val;
});

const effectiveYMin = computed(() => Math.min(props.yMin, Math.min(...dataYValues.value)));
const effectiveYMax = computed(() => {
    let val = Math.max(props.yMax, Math.max(...dataYValues.value));
    if (val === effectiveYMin.value) val = effectiveYMin.value + 1;
    return val;
});

const scaleX = (x) => 
    ((x - effectiveXMin.value) / (effectiveXMax.value - effectiveXMin.value)) *
    (svgWidth.value - leftPadding.value - padding.value) +
    leftPadding.value;

const scaleY = (y) =>
    svgHeight.value -
    padding.value -
    ((y - effectiveYMin.value) / (effectiveYMax.value - effectiveYMin.value)) *
    (svgHeight.value - 2 * padding.value);

const createCurvePath = (points) => {
    if (!points || points.length < 2) return "";
    let d = `M ${scaleX(points[0].x)} ${scaleY(points[0].y)}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;
        const cp1x = scaleX(p1.x + (p2.x - p0.x) / 6);
        const cp1y = scaleY(p1.y + (p2.y - p0.y) / 6);
        const cp2x = scaleX(p2.x - (p3.x - p1.x) / 6);
        const cp2y = scaleY(p2.y - (p3.y - p1.y) / 6);
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${scaleX(p2.x)} ${scaleY(p2.y)}`;
    }
    return d;
};

const createSmoothPath = (points) => {
    if (!points || points.length === 0) return "";
    let curveD = createCurvePath(points);
    curveD += ` L ${scaleX(points[points.length - 1].x)} ${svgHeight.value - padding.value}`;
    curveD += ` L ${leftPadding.value} ${svgHeight.value - padding.value}`;
    curveD += ` L ${leftPadding.value} ${scaleY(points[0].y)}`;
    curveD += " Z";
    return curveD;
};

const areaD = computed(() => createSmoothPath(props.data?.data));
const curveD = computed(() => createCurvePath(props.data?.data));

const xTicks = computed(() => 
    Array.from(
        { length: Math.floor(effectiveXMax.value - effectiveXMin.value) + 1 },
        (_, i) => effectiveXMin.value + i
    )
);

const yTicks = computed(() => {
    const numYTicks = 6;
    const yStep = (effectiveYMax.value - effectiveYMin.value) / (numYTicks - 1);
    return Array.from({ length: numYTicks }, (_, i) => Math.round(effectiveYMin.value + i * yStep));
});

// Tooltip logic
const handleMouseEnter = (p, e) => {
    if (!effectiveShowTooltip.value) return;
    const rect = containerRef.value.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;

    const tooltipWidth = 120;
    const tooltipHeight = 50;
    if (mouseX + tooltipWidth > svgDimensions.value.width) mouseX -= tooltipWidth;
    if (mouseY + tooltipHeight > svgDimensions.value.height) mouseY -= tooltipHeight;
    if (mouseX < 0) mouseX = 10;
    if (mouseY < 0) mouseY = 10;

    tooltip.value = {
        visible: true,
        x: mouseX,
        y: mouseY,
    };
    hoveredPoint.value = p;
};

const handleMouseMove = (e) => {
    if (!tooltip.value.visible) return;
    const rect = containerRef.value.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;

    const tooltipWidth = 120;
    const tooltipHeight = 50;
    if (mouseX + tooltipWidth > svgDimensions.value.width) mouseX -= tooltipWidth;
    if (mouseY + tooltipHeight > svgDimensions.value.height) mouseY -= tooltipHeight;
    if (mouseX < 0) mouseX = 10;
    if (mouseY < 0) mouseY = 10;

    tooltip.value.x = mouseX;
    tooltip.value.y = mouseY;
};

const handleMouseLeave = () => {
    tooltip.value.visible = false;
    hoveredPoint.value = null;
};

const svgAttrs = computed(() => ({
    width: "100%",
    height: "100%",
    viewBox: `0 0 ${svgWidth.value} ${svgHeight.value}`,
    preserveAspectRatio: "xMidYMid meet",
}));


// Effect: Visibility Observer
let observer;
onMounted(() => {
    observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            observer.disconnect();
            isVisible.value = true;
        }
    }, { threshold: 0.1 });
    if (containerRef.value) {
        observer.observe(containerRef.value);
    }
});

onUnmounted(() => {
    if (observer) observer.disconnect();
    if (resizeObserver) resizeObserver.disconnect();
});

// Effect: Resize Observer
let resizeObserver;
onMounted(() => {
  const updateDimensions = () => {
    if (svgRef.value) {
      const rect = svgRef.value.getBoundingClientRect();
      svgDimensions.value = { width: rect.width, height: rect.height };
    }
  };

  if (svgRef.value) updateDimensions();

  resizeObserver = new ResizeObserver(updateDimensions);
  if (svgRef.value) resizeObserver.observe(svgRef.value);
});


// Effect: Animation
watch([isVisible, curveD, leftPadding, svgHeight], ([visible, curve, left, height]) => {
    if (visible && linePathRef.value && clipRectRef.value) {
      const linePath = linePathRef.value;
      const clipRect = clipRectRef.value;
      const totalLength = linePath.getTotalLength();
      linePath.style.strokeDasharray = totalLength;
      linePath.style.strokeDashoffset = totalLength;
      clipRect.setAttribute("width", "0");
      let startTime = null;
      const duration = 2000;
      const animate = (timestamp) => {
        if (startTime === null) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentLength = progress * totalLength;
        const point = linePath.getPointAtLength(currentLength);
        
        // Safety check for point
        if (point) {
             const clipWidth = Math.max(0, point.x - left); // Ensure non-negative
             clipRect.setAttribute("width", clipWidth);
             linePath.style.strokeDashoffset = totalLength - currentLength;
        }
       
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
});

</script>
