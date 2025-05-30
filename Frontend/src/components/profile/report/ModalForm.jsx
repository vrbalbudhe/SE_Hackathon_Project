import React from "react";

const ModalForm = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 transform transition-all">
        {children}
      </div>
    </div>
  );
};

export default ModalForm;
