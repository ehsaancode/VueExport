<template>
  <div ref="containerRef" :class="['flex flex-col', outerItemsClass]">
    <div :style="marginStyle">
      <div
        :style="borderedContainerStyle"
        :class="tailwaindClasses"
        :title="seoTitle"
        :aria-label="seoAlt"
      >
        <svg :class="svgClassName" v-bind="svgAttrs" :style="svgStyle">
          <defs>
            <template v-if="useGradientForText">
              <template v-if="isForegroundGradient">
                <component :is="foregroundGradientComponent" />
              </template>
              <template v-else-if="effectiveUseRadialGradientForeground">
                 <radialGradient
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
                        v-for="(color, i) in gradientColorsForeground" 
                        :key="i"
                        :offset="`${gradientStopsForeground[i] || Math.round((i / (gradientColorsForeground.length - 1)) * 100)}%`"
                        :stop-color="color"
                     />
                  </linearGradient>
              </template>
            </template>
          </defs>

          <!-- Y grid lines (horizontal for values) -->
           <template v-if="effectiveShowYGrid">
              <line
                v-for="y in yTicks"
                :key="`gy-${y}`"
                :x1="padding"
                :y1="scaleY(y)"
                :x2="svgWidth - padding"
                :y2="scaleY(y)"
                :stroke="gridLineYColor"
                :stroke-width="yAxisLineWidth"
              />
           </template>

           <!-- X grid lines (vertical for categories) -->
           <template v-if="effectiveShowXGrid">
              <line
                v-for="(_, i) in data.data"
                :key="`gx-${i}`"
                :x1="scaleX(i)"
                :y1="padding"
                :x2="scaleX(i)"
                :y2="svgHeight - padding"
                :stroke="gridLineXColor"
                :stroke-width="xAxisLineWidth"
              />
           </template>

          <!-- Axes -->
          <line
            :x1="padding"
            :y1="svgHeight - padding"
            :x2="svgWidth - padding"
            :y2="svgHeight - padding"
            class="stroke-black"
          />
          <line
            :x1="padding"
            :y1="padding"
            :x2="padding"
            :y2="svgHeight - padding"
            class="stroke-black"
          />

          <!-- Bars -->
          <g v-for="(p, i) in data.data" :key="i">
            <rect
              :x="scaleX(i) - barWidth / 2"
              :y="svgHeight - padding - (animatedHeights[i] || 0)"
              :width="barWidth"
              :height="animatedHeights[i] || 0"
              :fill="getColor(p.y)"
              :rx="barRadius"
              :style="{ transition: transitionStyle }"
              class="cursor-pointer opacity-100 transition-opacity hover:opacity-100"
              @mouseenter="handleMouseEnter(p)"
              @mouseleave="handleMouseLeave"
            />
            
            <!-- Tooltip -->
            <g v-if="effectiveShowTooltip && hoveredPoint?.x === p.x">
                 <rect
                    :x="scaleX(i) - 45"
                    :y="scaleY(p.y) - 55"
                    width="100"
                    height="40"
                    rx="8"
                    fill="rgba(0,0,0,0.85)"
                 />
                 <text
                    :x="scaleX(i) + 5"
                    :y="scaleY(p.y) - 40"
                    fill="white"
                    text-anchor="middle"
                    font-size="12"
                 >
                    <tspan
                      :x="scaleX(i) + 5"
                      dy="0"
                      font-weight="bold"
                      font-size="13"
                    >{{ p.x }}</tspan>
                    <tspan 
                        :x="scaleX(i) + 5" 
                        dy="16" 
                        font-size="12"
                    >Value: {{ p.y }}</tspan>
                 </text>
            </g>
          </g>
          
          <!-- X labels -->
          <template v-if="effectiveShowXlabel">
             <text
               v-for="(p, i) in data.data"
               :key="`tx-${p.x}`"
               :x="scaleX(i)"
               :y="svgHeight - padding + 20"
               text-anchor="middle"
               class="text-xs text-center"
               :fill="useGradientForText ? 'url(#fgGrad)' : effectiveForegroundColor"
             >{{ p.x }}</text>
          </template>

          <!-- Y labels -->
          <template v-if="effectiveShowYlabel">
             <text
               v-for="y in yTicks"
               :key="`ty-${y}`"
               :x="padding - 10"
               :y="scaleY(y) + 4"
               text-anchor="end"
               class="text-xs text-right"
               :fill="useGradientForText ? 'url(#fgGrad)' : effectiveForegroundColor"
             >{{ y }}</text>
          </template>

        </svg>

         <!-- Legend -->
         <div 
            v-if="effectiveShowLegend"
            class="w-full flex flex-wrap justify-center gap-2 rounded-2xl shadow-2xl shadow-black px-4 py-4 mt-4"
            :style="{ backgroundColor: legendBoxBackgroundColor }"
         >
            <div v-for="p in data.data" :key="p.x" class="flex items-center gap-2">
                <div 
                    class="w-3.5 h-3.5 rounded-sm opacity-70"
                    :style="{ backgroundColor: getColor(p.y) }"
                />
                <span 
                    class="text-[12px] text-gray-700"
                    :style="titleTextStyle"
                >{{ p.x }}</span>
            </div>
         </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, h } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      title: "Sales",
      data: [
        { x: "January", y: 75 },
        { x: "February", y: 82 },
        { x: "March", y: 78 },
        { x: "April", y: 56 },
        { x: "May", y: 89 },
      ],
    }),
  },
  width: { type: [Number, String], default: 580 },
  height: { type: [Number, String], default: 500 },
  yMin: { type: Number, default: 56 },
  yMax: { type: Number, default: 89 },
  minWidth: String,
  maxWidth: String,
  minHeight: String,
  maxHeight: String,
  showLegend: { type: [Boolean, String], default: "true" },
  showTooltip: { type: [Boolean, String], default: "true" },
  xAxisGridLines: { type: [Boolean, String], default: "true" },
  yAxisGridLines: { type: [Boolean, String], default: "true" },
  xAxisLineWidth: String,
  yAxisLineWidth: String,
  gridLineXColor: { type: String, default: "#E0E0E0" },
  gridLineYColor: { type: String, default: "#E0E0E0" },
  showXlabel: { type: [Boolean, String], default: "true" },
  showYlabel: { type: [Boolean, String], default: "true" },
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
  bgUrl: String,
  backgroundImageFit: String,
  seoAlt: String,
  seoTitle: String,
  backgroundImageRepeat: String,
  useLinearGradientForeground: [Boolean, String],
  gradientColorsForeground: Array,
  gradientAngleForeground: Number,
  gradientStopsForeground: Array,
  useRadialGradientForeground: [Boolean, String],
  radialGradientColorsForeground: Array,
  radialGradientStopsForeground: Array,
  foreground: String,
  childAlign: String,
  legendBoxBackgroundColor: String,
  tailwaindClasses: String,
  
  // Column specific
  barSpacing: { type: Number, default: 25 },
  barRadius: { type: Number, default: 5 },
  animationDelay: { type: Number, default: 150 },
  animationDuration: { type: Number, default: 0.6 },
});

// Helper Functions
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

const parseRadialGradient = (gradientStr) => {
  if (!gradientStr || !gradientStr.startsWith("radial-gradient")) return null;
  const match = gradientStr.match(/^radial-gradient\s*\(\s*([^,]+)\s*,\s*(.+)\s*\)$/);
  if (!match) return null;
  const shapeStr = match[1].trim();
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
  return { shape: shapeStr, colorStops };
};

const parseSize = (size) => {
  if (typeof size === "number") return size;
  const match = size?.toString().match(/^([0-9.]+)(px|%|vw)?$/);
  if (!match) return 0;
  const num = parseFloat(match[1]);
  if (isNaN(num)) return 0;
  return num;
};

// State
const containerRef = ref(null);
const hoveredPoint = ref(null);
const isVisible = ref(false);
const animatedHeights = ref(Array(props.data.data.length).fill(0));

// Computed
const useTailwind = computed(() => !!props.tailwaindClasses);

const effectiveShowLegend = computed(() => props.showLegend === "true" || props.showLegend === true);
const effectiveShowTooltip = computed(() => props.showTooltip === "true" || props.showTooltip === true);
const effectiveShowXGrid = computed(() => props.xAxisGridLines === "true" || props.xAxisGridLines === true);
const effectiveShowYGrid = computed(() => props.yAxisGridLines === "true" || props.yAxisGridLines === true);
const effectiveShowXlabel = computed(() => props.showXlabel === "true" || props.showXlabel === true);
const effectiveShowYlabel = computed(() => props.showYlabel === "true" || props.showYlabel === true);
const effectiveUseLinearGradientForeground = computed(() => props.useLinearGradientForeground === "true" || props.useLinearGradientForeground === true);
const effectiveUseRadialGradientForeground = computed(() => props.useRadialGradientForeground === "true" || props.useRadialGradientForeground === true);

const effectiveForegroundColor = computed(() => props.foreground || "#374151");
const isForegroundGradient = computed(() => 
    typeof props.foreground === "string" && (props.foreground.startsWith("linear-gradient(") || props.foreground.startsWith("radial-gradient("))
);

const useGradientForText = computed(() => 
    effectiveUseLinearGradientForeground.value || effectiveUseRadialGradientForeground.value || isForegroundGradient.value
);

const getForegroundGradientCSS = () => {
    if (isForegroundGradient.value) return props.foreground;
    
    if (effectiveUseRadialGradientForeground.value && props.radialGradientColorsForeground?.length > 0) {
        const stops = props.radialGradientStopsForeground?.length === props.radialGradientColorsForeground.length
            ? props.radialGradientStopsForeground
            : Array.from({ length: props.radialGradientColorsForeground.length }, (_, i) => Math.round((i / (props.radialGradientColorsForeground.length - 1)) * 100));
        const colorStops = props.radialGradientColorsForeground.map((color, i) => `${color} ${stops[i]}%`).join(", ");
        return `radial-gradient(circle at center, ${colorStops})`;
    } else if (effectiveUseLinearGradientForeground.value && props.gradientColorsForeground?.length > 0) {
         const stops = props.gradientStopsForeground?.length === props.gradientColorsForeground.length
            ? props.gradientStopsForeground
            : Array.from({ length: props.gradientColorsForeground.length }, (_, i) => Math.round((i / (props.gradientColorsForeground.length - 1)) * 100));
         const colorStops = props.gradientColorsForeground.map((color, i) => `${color} ${stops[i]}%`).join(", ");
         return `linear-gradient(${props.gradientAngleForeground}deg, ${colorStops})`;
    }
    return null;
};

// Render component for dynamic gradient from string props
const foregroundGradientComponent = computed(() => {
    if (!isForegroundGradient.value) return null;
    const gradientStr = props.foreground;
    const parsed = gradientStr.startsWith("linear-gradient")
        ? parseLinearGradient(gradientStr)
        : parseRadialGradient(gradientStr);
        
    if (!parsed) return null;

    if (parsed.angle !== undefined) {
         // Linear
         return h('linearGradient', {
             id: 'fgGrad',
             x1: '0',
             y1: '0',
             x2: '1',
             y2: '0',
             gradientUnits: 'objectBoundingBox',
             gradientTransform: `rotate(${parsed.angle}, 0.5, 0.5)`
         }, parsed.colorStops.map((stop, i) => 
             h('stop', { key: i, offset: `${stop.offset}%`, stopColor: stop.color })
         ));
    } else {
         // Radial
         return h('radialGradient', {
             id: 'fgGrad',
             cx: '0.5',
             cy: '0.5',
             r: '0.5',
             gradientUnits: 'objectBoundingBox'
         }, parsed.colorStops.map((stop, i) => 
             h('stop', { key: i, offset: `${stop.offset}%`, stopColor: stop.color })
         ));
    }
});


const titleTextStyle = computed(() => {
    const gradientCSS = useGradientForText.value ? getForegroundGradientCSS() : null;
    return {
        color: useGradientForText.value ? "transparent" : effectiveForegroundColor.value,
        ...(useGradientForText.value && {
            backgroundImage: gradientCSS,
            WebkitBackgroundClip: "text",
            backgroundClip: "text"
        })
    };
});

// Layout Logic
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

const getBackgroundRepeat = (rep) => {
    const map = {
      none: "no-repeat",
      "repeat X": "repeat-x",
      "repeat Y": "repeat-y",
      repeat: "repeat",
    };
    return map[rep] || "no-repeat";
};

const effectiveBgColor = computed(() => props.bgColor || "#ffffff");
const isBgGradient = computed(() => effectiveBgColor.value.startsWith("linear-gradient(") || effectiveBgColor.value.startsWith("radial-gradient("));

const bgStyle = computed(() => {
   if (isBgGradient.value) {
       let bgImage = effectiveBgColor.value;
       if (props.bgUrl) {
           bgImage = `url(${props.bgUrl}), ${effectiveBgColor.value}`;
       }
       return {
           backgroundImage: bgImage,
           backgroundColor: "transparent",
           ...(props.bgUrl && {
               backgroundRepeat: getBackgroundRepeat(props.backgroundImageRepeat),
               backgroundSize: getBackgroundSize(props.backgroundImageFit),
               backgroundPosition: "center center",
           })
       };
   } else {
       const style = { backgroundColor: effectiveBgColor.value };
       if (props.bgUrl) {
           style.backgroundImage = `url(${props.bgUrl})`;
           style.backgroundRepeat = getBackgroundRepeat(props.backgroundImageRepeat),
           style.backgroundSize = getBackgroundSize(props.backgroundImageFit),
           style.backgroundPosition = "center center";
       }
       return style;
   }
});

const calculatedSpacing = computed(() => {
   const eBorderTop = useTailwind.value ? 0 : props.borderTop || props.borderAll || 0;
   const eBorderRight = useTailwind.value ? 0 : props.borderRight || props.borderAll || 0;
   const eBorderBottom = useTailwind.value ? 0 : props.borderBottom || props.borderAll || 0;
   const eBorderLeft = useTailwind.value ? 0 : props.borderLeft || props.borderAll || 0;

   let ePaddingTop = useTailwind.value ? 0 : props.paddingTop || props.paddingAll || 0;
   let ePaddingRight = useTailwind.value ? 0 : props.paddingRight || props.paddingAll || 0;
   let ePaddingBottom = useTailwind.value ? 0 : props.paddingBottom || props.paddingAll || 0;
   let ePaddingLeft = useTailwind.value ? 0 : props.paddingLeft || props.paddingAll || 0;
   
   ePaddingTop = Math.max(ePaddingTop, eBorderTop);
   ePaddingRight = Math.max(ePaddingRight, eBorderRight);
   ePaddingBottom = Math.max(ePaddingBottom, eBorderBottom);
   ePaddingLeft = Math.max(ePaddingLeft, eBorderLeft);

   return { 
       eBorderTop, eBorderRight, eBorderBottom, eBorderLeft, 
       ePaddingTop, ePaddingRight, ePaddingBottom, ePaddingLeft 
   };
});

const marginStyle = computed(() => {
    if (useTailwind.value) return {};
    const mT = props.marginTop || props.marginAll || 0;
    const mR = props.marginRight || props.marginAll || 0;
    const mB = props.marginBottom || props.marginAll || 0;
    const mL = props.marginLeft || props.marginAll || 0;
    return {
        marginTop: `${mT}px`,
        marginRight: `${mR}px`,
        marginBottom: `${mB}px`,
        marginLeft: `${mL}px`,
    };
});

// Dimensions
const padding = 60;
const totalWidth = computed(() => parseSize(props.width));
const totalHeight = computed(() => parseSize(props.height));

const svgDimensions = computed(() => {
    const { eBorderLeft, eBorderRight, eBorderTop, eBorderBottom, ePaddingLeft, ePaddingRight, ePaddingTop, ePaddingBottom } = calculatedSpacing.value;
    const totalBorderHorizontal = eBorderLeft + eBorderRight;
    const totalBorderVertical = eBorderTop + eBorderBottom;
    const totalPaddingHorizontal = ePaddingLeft + ePaddingRight;
    const totalPaddingVertical = ePaddingTop + ePaddingBottom;
    const titleSpace = 0;
    const legendSpace = effectiveShowLegend.value ? 80 : 0;
    
    const svgW = Math.max(0, totalWidth.value - totalBorderHorizontal - totalPaddingHorizontal);
    const contentH = Math.max(0, totalHeight.value - totalBorderVertical - totalPaddingVertical);
    const svgH = Math.max(0, contentH - titleSpace - legendSpace);
    
    return { width: svgW, height: svgH };
});

const svgWidth = computed(() => svgDimensions.value.width);
const svgHeight = computed(() => svgDimensions.value.height);

// Scaling
const scaleX = (i) =>
    ((i + 1) / (props.data.data.length + 1)) * (svgWidth.value - 2 * padding) + padding / 2;

const scaleY = (y) =>
    svgHeight.value -
    padding -
    ((y - props.yMin) / (props.yMax - props.yMin)) * (svgHeight.value - 2 * padding);

const yTicks = computed(() => {
    const numYTicks = 6;
    const yStep = (props.yMax - props.yMin) / (numYTicks - 1);
    return Array.from({ length: numYTicks }, (_, i) => Math.round(props.yMin + i * yStep));
});

const barWidth = computed(() => (svgWidth.value - 2 * padding) / props.data.data.length - props.barSpacing);

const fullHeights = computed(() => props.data.data.map((d) => svgHeight.value - padding - scaleY(d.y)));

const getColor = (value) => {
    const intensity = (value - props.yMin) / (props.yMax - props.yMin);
    const lightness = 92 - intensity * 25;
    return `hsl(210, 80%, ${lightness}%)`;
};

// Container Styles
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
           boxShadow: props.boxShadow || undefined,
           overflow: "hidden",
        }
    }

    const { eBorderTop, eBorderRight, eBorderBottom, eBorderLeft, ePaddingTop, ePaddingRight, ePaddingBottom, ePaddingLeft } = calculatedSpacing.value;

    return {
        width: typeof props.width === "string" ? props.width : `${totalWidth.value}px`,
        height: typeof props.height === "string" ? props.height : `${totalHeight.value}px`,
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
        borderStyle: props.borderStyle === "none" ? "none" : props.borderStyle,
        borderTopLeftRadius: `${props.borderRadiusTopLeft || props.borderRadiusAll || 0}px`,
        borderTopRightRadius: `${props.borderRadiusTopRight || props.borderRadiusAll || 0}px`,
        borderBottomRightRadius: `${props.borderRadiusBottomRight || props.borderRadiusAll || 0}px`,
        borderBottomLeftRadius: `${props.borderRadiusBottomLeft || props.borderRadiusAll || 0}px`,
        paddingTop: `${ePaddingTop}px`,
        paddingRight: `${ePaddingRight}px`,
        paddingBottom: `${ePaddingBottom}px`,
        paddingLeft: `${ePaddingLeft}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...bgStyle.value,
        position: "relative",
        boxShadow: props.boxShadow || undefined,
        overflow: "hidden",
    };
});

const outerItemsClass = computed(() => {
    switch (props.childAlign) {
      case "left": return "items-start";
      case "center": return "items-center";
      case "right": return "items-end";
      case "stretch": return "items-stretch";
      case "baseline": return "items-baseline";
      case "auto": default: return "items-center";
    }
});

const svgAttrs = computed(() => {
    if (useTailwind.value) {
        return { viewBox: `0 0 ${svgWidth.value} ${svgHeight.value}` };
    } else {
        return { width: svgWidth.value, height: svgHeight.value };
    }
});

const svgStyle = computed(() => useTailwind.value ? { width: "100%", height: "auto" } : {});
const svgClassName = "";

const transitionStyle = computed(() => 
    `y ${props.animationDuration}s cubic-bezier(0.68, -0.55, 0.265, 1.55), height ${props.animationDuration}s cubic-bezier(0.68, -0.55, 0.265, 1.55)`
);


// Animations & Interactions
const handleMouseEnter = (p) => { hoveredPoint.value = p; };
const handleMouseLeave = () => { hoveredPoint.value = null; };

onMounted(() => {
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

watch([isVisible, () => props.data], () => {
    if (isVisible.value) {
        props.data.data.forEach((_, i) => {
            setTimeout(() => {
                const newHeights = [...animatedHeights.value];
                newHeights[i] = fullHeights.value[i];
                animatedHeights.value = newHeights;
            }, i * props.animationDelay);
        });
    }
}, { immediate: true });

</script>
