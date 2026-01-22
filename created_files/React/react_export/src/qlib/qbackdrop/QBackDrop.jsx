// import React, { Children, cloneElement, isValidElement } from "react";

// const QBackDrop = ({ images, index, setIndex, onClose, children, tailwaindClasses = "" }) => {
//   const childArray = Children.toArray(children);

//   let carousel = null;
//   let closeIcon = null;
//   let nextIcon = null;
//   let prevIcon = null;

//   childArray.forEach((child) => {
//     if (!isValidElement(child)) return;

//     const typeName = child.type?.displayName || child.type?.name;
//     const widgetType = child.props?.clickableWidget;

//     if (typeName === "Carousel") {
//       carousel = child;
//     } else if (typeName === "Icon" && widgetType === "close_icon") {
//       closeIcon = cloneElement(child, {
//         onClick: onClose,
//       });
//     } else if (typeName === "Icon" && widgetType === "right_icon") {
//       nextIcon = cloneElement(child, {
//         onClick: () => setIndex((index + 1) % images.length),
//       });
//     } else if (typeName === "Icon" && widgetType === "left_icon") {
//       prevIcon = cloneElement(child, {
//         onClick: () => setIndex((index - 1 + images.length) % images.length),
//       });
//     }
//   });

//   return (
//     <div
//     style={{ position: "fixed"}}
//       className={`fixed inset-0 bg-black/80 z-[9999] flex justify-center items-center ${tailwaindClasses} w-full`}
//     >
//       <div className="relative w-full flex items-center justify-center">
//         {/* Close Button - top right */}
//         <div className="absolute top-4 right-4 z-10 cursor-pointer">{closeIcon}</div>

//         {/* Prev Button - center left */}
//         <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer">{prevIcon}</div>

//         {/* Next Button - center right */}
//         <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer">{nextIcon}</div>

//         {/* Carousel with current image */}
//         {carousel &&
//           cloneElement(carousel, {
//             children: [images[index]], // Render only current image
//           })}
//       </div>
//     </div>
//   );
// };

// QBackDrop.displayName = "QBackDrop";
// export default QBackDrop;



import React, { Children, cloneElement, isValidElement } from "react";

const QBackDrop = ({ images, index, setIndex, onClose, children, tailwaindClasses = "" }) => {
  const childArray = Children.toArray(children);

  let carousel = null;
  let closeIcon = null;
  let nextIcon = null;
  let prevIcon = null;

  childArray.forEach((child) => {
    if (!isValidElement(child)) return;

    const typeName = child.type?.displayName || child.type?.name;
    const widgetType = child.props?.clickableWidget;

    if (typeName === "QCarousel") {
      carousel = child;
    } 
    else if (typeName === "QIcon" && widgetType === "close_icon") {
      closeIcon = cloneElement(child, {
        onClick: onClose,
      });
    } 
    else if (typeName === "QIcon" && widgetType === "right_icon") {
      nextIcon = cloneElement(child, {
        onClick: () => setIndex((index + 1) % images.length),
      });
    } 
    else if (typeName === "QIcon" && widgetType === "left_icon") {
      prevIcon = cloneElement(child, {
        onClick: () => setIndex((index - 1 + images.length) % images.length),
      });
    }
  });

  return (
    <div
      style={{ position: "fixed" }}
      className={`fixed inset-0 bg-black/80 z-[9999] flex justify-center items-center ${tailwaindClasses} w-full`}
    >
      <div className="relative w-full flex items-center justify-center">
        
        {/* Close Icon */}
        <div className="absolute top-4 right-4 z-10 cursor-pointer">{closeIcon}</div>

        {/* Prev Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer">{prevIcon}</div>

        {/* Next Icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer">{nextIcon}</div>

        {/* Carousel */}
        {carousel &&
          cloneElement(carousel, {
            children: [images[index]],
          })}
      </div>
    </div>
  );
};

QBackDrop.displayName = "QBackDrop";
export default QBackDrop;
