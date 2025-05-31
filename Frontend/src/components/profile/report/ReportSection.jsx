import React, { useState } from "react";
import axios from "axios";
import ReportForm from "./ReportForm";
import HeaderSection from "./HeaderSection";
import InfoCardsSection from "./InfoCardsSection";
import CTASection from "./CTASection";
import ModalForm from "./ModalForm";
import EditorModal from "./EditorModal";
import ProposalDisplay from "./ProposalDisplay";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ReportSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  
  const handleOpenEditor = () => setIsEditorOpen(true);
  const handleCloseEditor = () => setIsEditorOpen(false);
  
  const handleCloseProposal = () => {
    setIsProposalOpen(false);
    setGeneratedProposal(null);
  };
  
  const handleEditorSubmit = async (data) => {
    setIsGenerating(true);
    try {
      // Call the backend API to generate proposal
      const response = await axios.post(
        "http://localhost:8000/api/proposal/generate",
        {
          title: data.title,
          content: data.content
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        setGeneratedProposal(response.data.proposal);
        setIsProposalOpen(true);
        setIsEditorOpen(false);
      } else {
        alert("Failed to generate proposal. Please try again.");
      }
    } catch (error) {
      console.error("Error generating proposal:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      let errorMessage = "Error generating proposal. ";
      if (error.response?.status === 404) {
        errorMessage += "API endpoint not found. Please check if backend is running.";
      } else if (error.response?.status === 500) {
        errorMessage += error.response?.data?.message || "Server error occurred.";
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage += "Network error. Please check if the backend server is running on port 8000.";
      } else {
        errorMessage += error.response?.data?.message || error.message || "Please check your connection and try again.";
      }
      
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
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
      
      <ProposalDisplay
        isOpen={isProposalOpen}
        onClose={handleCloseProposal}
        proposal={generatedProposal}
      />

      {/* Loading overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center">
            <AiOutlineLoading3Quarters className="animate-spin text-blue-600 text-5xl mb-4" />
            <p className="text-lg font-medium text-gray-700">Generating your proposal...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportSection;
