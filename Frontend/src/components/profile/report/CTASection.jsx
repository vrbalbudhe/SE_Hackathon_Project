import React from "react";

const CTASection = ({ onOpenModal }) => {
  return (
    <div className="text-left">
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 max-w-md mx-auto">
        <h2 className="text-md font-semibold text-gray-800 mb-4">
          Ready to Submit a Report?
        </h2>
        <p className="text-gray-600 text-sm mb-3">
          Click the button below to open the report form and provide us with the
          details we need.
        </p>
        <button
          onClick={onOpenModal}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-md hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default CTASection;
