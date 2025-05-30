import React from "react";
import { FileText, AlertTriangle } from "lucide-react";
import InfoCard from "./InfoCard";

const InfoCardsSection = () => {
  const infoCards = [
    {
      icon: FileText,
      title: "Comprehensive Reporting",
      description:
        "Submit detailed reports with categorization and priority levels for better tracking and resolution.",
    },
    {
      icon: AlertTriangle,
      title: "Issue Tracking",
      description:
        "All reports are tracked and monitored to ensure timely resolution and proper follow-up.",
    },
  ];

  return (
    <div className="w-full flex justify-start items-center gap-6 mb-12">
      {infoCards.map((card, index) => (
        <InfoCard
          key={index}
          icon={card.icon}
          title={card.title}
          description={card.description}
        />
      ))}
    </div>
  );
};

export default InfoCardsSection;
