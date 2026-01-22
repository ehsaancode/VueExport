// import React from "react";
// import { useModal } from "./QModalProvider";

// const QModalContainer = ({ name, children, maxWidth = "97%", maxHeight = "500px" }) => {
//   const { topModal, closeModal } = useModal();
//   const isOpen = topModal === name;  // <-- UPDATED

//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 flex justify-center items-center z-[9999]"
//       style={{
//         backgroundColor: "rgba(0, 0, 0, 0.5)",
//         pointerEvents: "auto",
//       }}
//     >
//       <div
//         className="bg-white rounded-2xl shadow-lg relative"
//         style={{
//           maxWidth,
//           maxHeight,
//           overflowY: "auto",
//           overflowX: "auto",
//         }}
//       >
//         <button
//           onClick={closeModal}
//           className="cursor-pointer absolute top-2 right-3 text-gray-600 hover:text-black text-xl z-99"
//         >
//           ✕
//         </button>

//         {children}
//       </div>
//     </div>
//   );
// };

// export default QModalContainer;
// QModalContainer.displayName = "QModalContainer";



import React, { useEffect, useState } from "react";
import { useModal } from "./QModalProvider";

const QModalContainer = ({ name, children, maxWidth = "97%", maxHeight = "500px" }) => {
  const { topModal, closeModal } = useModal();
  const isOpen = topModal === name;

  // Smooth animation control
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimate(true), 10); // start animation
    } else {
      setAnimate(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center z-[9999]
        transition-opacity duration-300 ease-out
        ${animate ? "opacity-100" : "opacity-0"}
      `}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        pointerEvents: "auto",
      }}
    >
      <div
        className={`
          bg-white rounded-2xl shadow-lg relative transform transition-all duration-300 ease-out
          ${animate ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}
        `}
        style={{
          maxWidth,
          maxHeight,
          overflowY: "auto",
          overflowX: "hidden",       // 🚫 FIX horizontal scroll
        }}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="cursor-pointer absolute top-3 right-3 text-gray-700 hover:text-black text-2xl font-bold z-[10000]"
          style={{ lineHeight: "20px" }}
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
};

export default QModalContainer;
QModalContainer.displayName = "QModalContainer";
