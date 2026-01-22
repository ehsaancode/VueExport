import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { generateStyle } from "../../utils/helper";

const QVideo = ({
  videoUrl,
  controls = true,
  autoplay = true,
  loop = false,
  muted = true,
  poster = "",
  preload = "metadata",
  style = {},
  onPlay,
  onPause,
  onEnded,
  isAnimationP,
  animationType,
  animationDuration,
  animationDelay,
  // Style related
  width, height, paddingLeft, paddingTop, paddingRight, paddingBottom,
  marginLeft, marginTop, marginRight, marginBottom,
  positionedLeft, positionedTop, positionedRight, positionedBottom,
  color, bgColor, borderRadius, borderColor, borderWidth, bgUrl, isImageFill,
  borderTLR, borderTRR, borderBLR, borderBRR,
  borderTW, borderTC, borderBW, borderBC, borderLW, borderLC, borderRW, borderRC,
  shadowSpreadRadius, shadowBlurRadius, shadowOffsetX, shadowOffsetY, shadowColor,
  isAbsoluteValue, overflow, zIndex,
  fontSize, fontWeight, textAlign, fontFamily, fontStyle,
  imageFit, decoration, textDirection,
  mainAlignment, crossAlignment,
  tailwaindClasses, boxShadow, foreground,
}) => {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // IntersectionObserver to trigger animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.25 }
    );

    const current = videoRef.current;
    if (current) observer.observe(current);

    return () => current && observer.unobserve(current);
  }, []);

  // Animation trigger
  useEffect(() => {
    if (isVisible && isAnimationP === "true" && videoRef.current) {
      videoRef.current.style.animation = `${animationType} ${animationDuration}s ease ${animationDelay}s`;
    }
  }, [isVisible]);

  const containerStyle = {
    ...generateStyle({
      width, height,
      isAbsoluteValue,
      positionedLeft, positionedTop, positionedRight, positionedBottom,
      bgColor, bgUrl, isImageFill, color,
      borderRadius, borderColor, borderWidth,
      borderTLR, borderTRR, borderBLR, borderBRR,
      borderTW, borderTC, borderBW, borderBC,
      borderLW, borderLC, borderRW, borderRC,
      paddingLeft, paddingRight, paddingTop, paddingBottom,
      marginLeft, marginRight, marginTop, marginBottom,
      shadowOffsetX, shadowOffsetY, shadowBlurRadius, shadowSpreadRadius, shadowColor,
      overflow, mainAlignment, crossAlignment,
      zIndex, fontSize, fontWeight, textAlign, fontFamily, fontStyle,
      imageFit, decoration, boxShadow
    }),
    ...(foreground && {
      background: foreground,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }),
    ...style
  };

  const getVideoContent = () => {
    if (!videoUrl) return null;

    // YouTube and YouTube Shorts
    const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const ytMatch = videoUrl.match(ytRegExp);
    if (ytMatch && ytMatch[2].length === 11) {
      const youtubeId = ytMatch[2];
      return (
        <iframe
          ref={videoRef}
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&controls=${controls ? 1 : 0}&loop=${loop ? 1 : 0}${loop ? `&playlist=${youtubeId}` : ''}`}
          className={tailwaindClasses}
          style={containerStyle}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    // Instagram Reels and Posts
    const instaRegExp = /(?:instagram\.com\/(?:reel|p)\/)([^/?#&]+)/;
    const instaMatch = videoUrl.match(instaRegExp);
    if (instaMatch) {
      const instaId = instaMatch[1];
      return (
        <iframe
          ref={videoRef}
          src={`https://www.instagram.com/reel/${instaId}/embed/`}
          className={tailwaindClasses}
          style={containerStyle}
          title="Instagram video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    // Vimeo
    const vimeoRegExp = /^(http|https)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;
    const vimeoMatch = videoUrl.match(vimeoRegExp);
    if (vimeoMatch) {
      const vimeoId = vimeoMatch[4];
      return (
        <iframe
          ref={videoRef}
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=${autoplay ? 1 : 0}&muted=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&controls=${controls ? 1 : 0}`}
          className={tailwaindClasses}
          style={containerStyle}
          title="Vimeo video player"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    }

  //direct video
const videoExtRegExp = /\.(mp4|webm|ogg|mov|m4v)($|\?)/i;
if (videoExtRegExp.test(videoUrl)) {
  return (
    <video
      ref={videoRef}
      src={videoUrl}
      className={tailwaindClasses}
      controls={controls}
      autoPlay={autoplay}
      loop={loop}
      muted={muted}
      poster={poster}
      preload={preload}
      style={containerStyle}
      onPlay={onPlay}
      onPause={onPause}
      onEnded={onEnded}
    />
  );
};

// Default Fallback (Generic Iframe)
    return (
      <iframe
        ref={videoRef}
        src={videoUrl}
        className={tailwaindClasses}
        style={containerStyle}
        title="Video embed"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
}
return getVideoContent();
};

QVideo.displayName = "QVideo";

export default QVideo;
