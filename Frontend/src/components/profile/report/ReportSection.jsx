import React, { useState } from "react";
import ReportForm from "./ReportForm";
import HeaderSection from "./HeaderSection";
import InfoCardsSection from "./InfoCardsSection";
import CTASection from "./CTASection";
import ModalForm from "./ModalForm";
import EditorModal from "./EditorModal";

const ReportSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  
  const handleOpenEditor = () => setIsEditorOpen(true);
  const handleCloseEditor = () => setIsEditorOpen(false);
  
  const handleEditorSubmit = (data) => {
    // Handle the submitted document data here
    console.log("Document submitted:", data);
    // You can send this data to your backend or process it as needed
    alert(`Document "${data.title}" submitted successfully!`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-start items-start bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <HeaderSection />
        <InfoCardsSection />
        <div className="w-full flex justify-start items-start">
          <CTASection 
            onOpenModal={handleOpenModal} 
            onOpenEditor={handleOpenEditor}
          />
        </div>
      </div>

      <ModalForm isOpen={isModalOpen} onClose={handleCloseModal}>
        <ReportForm onClose={handleCloseModal} />
      </ModalForm>
      
      <EditorModal 
        isOpen={isEditorOpen} 
        onClose={handleCloseEditor}
        onSubmit={handleEditorSubmit}
      />
    </div>
  );
};

export default ReportSection;
