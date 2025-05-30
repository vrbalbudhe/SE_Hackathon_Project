import React, { useState, useRef, useEffect } from "react";
import { X, Save, FileText, Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

const EditorModal = ({ isOpen, onClose, onSubmit }) => {
  const defaultTitle = "Client Name: HealthBridge";
  const defaultContent = `
    <p><strong>Industry:</strong> Healthcare</p>
    <p><strong>Timeline:</strong> 6 months</p>
    <p><strong>Modules:</strong> Appointment Booking, Medical Records Access, Secure Messaging, Admin Dashboard</p>
    <p><strong>Technology Stack:</strong> React, Node.js, MongoDB, AWS</p>
  `;

  const [content, setContent] = useState(defaultContent);
  const [title, setTitle] = useState(defaultTitle);
  const editorRef = useRef(null);

  useEffect(() => {
    if (isOpen && editorRef.current) {
      // Focus the editor when modal opens
      editorRef.current.focus();
      // Set the default content if the editor is empty
      if (!editorRef.current.innerHTML) {
        editorRef.current.innerHTML = defaultContent;
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onSubmit({ title, content });
      setTitle("");
      setContent("");
      // Clear the editor
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
      onClose();
    } else {
      alert("Please enter both title and content");
    }
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    // Keep focus on editor after formatting
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Document Editor</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Editor Toolbar */}
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
              <button
                onClick={() => formatText("bold")}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Bold"
                type="button"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText("italic")}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Italic"
                type="button"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText("underline")}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Underline"
                type="button"
              >
                <Underline className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
              <button
                onClick={() => formatText("insertUnorderedList")}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Bullet List"
                type="button"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText("insertOrderedList")}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Numbered List"
                type="button"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => formatText("justifyLeft")}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Align Left"
                type="button"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText("justifyCenter")}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Align Center"
                type="button"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText("justifyRight")}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Align Right"
                type="button"
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <input
            type="text"
            placeholder="Enter document title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none mb-4 focus:ring-0"
          />
          
          <div className="relative">
            <div
              ref={editorRef}
              contentEditable
              className="min-h-[400px] w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onInput={handleContentChange}
              style={{ 
                lineHeight: "1.6",
                fontSize: "16px",
                fontFamily: "Arial, sans-serif",
                minHeight: "400px"
              }}
              data-placeholder="Start writing your document..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {content.length > 0 && (
                <span>Character count: {content.replace(/<[^>]*>/g, '').length}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Submit Document
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorModal; 