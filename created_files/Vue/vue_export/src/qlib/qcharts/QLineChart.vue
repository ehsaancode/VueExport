<!-- <template>
  <div class="q-component-stub QLineChart">
    QLineChart (Stub)
    <slot></slot>
  </div>
</template>

<script setup>
// Stub component for QLineChart
const props = defineProps({
  tailwaindClasses: String,
  widgetId: String,
  // Accept any other props loosely
});
</script>

<style scoped>
.q-component-stub {
  border: 1px dashed red;
  padding: 4px;
  color: red;
}
</style> -->

<template>
  <div
    ref="containerRef"
    class="relative flex flex-col"
    :class="outerItemsClass"
  >
    <div :style="marginStyle">
      <div
        :style="borderedContainerStyle"
        :class="tailwaindClasses || ''"
        :title="seoTitle"
        :aria-label="seoAlt"
      >
        <svg
          ref="svgRef"
          width="100%"
          height="100%"
          :viewBox="`0 0 ${svgDimensions.width} ${svgDimensions.height}`"
          preserveAspectRatio="xMidYMid meet"
          :style="{
            flex: effectiveShowLegend ? 1 : undefined,
            width: '100%',
            height: '100%',
          }"
          @mouseleave="handleMouseLeave"
        >
          <defs>
            <template v-if="useGradientForText">
              <template v-if="isForegroundGradient">
                <component
                  :is="parsedForeground.type"
                  id="fgGrad"
                  :cx="parsedForeground.cx"
                  :cy="parsedForeground.cy"
                  :r="parsedForeground.r"
                  :x1="parsedForeground.x1"
                  :y1="parsedForeground.y1"
                  :x2="parsedForeground.x2"
                  :y2="parsedForeground.y2"
                  gradientUnits="objectBoundingBox"
                  :gradientTransform="parsedForeground.gradientTransform"
                >
                  <stop
                    v-for="(stop, i) in parsedForeground.colorStops"
                    :key="i"
                    :offset="`${stop.offset}%`"
                    :stop-color="stop.color"
                  />
                </component>
              </template>
              <radialGradient
                v-else-if="useRadialGradientForeground"
                id="fgGrad"
                cx="0.5"
                cy="0.5"
                r="0.5"
                gradientUnits="objectBoundingBox"
              >
                <stop
                  v-for="(color, i) in radialGradientColorsForeground"
                  :key="i"
                  :offset="`${radialStopsForeground[i]}%`"
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
                  :offset="`${linearStopsForeground[i]}%`"
                  :stop-color="color"
                />
              </linearGradient>
            </template>
          </defs>
          <!-- Grid lines -->
          <template v-if="effectiveXAxisGridLines">
            <line
              v-for="x in xTicks"
              :key="`gx-${x}`"
              :x1="scaleX(x)"
              :y1="padding"
              :x2="scaleX(x)"
              :y2="svgDimensions.height - padding"
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
              :x2="svgDimensions.width - padding"
              :y2="scaleY(y)"
              :stroke="gridLineYColor"
              :stroke-width="yAxisLineWidth"
            />
          </template>
          <!-- Axes -->
          <line
            :x1="leftPadding"
            :y1="svgDimensions.height - padding"
            :x2="svgDimensions.width - padding"
            :y2="svgDimensions.height - padding"
            class="stroke-black"
          />
          <line
            :x1="leftPadding"
            :y1="padding"
            :x2="leftPadding"
            :y2="svgDimensions.height - padding"
            class="stroke-black"
          />
          <!-- Smooth line with animation -->
          <path
            ref="pathRef"
            :d="pathD"
            fill="none"
            :stroke="color"
            stroke-width="4"
            class="opacity-60"
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
              :y="svgDimensions.height - padding + 20"
              class="text-xs text-center"
              text-anchor="middle"
              :fill="useGradientForText ? 'url(#fgGrad)' : effectiveForegroundColor"
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
          <div>x: {{ hoveredPoint.x }}, y: {{ hoveredPoint.y }}</div>
        </div>
        <div v-if="effectiveShowLegend" class="flex items-center justify-center mt-4 gap-2">
          <div
            class="w-3 h-3 rounded opacity-60"
            :style="{ backgroundColor: color }"
          ></div>
          <span class="text-xs" :style="titleTextStyle">{{ data.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      title: 'Product A',
      data: [
        { x: 1, y: 80 },
        { x: 2, y: 50 },
        { x: 3, y: 90 },
        { x: 4, y: 20 },
        { x: 5, y: 40 },
        { x: 6, y: 95 },
        { x: 7, y: 30 },
        { x: 8, y: 60 },
        { x: 9, y: 10 },
        { x: 10, y: 20 },
      ],
    }),
  },
  width: [Number, String],
  height: [Number, String],
  xMin: { type: Number, default: 1 },
  xMax: { type: Number, default: 10 },
  yMin: { type: Number, default: 0 },
  yMax: { type: Number, default: 100 },
  color: { type: String, default: '#4A90E2' },
  minWidth: String,
  maxWidth: String,
  minHeight: String,
  maxHeight: String,
  showLegend: { type: [Boolean, String], default: 'true' },
  showTooltip: { type: [Boolean, String], default: 'true' },
  showMarker: { type: [Boolean, String], default: 'true' },
  markerSize: { type: Number, default: 4 },
  xAxisGridLines: { type: [Boolean, String], default: 'true' },
  yAxisGridLines: { type: [Boolean, String], default: 'true' },
  xAxisLineWidth: [Number, String],
  yAxisLineWidth: [Number, String],
  gridLineXColor: { type: String, default: '#E0E0E0' },
  gridLineYColor: { type: String, default: '#E0E0E0' },
  xAxisLabel: { type: [Boolean, String], default: 'true' },
  yAxisLabel: { type: [Boolean, String], default: 'true' },
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
  gradientColors: Array,
  gradientAngle: Number,
  gradientStops: Array,
  useRadialGradient: Boolean,
  radialGradientColors: Array,
  radialGradientStops: Array,
  bgUrl: String,
  backgroundSize: String,
  seoAlt: String,
  seoTitle: String,
  backgroundRepeat: String,
  useLinearGradientForeground: Boolean,
  gradientColorsForeground: Array,
  gradientAngleForeground: Number,
  gradientStopsForeground: Array,
  useRadialGradientForeground: Boolean,
  radialGradientColorsForeground: Array,
  radialGradientStopsForeground: Array,
  foreground: String,
  childAlign: String,
  tailwaindClasses: String,
});

const hoveredPoint = ref(null);
const isVisible = ref(false);
const svgDimensions = ref({ width: 560, height: 400 - (props.showLegend === 'true' || props.showLegend === true ? 40 : 0) });
const tooltip = ref({ visible: false, x: 0, y: 0 });
const pathRef = ref(null);
const containerRef = ref(null);
const svgRef = ref(null);

const effectiveShowLegend = computed(() => props.showLegend === 'true' || props.showLegend === true);
const effectiveShowTooltip = computed(() => props.showTooltip === 'true' || props.showTooltip === true);
const effectiveShowMarker = computed(() => props.showMarker === 'true' || props.showMarker === true);
const effectiveXAxisGridLines = computed(() => props.xAxisGridLines === 'true' || props.xAxisGridLines === true);
const effectiveYAxisGridLines = computed(() => props.yAxisGridLines === 'true' || props.yAxisGridLines === true);
const effectiveXAxisLabel = computed(() => props.xAxisLabel === 'true' || props.xAxisLabel === true);
const effectiveYAxisLabel = computed(() => props.yAxisLabel === 'true' || props.yAxisLabel === true);

const applyInlineSizing = computed(() => !props.tailwaindClasses);
const applyInlinePadding = computed(() => !props.tailwaindClasses);
const applyInlineMargin = computed(() => !props.tailwaindClasses);
const applyInlineBorders = computed(() => !props.tailwaindClasses);

const dataXValues = computed(() => props.data.data.map(d => d.x));
const dataYValues = computed(() => props.data.data.map(d => d.y));
const dataXMin = computed(() => Math.min(...dataXValues.value));
const dataXMax = computed(() => Math.max(...dataXValues.value));
const dataYMin = computed(() => Math.min(...dataYValues.value));
const dataYMax = computed(() => Math.max(...dataYValues.value));

const effectiveXMin = computed(() => Math.min(props.xMin, dataXMin.value));
const effectiveXMax = computed(() => Math.max(props.xMax, dataXMax.value));
const effectiveYMin = computed(() => Math.min(props.yMin, dataYMin.value));
const effectiveYMax = computed(() => Math.max(props.yMax, dataYMax.value));

const effectiveBoxShadow = computed(() => props.boxShadow || (props.boxShadowColor ? `${props.boxShadowOffsetX}px ${props.boxShadowOffsetY}px ${props.boxShadowBlurRadius}px ${props.boxShadowSpreadRadius}px ${props.boxShadowColor}` : undefined));

let chartBgColor = 'transparent';
let chartBgImage = '';
if (props.bgColor) {
  const bgColorTrim = props.bgColor.trim();
  if (bgColorTrim.startsWith('linear-gradient(') || bgColorTrim.startsWith('radial-gradient(')) {
    chartBgImage = bgColorTrim;
    chartBgColor = 'transparent';
  } else {
    chartBgColor = bgColorTrim;
  }
}

const getFallbackBackgroundImage = () => {
  if (props.useRadialGradient && props.radialGradientColors && props.radialGradientColors.length > 0) {
    const stops = props.radialGradientStops.length === props.radialGradientColors.length
      ? props.radialGradientStops
      : Array.from({ length: props.radialGradientColors.length }, (_, i) => Math.round((i / (props.radialGradientColors.length - 1)) * 100));
    const colorStops = props.radialGradientColors.map((color, i) => `${color} ${stops[i]}%`).join(', ');
    return `radial-gradient(circle at center, ${colorStops})`;
  } else if (props.useLinearGradient && props.gradientColors && props.gradientColors.length > 0) {
    const stops = props.gradientStops.length === props.gradientColors.length
      ? props.gradientStops
      : Array.from({ length: props.gradientColors.length }, (_, i) => Math.round((i / (props.gradientColors.length - 1)) * 100));
    const colorStops = props.gradientColors.map((color, i) => `${color} ${stops[i]}%`).join(', ');
    return `linear-gradient(${props.gradientAngle}deg, ${colorStops})`;
  }
  return null;
};
const fallbackBgImage = getFallbackBackgroundImage();
if (!chartBgImage && fallbackBgImage) {
  chartBgImage = fallbackBgImage;
}
if (props.bgUrl) {
  const imgUrl = `url(${props.bgUrl})`;
  chartBgImage = chartBgImage ? `${imgUrl}, ${chartBgImage}` : imgUrl;
}

const effectiveForegroundColor = computed(() => props.foreground || '#374151');
const isForegroundGradient = computed(() => typeof props.foreground === 'string' && (props.foreground.startsWith('linear-gradient(') || props.foreground.startsWith('radial-gradient(')));
const useGradientForText = computed(() => props.useLinearGradientForeground || props.useRadialGradientForeground || isForegroundGradient.value);

const getForegroundGradientCSS = () => {
  if (isForegroundGradient.value) {
    return props.foreground;
  }
  if (props.useRadialGradientForeground && props.radialGradientColorsForeground && props.radialGradientColorsForeground.length > 0) {
    const stops = props.radialGradientStopsForeground.length === props.radialGradientColorsForeground.length
      ? props.radialGradientStopsForeground
      : Array.from({ length: props.radialGradientColorsForeground.length }, (_, i) => Math.round((i / (props.radialGradientColorsForeground.length - 1)) * 100));
    const colorStops = props.radialGradientColorsForeground.map((color, i) => `${color} ${stops[i]}%`).join(', ');
    return `radial-gradient(circle at center, ${colorStops})`;
  } else if (props.useLinearGradientForeground && props.gradientColorsForeground && props.gradientColorsForeground.length > 0) {
    const stops = props.gradientStopsForeground.length === props.gradientColorsForeground.length
      ? props.gradientStopsForeground
      : Array.from({ length: props.gradientColorsForeground.length }, (_, i) => Math.round((i / (props.gradientColorsForeground.length - 1)) * 100));
    const colorStops = props.gradientColorsForeground.map((color, i) => `${color} ${stops[i]}%`).join(', ');
    return `linear-gradient(${props.gradientAngleForeground}deg, ${colorStops})`;
  }
  return null;
};
const foregroundGradientCSS = computed(() => useGradientForText.value ? getForegroundGradientCSS() : null);

const titleTextStyle = computed(() => ({
  color: useGradientForText.value ? 'transparent' : effectiveForegroundColor.value,
  ...(useGradientForText.value && {
    backgroundImage: foregroundGradientCSS.value,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
  }),
}));

const getBackgroundSize = (fit) => {
  const map = {
    none: 'auto',
    cover: 'cover',
    contain: 'contain',
    fill: '100% 100%',
    fitHeight: 'auto 100%',
    fitWidth: '100% auto',
  };
  return map[fit] || 'auto';
};

const getBackgroundRepeat = (rep) => {
  const map = {
    none: 'no-repeat',
    repeatX: 'repeat-x',
    repeatY: 'repeat-y',
    repeat: 'repeat',
  };
  return map[rep] || 'no-repeat';
};

if (!props.data || !props.data.data || props.data.data.length === 0) {
  console.warn('No data');
}

const effectiveBorderTop = computed(() => applyInlineBorders.value ? (props.borderTop || props.borderAll || 0) : 0);
const effectiveBorderRight = computed(() => applyInlineBorders.value ? (props.borderRight || props.borderAll || 0) : 0);
const effectiveBorderBottom = computed(() => applyInlineBorders.value ? (props.borderBottom || props.borderAll || 0) : 0);
const effectiveBorderLeft = computed(() => applyInlineBorders.value ? (props.borderLeft || props.borderAll || 0) : 0);
const effectivePaddingTop = computed(() => applyInlinePadding.value ? (props.paddingTop || props.paddingAll || 0) : 0);
const effectivePaddingRight = computed(() => applyInlinePadding.value ? (props.paddingRight || props.paddingAll || 0) : 0);
const effectivePaddingBottom = computed(() => applyInlinePadding.value ? (props.paddingBottom || props.paddingAll || 0) : 0);
const effectivePaddingLeft = computed(() => applyInlinePadding.value ? (props.paddingLeft || props.paddingAll || 0) : 0);
const effectiveMarginTop = computed(() => applyInlineMargin.value ? (props.marginTop || props.marginAll || 0) : 0);
const effectiveMarginRight = computed(() => applyInlineMargin.value ? (props.marginRight || props.marginAll || 0) : 0);
const effectiveMarginBottom = computed(() => applyInlineMargin.value ? (props.marginBottom || props.marginAll || 0) : 0);
const effectiveMarginLeft = computed(() => applyInlineMargin.value ? (props.marginLeft || props.marginAll || 0) : 0);

const marginStyle = computed(() => applyInlineMargin.value ? {
  marginTop: `${effectiveMarginTop.value}px`,
  marginRight: `${effectiveMarginRight.value}px`,
  marginBottom: `${effectiveMarginBottom.value}px`,
  marginLeft: `${effectiveMarginLeft.value}px`,
} : {});

const getSizedValue = (value) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'number') return `${value}px`;
  return value.toString();
};

const borderedContainerStyle = computed(() => ({
  ...(applyInlineSizing.value && {
    width: getSizedValue(props.width),
    height: getSizedValue(props.height),
    minWidth: getSizedValue(props.minWidth),
    maxWidth: getSizedValue(props.maxWidth),
    minHeight: getSizedValue(props.minHeight),
    maxHeight: getSizedValue(props.maxHeight),
  }),
  boxSizing: 'border-box',
  ...(applyInlineBorders.value && {
    borderTopWidth: `${effectiveBorderTop.value}px`,
    borderRightWidth: `${effectiveBorderRight.value}px`,
    borderBottomWidth: `${effectiveBorderBottom.value}px`,
    borderLeftWidth: `${effectiveBorderLeft.value}px`,
    borderTopColor: props.borderTopColor || props.borderColor,
    borderRightColor: props.borderRightColor || props.borderColor,
    borderBottomColor: props.borderBottomColor || props.borderColor,
    borderLeftColor: props.borderLeftColor || props.borderColor,
    borderStyle: props.borderStyle === 'none' ? 'none' : props.borderStyle,
    borderTopLeftRadius: `${props.borderRadiusTopLeft || props.borderRadiusAll || 0}px`,
    borderTopRightRadius: `${props.borderRadiusTopRight || props.borderRadiusAll || 0}px`,
    borderBottomRightRadius: `${props.borderRadiusBottomRight || props.borderRadiusAll || 0}px`,
    borderBottomLeftRadius: `${props.borderRadiusBottomLeft || props.borderRadiusAll || 0}px`,
  }),
  ...(effectiveBoxShadow.value && { boxShadow: effectiveBoxShadow.value }),
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  ...(applyInlinePadding.value && {
    paddingTop: `${effectivePaddingTop.value}px`,
    paddingRight: `${effectivePaddingRight.value}px`,
    paddingBottom: `${effectivePaddingBottom.value}px`,
    paddingLeft: `${effectivePaddingLeft.value}px`,
  }),
  backgroundColor: chartBgColor,
  ...(chartBgImage && { backgroundImage: chartBgImage }),
  ...(props.bgUrl && {
    backgroundRepeat: getBackgroundRepeat(props.backgroundRepeat),
    backgroundSize: getBackgroundSize(props.backgroundSize),
    backgroundPosition: 'center center',
  }),
}));

const basePadding = 60;
const dynamicPadding = computed(() => Math.max(20, Math.min(basePadding, svgDimensions.value.width * 0.1, svgDimensions.value.height * 0.1)));
const padding = computed(() => dynamicPadding.value);
const leftPadding = computed(() => Math.max(50, dynamicPadding.value));

const scaleX = (x) => ((x - effectiveXMin.value) / (effectiveXMax.value - effectiveXMin.value)) * (svgDimensions.value.width - leftPadding.value - padding.value) + leftPadding.value;
const scaleY = (y) => svgDimensions.value.height - padding.value - ((y - effectiveYMin.value) / (effectiveYMax.value - effectiveYMin.value)) * (svgDimensions.value.height - 2 * padding.value);

const createSmoothPath = (points) => {
  if (points.length < 2) return '';
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

const pathD = computed(() => createSmoothPath(props.data.data));

const xTicks = computed(() => Array.from({ length: Math.floor(effectiveXMax.value - effectiveXMin.value) + 1 }, (_, i) => effectiveXMin.value + i));

const numYTicks = 6;
const yStep = computed(() => (effectiveYMax.value - effectiveYMin.value) / (numYTicks - 1));
const yTicks = computed(() => Array.from({ length: numYTicks }, (_, i) => Math.round(effectiveYMin.value + i * yStep.value)));

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
  tooltip.value.x = 0;
  tooltip.value.y = 0;
  hoveredPoint.value = null;
};

const getAlignItemsClass = (align) => {
  switch (align) {
    case 'left': return 'items-start';
    case 'center': return 'items-center';
    case 'right': return 'items-end';
    case 'stretch': return 'items-stretch';
    case 'baseline': return 'items-baseline';
    case 'auto':
    default: return 'items-center';
  }
};
const outerItemsClass = computed(() => getAlignItemsClass(props.childAlign));

if (svgDimensions.value.width <= 0 || svgDimensions.value.height <= 0) {
  console.warn('Insufficient space');
}

const parseLinearGradient = (gradientStr) => {
  if (!gradientStr || !gradientStr.startsWith('linear-gradient')) return null;
  const match = gradientStr.match(/^linear-gradient\s*\(\s*([^,]+)\s*,\s*(.+)\s*\)$/);
  if (!match) return null;
  let angle = 0;
  const angleStr = match[1].trim();
  const angleMatch = angleStr.match(/^([0-9.-]+)deg$/);
  if (angleMatch) {
    angle = parseFloat(angleMatch[1]);
  }
  let stopsStr = match[2].replace(/\)$/, '').trim();
  const stopRegex = /((?:rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|[a-z]+)\s*(?:([0-9.-]+)%?)?)/g;
  const stopMatches = [];
  let m;
  while ((m = stopRegex.exec(stopsStr)) !== null) {
    stopMatches.push(m[0]);
  }
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

const parseRadialGradient = (gradientStr) => {
  if (!gradientStr || !gradientStr.startsWith('radial-gradient')) return null;
  const match = gradientStr.match(/^radial-gradient\s*\(\s*([^,]+)\s*,\s*(.+)\s*\)$/);
  if (!match) return null;
  const shapeStr = match[1].trim();
  let stopsStr = match[2].replace(/\)$/, '').trim();
  const stopRegex = /((?:rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|[a-z]+)\s*(?:([0-9.-]+)%?)?)/g;
  const stopMatches = [];
  let m;
  while ((m = stopRegex.exec(stopsStr)) !== null) {
    stopMatches.push(m[0]);
  }
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
  return { shape: shapeStr, colorStops };
};

const parsedForeground = computed(() => {
  if (!isForegroundGradient.value) return null;
  const parsed = props.foreground.startsWith('linear-gradient')
    ? parseLinearGradient(props.foreground)
    : parseRadialGradient(props.foreground);
  if (!parsed) return null;
  if (parsed.angle !== undefined) {
    return {
      type: 'linearGradient',
      x1: '0',
      y1: '0',
      x2: '1',
      y2: '0',
      gradientTransform: `rotate(${parsed.angle}, 0.5, 0.5)`,
      colorStops: parsed.colorStops,
    };
  } else {
    return {
      type: 'radialGradient',
      cx: '0.5',
      cy: '0.5',
      r: '0.5',
      colorStops: parsed.colorStops,
    };
  }
});

const radialStopsForeground = computed(() => 
  props.radialGradientStopsForeground.length === props.radialGradientColorsForeground.length
    ? props.radialGradientStopsForeground
    : Array.from({ length: props.radialGradientColorsForeground.length }, (_, i) => Math.round((i / (props.radialGradientColorsForeground.length - 1)) * 100))
);

const linearStopsForeground = computed(() => 
  props.gradientStopsForeground.length === props.gradientColorsForeground.length
    ? props.gradientStopsForeground
    : Array.from({ length: props.gradientColorsForeground.length }, (_, i) => Math.round((i / (props.gradientColorsForeground.length - 1)) * 100))
);

onMounted(() => {
  const updateDimensions = () => {
    if (svgRef.value) {
      const rect = svgRef.value.getBoundingClientRect();
      svgDimensions.value = { width: rect.width, height: rect.height };
    }
  };
  updateDimensions();

  const resizeObserver = new ResizeObserver(updateDimensions);
  if (svgRef.value) {
    resizeObserver.observe(svgRef.value);
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      observer.disconnect();
      isVisible.value = true;
    }
  }, { threshold: 0.1 });
  if (containerRef.value) {
    observer.observe(containerRef.value);
  }
});

watch(pathD, () => {
  nextTick(() => {
    if (pathRef.value) {
      const length = pathRef.value.getTotalLength();
      pathRef.value.style.strokeDasharray = length;
      pathRef.value.style.strokeDashoffset = length;
    }
  });
});

watch(isVisible, (val) => {
  if (val && pathRef.value) {
    requestAnimationFrame(() => {
      pathRef.value.style.transition = 'stroke-dashoffset 2s ease-in-out';
      pathRef.value.style.strokeDashoffset = '0';
    });
  }
});

watch(effectiveShowLegend, () => {
  nextTick(() => {
    if (svgRef.value) {
      const rect = svgRef.value.getBoundingClientRect();
      svgDimensions.value = { width: rect.width, height: rect.height };
    }
  });
});
</script>