

import React, { useState, Children, isValidElement, cloneElement } from "react";

const QGallery = ({ children, column = 3, vSpace = "10px", hSpace = "10px", tailwaindClasses = "" }) => {
  const [showBackDrop, setShowBackDrop] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const childArray = Children.toArray(children);

  let backDrop = null;
  const imageItems = [];

  // Separate images and BackDrop
  childArray.forEach((child, index) => {
    if (!isValidElement(child)) return;

    if (
      child.type?.displayName === "QBackDrop" ||
      child.type?.name === "QBackDrop"
    ) {
      backDrop = child;
    } else {
      imageItems.push(child);
    }
  });

  const images = imageItems.map((child, index) => (
    <div
      key={`gallery-image-${index}`}
      onClick={() => {
        setActiveIndex(index);
        setShowBackDrop(true);
      }}
      style={{ cursor: "pointer",  marginBottom: hSpace }}
    >
      {child}
    </div>
  ));

  return (
    <>
      <div
        className={` ${tailwaindClasses}`}
         style={{ columnGap: hSpace, rowGap: vSpace, columnCount: column }}
      >
        {images}
      </div>

      {showBackDrop &&
        backDrop &&
        cloneElement(
          backDrop,
          { backDrop: backDrop,
            images: imageItems,
            index: activeIndex,
            setIndex: setActiveIndex,
            onClose: () => setShowBackDrop(false),
          },
          backDrop.props.children // preserve children (e.g., Carousel, Icon)
        )}
    </>
  );
};

QGallery.displayName = "QGallery";
export default QGallery;
