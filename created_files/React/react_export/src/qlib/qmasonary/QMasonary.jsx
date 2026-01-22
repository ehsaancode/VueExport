

// import React, { useState, Children, isValidElement, cloneElement } from "react";

// const QMasonary = ({ children, column = 3, vSpace = "10px", hSpace = "10px", tailwaindClasses = "" }) => {
//   const [showBackDrop, setShowBackDrop] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(0);

//   const childArray = Children.toArray(children);

//   let backDrop = null;
//   const imageItems = [];
//   const temImageArray = [];


//   // Separate images and BackDrop
//   childArray.forEach((child, index) => {
//     if (!isValidElement(child)) return;

//     if (
//       child.type?.displayName === "BackDrop" ||
//       child.type?.name === "BackDrop"
//     ) {
//       backDrop = child;
//     } else {
//       imageItems.push(child);
//     }
//   });

//     for (let i=1; i<=column; i++)
//    {
//       for( let j=1; j<=imageItems.length; j++)
//       {
//           if((j-i)%column==0)
//           {
//             temImageArray.push(imageItems[j-1]);
//           }
//       }
//    }

//   const images = temImageArray.map((child, index) => (
//     <div
//       key={`gallery-image-${index}`}
//       onClick={() => {
//         setActiveIndex(index);
//         setShowBackDrop(true);
//       }}
//      style={{
//         cursor: "pointer",
//        // breakInside: "avoid",
//         marginBottom: hSpace
//        // padding: "0 5px"
//       }}
//     >
//       {child}
//     </div>
//   ));

//   return (
//     <>
//       <div
//         className={` ${tailwaindClasses}`}
//          style={{  columnCount: column, columnGap: hSpace }}
//       >
//         {images}
//       </div>

//       {showBackDrop &&
//         backDrop &&
//         cloneElement(
//           backDrop,
//           { backDrop: backDrop,
//             images: temImageArray,
//             index: activeIndex,
//             setIndex: setActiveIndex,
//             onClose: () => setShowBackDrop(false),
//           },
//           backDrop.props.children // preserve children (e.g., Carousel, Icon)
//         )}
//     </>
//   );
// };

// QMasonary.displayName = "QMasonary";
// export default QMasonary;






import React, { useState, Children, isValidElement, cloneElement } from "react";

const QMasonary = ({ children, column = 3, vSpace = "10px", hSpace = "10px", tailwaindClasses = "" }) => {
  const [showBackDrop, setShowBackDrop] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const childArray = Children.toArray(children);

  let backDrop = null;
  const imageItems = [];
  const temImageArray = [];

  // Separate images and BackDrop
  childArray.forEach((child) => {
    if (!isValidElement(child)) return;

    const typeName = child.type?.displayName || child.type?.name;

    if (typeName === "QBackDrop") {
      backDrop = child;          // Correct match
    } else {
      imageItems.push(child);
    }
  });

  // Arrange images column-wise
  for (let i = 1; i <= column; i++) {
    for (let j = 1; j <= imageItems.length; j++) {
      if ((j - i) % column === 0) {
        temImageArray.push(imageItems[j - 1]);
      }
    }
  }

  const images = temImageArray.map((child, index) => (
    <div
      key={`gallery-image-${index}`}
      onClick={() => {
        setActiveIndex(index);
        setShowBackDrop(true);
      }}
      style={{
       // cursor: "pointer",
        marginBottom: hSpace,
      }}
    >
      {child}
    </div>
  ));

  return (
    <>
      <div
        className={`${tailwaindClasses}`}
        style={{ columnCount: column, columnGap: hSpace }}
      >
        {images}
      </div>

      {/* Show BackDrop only on click */}
      {showBackDrop &&
        backDrop &&
        cloneElement(
          backDrop,
          {
            backDrop: backDrop,
            images: temImageArray,
            index: activeIndex,
            setIndex: setActiveIndex,
            onClose: () => setShowBackDrop(false),
          },
          backDrop.props.children
        )}
    </>
  );
};

QMasonary.displayName = "QMasonary";
export default QMasonary;


