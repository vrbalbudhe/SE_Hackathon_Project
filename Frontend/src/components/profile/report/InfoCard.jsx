import React from "react";

const InfoCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-xl max-w-md p-10 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-4">
      <div className="bg-blue-50 p-3 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

export default InfoCard;
