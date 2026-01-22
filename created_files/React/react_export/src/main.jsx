import React from "react";
import ReactDOM from "react-dom/client";
import "./custom.css";
import "./assets/fonts/fonts.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ModalProvider } from "./qlib/qmodal/QModalProvider";  // <-- ADD THIS

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ModalProvider>     {/* <-- WRAP HERE */}
        <App />
      </ModalProvider>
    </BrowserRouter>
  </React.StrictMode>
);




// // src/main.jsx
// import React from "react";
// import ReactDOM from "react-dom/client";
// import "./custom.css";
// import "./assets/fonts/fonts.css"; // ✅ import your font CSS here
// import App from "./App";
// //import reportWebVitals from './reportWebVitals'; // Optional
// import { BrowserRouter } from "react-router-dom";
// import { Provider } from "react-redux";
// import { store } from "./store/store"; // Adjust if path is different
// import { ModalProvider } from "./qlib/qmodal/QModalProvider";  // <-- ADD THIS

// // Extract project ID from current URL path
// // For https://staging.cmsexport.react.redoq.host/3063/emails
// // This will extract "/3063" as basename
// function getProjectBasename() {
//   const pathSegments = window.location.pathname
//     .split("/")
//     .filter((segment) => segment !== "");

//   if (pathSegments.length > 0) {
//     // First segment should be the project ID (3063)
//     const projectId = pathSegments[0];
//     return `/${projectId}`;
//   }

//   return "/"; // fallback
// }

// const projectBasename = getProjectBasename();

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <ModalProvider> 
//     {/* <Provider store={store}> */}
//       <BrowserRouter basename={projectBasename}>
//         <App />
//       </BrowserRouter>
//     {/* </Provider> */}
//      </ModalProvider> 
//   </React.StrictMode>
// );
