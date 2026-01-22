import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalStack, setModalStack] = useState([]); // <-- STACK

  const openModal = (name) => {
    setModalStack((prev) => [...prev, name]); // push modal
  };

  const closeModal = () => {
    setModalStack((prev) => prev.slice(0, -1)); // pop modal
  };

  const topModal = modalStack[modalStack.length - 1]; // only top modal is active

  return (
    <ModalContext.Provider
      value={{ modalStack, topModal, openModal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
