import React, { useState, useContext } from "react";
import {
  X,
  Send,
  User,
  Building2,
  Calendar,
  DollarSign,
  Code,
  Package,
  Target,
  AlertTriangle,
  MessageSquare,
  FileText,
  Factory,
} from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProposalDisplay from "./ProposalDisplay";
import { AuthContext } from "../../../contexts/AuthContext";

const ReportForm = ({ onClose }) => {
  const { id: userId } = useParams();
  const { currentUser } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: "",
    clientName: "",
    clientIndustry: "",
    timelineStart: "",
    timelineEnd: "",
    techStack: "",
    modules: "",
    goals: "",
    challenges: "",
    tone: "",
    proposalType: "",
    customPrompt: "",
    latexContent: "",
    budget: "",
    userId: userId,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState(null);
  const [isProposalOpen, setIsProposalOpen] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields based on Prisma schema
    if (!formData.name.trim()) newErrors.name = "Project name is required";
    if (!formData.clientName.trim()) newErrors.clientName = "Client name is required";
    if (!formData.clientIndustry.trim()) newErrors.clientIndustry = "Client industry is required";
    if (!formData.timelineStart) newErrors.timelineStart = "Start date is required";
    if (!formData.timelineEnd) newErrors.timelineEnd = "End date is required";
    if (!formData.techStack.trim()) newErrors.techStack = "Tech stack is required";
    if (!formData.modules.trim()) newErrors.modules = "Modules are required";
    if (!formData.goals.trim()) newErrors.goals = "Goals are required";
    if (!formData.tone.trim()) newErrors.tone = "Tone is required";

    // Timeline validation
    if (formData.timelineStart && formData.timelineEnd) {
      const start = new Date(formData.timelineStart);
      const end = new Date(formData.timelineEnd);
      if (end <= start) {
        newErrors.timelineEnd = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setIsGenerating(true);
      
      if (!validateForm()) {
        setIsSubmitting(false);
        setIsGenerating(false);
        return;
      }

      if (!currentUser) {
        setErrors({
          submit: "You must be logged in to generate a proposal. Please log in and try again."
        });
        setIsSubmitting(false);
        setIsGenerating(false);
        return;
      }

      // First, generate the proposal using the AI
      const proposalResponse = await axios.post(
        "http://localhost:8000/api/proposal/generate",
        {
          title: formData.name,
          content: `
Project Overview:
Client: ${formData.clientName}
Industry: ${formData.clientIndustry}
Timeline: ${formData.timelineStart} to ${formData.timelineEnd}
Budget: ${formData.budget || 'Not specified'}

Technical Stack:
${formData.techStack.split(',').map(tech => `• ${tech.trim()}`).join('\n')}

Project Modules:
${formData.modules.split(',').map(module => `• ${module.trim()}`).join('\n')}

Project Goals:
${formData.goals}

${formData.challenges ? `Challenges:\n${formData.challenges}` : ''}

Communication Tone:
${formData.tone}

Additional Information:
${formData.proposalType ? `Proposal Type: ${formData.proposalType}` : ''}
User: ${currentUser.email}
          `,
          userEmail: currentUser.email
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      if (!proposalResponse.data.success) {
        throw new Error(proposalResponse.data.message || "Failed to generate proposal");
      }

      // Store the generated proposal
      const generatedContent = proposalResponse.data.proposal;
      setGeneratedProposal(generatedContent);
      setIsProposalOpen(true);

      // Now create the project in the database
      const payload = {
        ...formData,
        timelineStart: new Date(formData.timelineStart),
        timelineEnd: new Date(formData.timelineEnd),
        techStack: formData.techStack.split(",").map((s) => s.trim()),
        modules: formData.modules.split(",").map((s) => s.trim()),
        goals: formData.goals,
        challenges: formData.challenges || null,
        proposalType: formData.proposalType || null,
        customPrompt: formData.customPrompt || null,
        latexContent: JSON.stringify(generatedContent),
        budget: formData.budget || null,
        userId: currentUser.id,
        userEmail: currentUser.email
      };

      const projectResponse = await axios.post(
        "http://localhost:8000/api/project/add",
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      if (!projectResponse.data.success) {
        throw new Error(projectResponse.data.message || "Failed to save project");
      }

    } catch (err) {
      console.error("Project submission error:", err);
      setErrors({
        submit: err.response?.data?.message || "Error submitting the project. Please check all required fields."
      });
      setIsProposalOpen(false);
    } finally {
      setIsSubmitting(false);
      setIsGenerating(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleCloseProposal = () => {
    setIsProposalOpen(false);
    setGeneratedProposal(null);
    onClose();
  };

  return (
    <>
      <div className="p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Submit Report</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {errors.submit}
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <User className="w-4 h-4" />
                Project Name*
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Client Name*
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg ${
                  errors.clientName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.clientName && <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Factory className="w-4 h-4" />
                Client Industry*
              </label>
              <input
                type="text"
                name="clientIndustry"
                value={formData.clientIndustry}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg ${
                  errors.clientIndustry ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.clientIndustry && <p className="mt-1 text-sm text-red-600">{errors.clientIndustry}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Timeline Start*
              </label>
              <input
                type="date"
                name="timelineStart"
                value={formData.timelineStart}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg ${
                  errors.timelineStart ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.timelineStart && <p className="mt-1 text-sm text-red-600">{errors.timelineStart}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Timeline End*
              </label>
              <input
                type="date"
                name="timelineEnd"
                value={formData.timelineEnd}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg ${
                  errors.timelineEnd ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.timelineEnd && <p className="mt-1 text-sm text-red-600">{errors.timelineEnd}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Budget
              </label>
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Code className="w-4 h-4" />
                Tech Stack* (comma-separated)
              </label>
              <textarea
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                rows={3}
                className={`w-full p-3 border rounded-lg resize-none ${
                  errors.techStack ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.techStack && <p className="mt-1 text-sm text-red-600">{errors.techStack}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Modules* (comma-separated)
              </label>
              <textarea
                name="modules"
                value={formData.modules}
                onChange={handleChange}
                rows={3}
                className={`w-full p-3 border rounded-lg resize-none ${
                  errors.modules ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.modules && <p className="mt-1 text-sm text-red-600">{errors.modules}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Goals*
              </label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                rows={3}
                className={`w-full p-3 border rounded-lg resize-none ${
                  errors.goals ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.goals && <p className="mt-1 text-sm text-red-600">{errors.goals}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Challenges
              </label>
              <textarea
                name="challenges"
                value={formData.challenges}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Tone*
              </label>
              <textarea
                name="tone"
                value={formData.tone}
                onChange={handleChange}
                rows={3}
                className={`w-full p-3 border rounded-lg resize-none ${
                  errors.tone ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.tone && <p className="mt-1 text-sm text-red-600">{errors.tone}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Proposal Type
              </label>
              <textarea
                name="proposalType"
                value={formData.proposalType}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isGenerating}
              className={`px-4 py-2 text-white rounded-lg flex items-center gap-2 ${
                isSubmitting || isGenerating
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Send className="w-4 h-4" />
              {isGenerating ? 'Generating...' : isSubmitting ? 'Submitting...' : 'Generate Proposal'}
            </button>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-lg font-medium text-gray-700 mt-4">Generating your proposal...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
          </div>
        </div>
      )}

      {/* Proposal Display Modal */}
      <ProposalDisplay
        isOpen={isProposalOpen}
        onClose={handleCloseProposal}
        proposal={generatedProposal}
      />
    </>
  );
};

export default ReportForm;