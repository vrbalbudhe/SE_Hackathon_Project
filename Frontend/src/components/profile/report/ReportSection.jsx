import React, { useState } from "react";
import ReportForm from "./ReportForm";
import HeaderSection from "./HeaderSection";
import InfoCardsSection from "./InfoCardsSection";
import CTASection from "./CTASection";
import ModalForm from "./ModalForm";

const ReportSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen w-full flex flex-col justify-start items-start bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <HeaderSection />
        <InfoCardsSection />
        <div className="w-full flex justify-start items-start">
          <CTASection onOpenModal={handleOpenModal} />
        </div>
      </div>

      <ModalForm isOpen={isModalOpen} onClose={handleCloseModal}>
        <ReportForm onClose={handleCloseModal} />
      </ModalForm>
    </div>
  );
};

export default ReportSection;
