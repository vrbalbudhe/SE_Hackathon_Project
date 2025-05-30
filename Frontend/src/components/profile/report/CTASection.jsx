import React from "react";
import { Edit3 } from "lucide-react";

const CTASection = ({ onOpenModal, onOpenEditor }) => {
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
        <div className="flex gap-3">
          <button
            onClick={onOpenModal}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-md hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
          >
            Generate Report
          </button>
          <button
            onClick={onOpenEditor}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1.5 rounded-md hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 font-semibold shadow-lg flex items-center justify-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Editor
          </button>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
