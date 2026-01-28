<template>
  <iframe
    v-if="youtubeId"
    :ref="videoRef"
    :src="`https://www.youtube.com/embed/${youtubeId}?autoplay=${props.autoplay ? 1 : 0}&mute=${props.muted ? 1 : 0}&controls=${props.controls ? 1 : 0}&loop=${props.loop ? 1 : 0}${props.loop ? `&playlist=${youtubeId}` : ''}`"
    :class="props.tailwaindClasses"
    :style="containerStyle"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  />
  <iframe
    v-else-if="instaId"
    :ref="videoRef"
    :src="`https://www.instagram.com/reel/${instaId}/embed/`"
    :class="props.tailwaindClasses"
    :style="containerStyle"
    title="Instagram video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  />
  <iframe
    v-else-if="vimeoId"
    :ref="videoRef"
    :src="`https://player.vimeo.com/video/${vimeoId}?autoplay=${props.autoplay ? 1 : 0}&muted=${props.muted ? 1 : 0}&loop=${props.loop ? 1 : 0}&controls=${props.controls ? 1 : 0}`"
    :class="props.tailwaindClasses"
    :style="containerStyle"
    title="Vimeo video player"
    frameborder="0"
    allow="autoplay; fullscreen; picture-in-picture"
    allowfullscreen
  />
  <video
    v-else-if="isDirectVideo"
    :ref="videoRef"
    :src="props.videoUrl"
    :class="props.tailwaindClasses"
    :controls="props.controls"
    :autoplay="props.autoplay"
    :loop="props.loop"
    :muted="props.muted"
    :poster="props.poster"
    :preload="props.preload"
    :style="containerStyle"
    @play="props.onPlay"
    @pause="props.onPause"
    @ended="props.onEnded"
  />
  <iframe
    v-else-if="props.videoUrl"
    :ref="videoRef"
    :src="props.videoUrl"
    :class="props.tailwaindClasses"
    :style="containerStyle"
    title="Video embed"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { generateStyle } from "../../utils/helper";

const props = defineProps({
  videoUrl: String,
  controls: { type: Boolean, default: true },
  autoplay: { type: Boolean, default: true },
  loop: { type: Boolean, default: false },
  muted: { type: Boolean, default: true },
  poster: { type: String, default: "" },
  preload: { type: String, default: "metadata" },
  style: { type: Object, default: () => ({}) },
  onPlay: Function,
  onPause: Function,
  onEnded: Function,
  isAnimationP: String,
  animationType: String,
  animationDuration: String,
  animationDelay: String,
  // Style related
  width: [String, Number],
  height: [String, Number],
  paddingLeft: String,
  paddingTop: String,
  paddingRight: String,
  paddingBottom: String,
  marginLeft: String,
  marginTop: String,
  marginRight: String,
  marginBottom: String,
  positionedLeft: String,
  positionedTop: String,
  positionedRight: String,
  positionedBottom: String,
  color: String,
  bgColor: String,
  borderRadius: [String, Number],
  borderColor: String,
  borderWidth: [String, Number],
  bgUrl: String,
  isImageFill: [Boolean, String],
  borderTLR: [String, Number],
  borderTRR: [String, Number],
  borderBLR: [String, Number],
  borderBRR: [String, Number],
  borderTW: [String, Number],
  borderTC: String,
  borderBW: [String, Number],
  borderBC: String,
  borderLW: [String, Number],
  borderLC: String,
  borderRW: [String, Number],
  borderRC: String,
  shadowSpreadRadius: [String, Number],
  shadowBlurRadius: [String, Number],
  shadowOffsetX: [String, Number],
  shadowOffsetY: [String, Number],
  shadowColor: String,
  isAbsoluteValue: [Boolean, String],
  overflow: String,
  zIndex: [String, Number],
  fontSize: [String, Number],
  fontWeight: [String, Number],
  textAlign: String,
  fontFamily: String,
  fontStyle: String,
  imageFit: String,
  decoration: String,
  textDirection: String,
  mainAlignment: String,
  crossAlignment: String,
  tailwaindClasses: String,
  boxShadow: String,
  foreground: String,
});

const videoRef = ref(null);
const isVisible = ref(false);

const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
const youtubeMatch = computed(() => props.videoUrl ? props.videoUrl.match(ytRegExp) : null);
const youtubeId = computed(() => youtubeMatch.value && youtubeMatch.value[2].length === 11 ? youtubeMatch.value[2] : null);

const instaRegExp = /(?:instagram\.com\/(?:reel|p)\/)([^/?#&]+)/;
const instaMatch = computed(() => props.videoUrl ? props.videoUrl.match(instaRegExp) : null);
const instaId = computed(() => instaMatch.value ? instaMatch.value[1] : null);

const vimeoRegExp = /^(http|https)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;
const vimeoMatch = computed(() => props.videoUrl ? props.videoUrl.match(vimeoRegExp) : null);
const vimeoId = computed(() => vimeoMatch.value ? vimeoMatch.value[4] : null);

const videoExtRegExp = /\.(mp4|webm|ogg|mov|m4v)($|\?)/i;
const isDirectVideo = computed(() => props.videoUrl ? videoExtRegExp.test(props.videoUrl) : false);

const containerStyle = computed(() => ({
  ...generateStyle({
    width: props.width,
    height: props.height,
    isAbsoluteValue: props.isAbsoluteValue,
    positionedLeft: props.positionedLeft,
    positionedTop: props.positionedTop,
    positionedRight: props.positionedRight,
    positionedBottom: props.positionedBottom,
    bgColor: props.bgColor,
    bgUrl: props.bgUrl,
    isImageFill: props.isImageFill,
    color: props.color,
    borderRadius: props.borderRadius,
    borderColor: props.borderColor,
    borderWidth: props.borderWidth,
    borderTLR: props.borderTLR,
    borderTRR: props.borderTRR,
    borderBLR: props.borderBLR,
    borderBRR: props.borderBRR,
    borderTW: props.borderTW,
    borderTC: props.borderTC,
    borderBW: props.borderBW,
    borderBC: props.borderBC,
    borderLW: props.borderLW,
    borderLC: props.borderLC,
    borderRW: props.borderRW,
    borderRC: props.borderRC,
    paddingLeft: props.paddingLeft,
    paddingRight: props.paddingRight,
    paddingTop: props.paddingTop,
    paddingBottom: props.paddingBottom,
    marginLeft: props.marginLeft,
    marginRight: props.marginRight,
    marginTop: props.marginTop,
    marginBottom: props.marginBottom,
    shadowOffsetX: props.shadowOffsetX,
    shadowOffsetY: props.shadowOffsetY,
    shadowBlurRadius: props.shadowBlurRadius,
    shadowSpreadRadius: props.shadowSpreadRadius,
    shadowColor: props.shadowColor,
    overflow: props.overflow,
    mainAlignment: props.mainAlignment,
    crossAlignment: props.crossAlignment,
    zIndex: props.zIndex,
    fontSize: props.fontSize,
    fontWeight: props.fontWeight,
    textAlign: props.textAlign,
    fontFamily: props.fontFamily,
    fontStyle: props.fontStyle,
    imageFit: props.imageFit,
    decoration: props.decoration,
    boxShadow: props.boxShadow,
  }),
  ...(props.foreground ? {
    background: props.foreground,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  } : {}),
  ...props.style,
}));

let observer = null;
onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
      }
    },
    { threshold: 0.25 }
  );

  if (videoRef.value) {
    observer.observe(videoRef.value);
  }
});

onUnmounted(() => {
  if (observer && videoRef.value) {
    observer.unobserve(videoRef.value);
  }
});

watch(isVisible, (newVal) => {
  if (newVal && props.isAnimationP === "true" && videoRef.value) {
    videoRef.value.style.animation = `${props.animationType} ${props.animationDuration}s ease ${props.animationDelay}s`;
  }
});
</script>