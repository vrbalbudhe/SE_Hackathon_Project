import React, { useState } from "react";
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
  Zap,
  Edit3,
  Factory
} from "lucide-react";

const ReportForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    description: "",
    priority: "medium",
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
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      techStack: formData.techStack.split(",").map((s) => s.trim()),
      modules: formData.modules.split(",").map((s) => s.trim()),
    };
    console.log("Report submitted:", dataToSubmit);
    alert("Report submitted successfully!");
    onClose();
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
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

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <User className="w-4 h-4" />
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Client Name
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Factory className="w-4 h-4" />
              Client Industry
            </label>
            <input
              type="text"
              name="clientIndustry"
              value={formData.clientIndustry}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Timeline Start
            </label>
            <input
              type="date"
              name="timelineStart"
              value={formData.timelineStart}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Timeline End
            </label>
            <input
              type="date"
              name="timelineEnd"
              value={formData.timelineEnd}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Budget
            </label>
            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Code className="w-4 h-4" />
              Tech Stack (comma-separated)
            </label>
            <textarea
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Modules (comma-separated)
            </label>
            <textarea
              name="modules"
              value={formData.modules}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Tone
            </label>
            <textarea
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Proposal Type
            </label>
            <textarea
              name="proposalType"
              value={formData.proposalType}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Custom Prompt
            </label>
            <textarea
              name="customPrompt"
              value={formData.customPrompt}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              LaTeX Content
            </label>
            <textarea
              name="latexContent"
              value={formData.latexContent}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Goals
            </label>
            <textarea
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Challenges
            </label>
            <textarea
              name="challenges"
              value={formData.challenges}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Send className="w-4 h-4" />
          Submit Report
        </button>
      </div>
    </div>
  );
};

export default ReportForm;