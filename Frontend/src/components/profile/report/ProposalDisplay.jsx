import React, { useRef } from "react";
import { 
  X, 
  Download, 
  FileText, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  Users, 
  Target,
  CheckCircle,
  Clock,
  ArrowRight,
  FilePlus
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

const ProposalDisplay = ({ isOpen, onClose, proposal }) => {
  const contentRef = useRef(null);
  
  if (!isOpen || !proposal) return null;

  // Parse the proposal content to get sections
  const parseProposalSections = () => {
    // If the proposal is already structured
    if (proposal.executiveSummary || proposal.clientInformation) {
      return proposal;
    }
    
    // If it's in the content field, try to parse it
    if (proposal.content && typeof proposal.content === 'string') {
      try {
        // Try to extract sections from the content
        const sections = {};
        const content = proposal.content;
        
        // Common section patterns
        const sectionPatterns = [
          { key: 'executiveSummary', pattern: /executive summary:?\s*([\s\S]*?)(?=\n\n|\*\*|$)/i },
          { key: 'clientInformation', pattern: /client information:?\s*([\s\S]*?)(?=\n\n|\*\*|$)/i },
          { key: 'projectOverview', pattern: /project overview:?\s*([\s\S]*?)(?=\n\n|\*\*|$)/i },
          { key: 'proposedSolution', pattern: /proposed solution:?\s*([\s\S]*?)(?=\n\n|\*\*|$)/i },
          { key: 'projectTimeline', pattern: /project timeline:?\s*([\s\S]*?)(?=\n\n|\*\*|$)/i },
          { key: 'budgetEstimate', pattern: /budget estimate:?\s*([\s\S]*?)(?=\n\n|\*\*|$)/i },
          { key: 'successMetrics', pattern: /success metrics:?\s*([\s\S]*?)(?=\n\n|\*\*|$)/i },
          { key: 'termsConditions', pattern: /terms (?:and|&) conditions:?\s*([\s\S]*?)(?=\n\n|\*\*|$)/i },
        ];
        
        sectionPatterns.forEach(({ key, pattern }) => {
          const match = content.match(pattern);
          if (match && match[1]) {
            sections[key] = match[1].trim();
          }
        });
        
        return { ...proposal, ...sections };
      } catch (e) {
        console.error("Error parsing content:", e);
      }
    }
    
    return proposal;
  };

  const parsedProposal = parseProposalSections();

  const formatKey = (key) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  const formatValue = (value) => {
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside mt-1">
          {value.map((item, index) => (
            <li key={index} className="ml-4">{item}</li>
          ))}
        </ul>
      );
    }
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="ml-4 mt-1">
          {Object.entries(value).map(([k, v]) => (
            <div key={k}>
              <span className="font-medium">{formatKey(k)}:</span> {v || 'N/A'}
            </div>
          ))}
        </div>
      );
    }
    return value;
  };

  // Format the content properly
  const formatContent = (content) => {
    // Handle null or undefined content
    if (content === null || content === undefined) {
      return <p className="text-gray-500 italic">No content available</p>;
    }
    
    if (typeof content === 'string') {
      // Split by common delimiters and format
      return content.split(/\n|•|●|-\s/).filter(line => line.trim()).map((line, idx) => (
        <p key={idx} className="mb-2">{line.trim()}</p>
      ));
    }
    
    if (Array.isArray(content)) {
      return (
        <ul className="list-disc list-inside space-y-1">
          {content.map((item, idx) => {
            if (item === null || item === undefined) {
              return null;
            }
            if (typeof item === 'object') {
              return (
                <li key={idx} className="mb-2">
                  {Object.entries(item).map(([k, v], i) => (
                    <span key={i}>
                      {i > 0 && ' • '}
                      <span className="font-medium">{formatKey(k)}:</span> {v || 'N/A'}
                    </span>
                  ))}
                </li>
              );
            }
            return <li key={idx}>{item}</li>;
          })}
        </ul>
      );
    }
    
    if (typeof content === 'object') {
      return (
        <div className="space-y-2">
          {Object.entries(content).map(([key, value]) => {
            // Handle null/undefined values
            if (value === null || value === undefined) {
              return (
                <div key={key}>
                  <span className="font-medium text-gray-700">{formatKey(key)}:</span>
                  <span className="ml-2 text-gray-400 italic">Not specified</span>
                </div>
              );
            }
            
            // Handle nested arrays
            if (Array.isArray(value)) {
              return (
                <div key={key}>
                  <span className="font-medium text-gray-700">{formatKey(key)}:</span>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {value.map((item, idx) => (
                      <li key={idx} className="text-gray-600">{
                        item === null || item === undefined 
                          ? 'N/A'
                          : typeof item === 'object' && item !== null
                          ? Object.entries(item).map(([k, v]) => `${formatKey(k)}: ${v || 'N/A'}`).join(' • ')
                          : item
                      }</li>
                    ))}
                  </ul>
                </div>
              );
            }
            
            // Handle nested objects
            if (typeof value === 'object' && value !== null) {
              return (
                <div key={key}>
                  <span className="font-medium text-gray-700">{formatKey(key)}:</span>
                  <div className="ml-4 mt-1">
                    {Object.entries(value).map(([k, v]) => (
                      <div key={k} className="text-gray-600">
                        <span className="font-medium">{formatKey(k)}:</span> {v || 'N/A'}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            
            return (
              <div key={key}>
                <span className="font-medium text-gray-700">{formatKey(key)}:</span>
                <span className="ml-2 text-gray-600">{value}</span>
              </div>
            );
          })}
        </div>
      );
    }
    
    return content;
  };

  const renderSection = (title, icon, content) => {
    if (!content) return null;
    
    try {
      return (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              {icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          </div>
          <div className="text-gray-600 leading-relaxed">
            {formatContent(content)}
          </div>
        </div>
      );
    } catch (error) {
      console.error(`Error rendering section ${title}:`, error);
      return (
        <div className="mb-6 bg-red-50 p-6 rounded-lg shadow-sm border border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              {icon}
            </div>
            <h3 className="text-xl font-semibold text-red-800">{title}</h3>
          </div>
          <div className="text-red-600">
            <p>Error rendering this section. The content format may be invalid.</p>
          </div>
        </div>
      );
    }
  };

  // Helper function to create temporary styles for PDF generation
  const createPdfCompatibleStyles = () => {
    const style = document.createElement('style');
    style.id = 'pdf-temp-styles';
    style.textContent = `
      .pdf-temp-fix {
        font-family: Arial, sans-serif !important;
        line-height: 1.6 !important;
        color: rgb(0, 0, 0) !important;
        background-color: rgb(255, 255, 255) !important;
        padding: 40px !important;
        max-width: none !important;
        width: 210mm !important;
        min-height: 297mm !important;
        box-sizing: border-box !important;
      }
      .pdf-temp-fix * {
        color: inherit !important;
        background-color: transparent !important;
        border-color: rgb(229, 231, 235) !important;
        box-shadow: none !important;
        text-shadow: none !important;
      }
      .pdf-temp-fix h1 {
        font-size: 24px !important;
        font-weight: bold !important;
        margin: 0 0 30px 0 !important;
        padding: 0 !important;
        text-align: center !important;
        color: rgb(17, 24, 39) !important;
        page-break-after: avoid !important;
      }
      .pdf-temp-fix h2 {
        font-size: 20px !important;
        font-weight: bold !important;
        margin: 30px 0 15px 0 !important;
        padding: 10px 0 !important;
        color: rgb(17, 24, 39) !important;
        border-bottom: 2px solid rgb(37, 99, 235) !important;
        page-break-after: avoid !important;
      }
      .pdf-temp-fix h3 {
        font-size: 18px !important;
        font-weight: bold !important;
        margin: 20px 0 10px 0 !important;
        padding: 0 !important;
        color: rgb(31, 41, 55) !important;
        page-break-after: avoid !important;
      }
      .pdf-temp-fix p {
        font-size: 12px !important;
        line-height: 1.6 !important;
        margin: 0 0 12px 0 !important;
        padding: 0 !important;
        color: rgb(55, 65, 81) !important;
      }
      .pdf-temp-fix .section {
        margin: 0 0 25px 0 !important;
        padding: 20px !important;
        border: 1px solid rgb(229, 231, 235) !important;
        border-radius: 8px !important;
        background-color: rgb(249, 250, 251) !important;
        page-break-inside: avoid !important;
      }
      .pdf-temp-fix .section-header {
        display: flex !important;
        align-items: center !important;
        margin: 0 0 15px 0 !important;
        padding: 0 !important;
      }
      .pdf-temp-fix .section-icon {
        width: 20px !important;
        height: 20px !important;
        margin-right: 10px !important;
        color: rgb(37, 99, 235) !important;
      }
      .pdf-temp-fix .section-title {
        font-size: 16px !important;
        font-weight: bold !important;
        color: rgb(31, 41, 55) !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .pdf-temp-fix .section-content {
        color: rgb(75, 85, 99) !important;
        font-size: 12px !important;
        line-height: 1.6 !important;
      }
      .pdf-temp-fix ul {
        margin: 10px 0 !important;
        padding-left: 20px !important;
      }
      .pdf-temp-fix li {
        margin: 5px 0 !important;
        font-size: 12px !important;
        line-height: 1.5 !important;
        color: rgb(75, 85, 99) !important;
      }
      .pdf-temp-fix .next-steps {
        background-color: rgb(239, 246, 255) !important;
        border: 1px solid rgb(191, 219, 254) !important;
        border-radius: 8px !important;
        padding: 20px !important;
        margin-top: 30px !important;
      }
      .pdf-temp-fix .next-steps h3 {
        color: rgb(30, 58, 138) !important;
        margin: 0 0 10px 0 !important;
      }
      .pdf-temp-fix .next-steps p {
        color: rgb(30, 64, 175) !important;
      }
      .pdf-temp-fix .client-info {
        display: block !important;
        margin: 5px 0 !important;
      }
      .pdf-temp-fix .client-info strong {
        font-weight: bold !important;
        color: rgb(31, 41, 55) !important;
      }
    `;
    document.head.appendChild(style);
    return style;
  };

  const downloadPDF = async () => {
    try {
      const element = contentRef.current;
      if (!element) return;

      // Create a clean, structured copy of the content for PDF
      const pdfContainer = document.createElement('div');
      pdfContainer.style.cssText = `
        position: absolute;
        top: -10000px;
        left: -10000px;
        width: 210mm;
        min-height: 297mm;
        background: white;
        padding: 40px;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
        font-size: 12px;
        line-height: 1.6;
        color: #000;
      `;
      
      // Build clean PDF content
      let pdfContent = '';
      
      // Title
      if (parsedProposal.title) {
        pdfContent += `<h1 style="font-size: 24px; font-weight: bold; text-align: center; margin: 0 0 30px 0; color: #111827;">${parsedProposal.title}</h1>`;
      }
      
      // Helper function to format content for PDF
      const formatForPdf = (content) => {
        if (!content) return '';
        
        if (typeof content === 'string') {
          return content.split(/\n|•|●|-\s/).filter(line => line.trim()).map(line => 
            `<p style="margin: 0 0 12px 0; font-size: 12px; line-height: 1.6; color: #374151;">${line.trim()}</p>`
          ).join('');
        }
        
        if (Array.isArray(content)) {
          const listItems = content.map(item => {
            if (typeof item === 'object' && item !== null) {
              return `<li style="margin: 5px 0; font-size: 12px; color: #374151;">${
                Object.entries(item).map(([k, v]) => `<strong>${formatKey(k)}:</strong> ${v || 'N/A'}`).join(' • ')
              }</li>`;
            }
            return `<li style="margin: 5px 0; font-size: 12px; color: #374151;">${item}</li>`;
          }).join('');
          return `<ul style="margin: 10px 0; padding-left: 20px;">${listItems}</ul>`;
        }
        
        if (typeof content === 'object') {
          return Object.entries(content).map(([key, value]) => {
            if (Array.isArray(value)) {
              const listItems = value.map(item => `<li style="margin: 3px 0; font-size: 12px;">${item}</li>`).join('');
              return `<div style="margin: 10px 0;"><strong style="color: #1f2937;">${formatKey(key)}:</strong><ul style="margin: 5px 0; padding-left: 20px;">${listItems}</ul></div>`;
            }
            return `<div style="margin: 8px 0; font-size: 12px;"><strong style="color: #1f2937;">${formatKey(key)}:</strong> <span style="color: #4b5563;">${value || 'N/A'}</span></div>`;
          }).join('');
        }
        
        return content;
      };
      
      // Add sections
      const sections = [
        { key: 'executiveSummary', title: 'Executive Summary' },
        { key: 'clientInformation', title: 'Client Information' },
        { key: 'projectOverview', title: 'Project Overview' },
        { key: 'proposedSolution', title: 'Proposed Solution' },
        { key: 'projectTimeline', title: 'Project Timeline' },
        { key: 'teamResources', title: 'Team & Resources' },
        { key: 'budgetEstimate', title: 'Budget Estimate' },
        { key: 'successMetrics', title: 'Success Metrics' },
        { key: 'termsConditions', title: 'Terms & Conditions' }
      ];
      
      sections.forEach(({ key, title }) => {
        if (parsedProposal[key]) {
          pdfContent += `
            <div style="margin: 0 0 25px 0; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #f9fafb;">
              <h2 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0; color: #1f2937; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">${title}</h2>
              <div style="color: #4b5563;">${formatForPdf(parsedProposal[key])}</div>
            </div>
          `;
        }
      });
      
      // Add fallback content if no structured sections
      if (parsedProposal.content && !parsedProposal.executiveSummary) {
        pdfContent += `
          <div style="margin: 0 0 25px 0; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #f9fafb;">
            <h2 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0; color: #1f2937;">Proposal Content</h2>
            <div style="color: #4b5563; white-space: pre-wrap;">${parsedProposal.content}</div>
          </div>
        `;
      }
      
      // Add Next Steps
      pdfContent += `
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin-top: 30px; position: relative; z-index: 1;">
          <h3 style="font-size: 16px; font-weight: bold; color: #1e3a8a; margin: 0 0 10px 0; background: transparent;">Next Steps</h3>
          <p style="color: #1e40af; margin: 0; font-size: 12px; line-height: 1.6; background: transparent;">Review this proposal and download it in your preferred format. The PDF version maintains the visual formatting, while the DOCX version allows for further editing.</p>
        </div>
      `;
      
      pdfContainer.innerHTML = pdfContent;
      document.body.appendChild(pdfContainer);

      // Create temporary styles for PDF compatibility
      const tempStyle = createPdfCompatibleStyles();
      pdfContainer.classList.add('pdf-temp-fix');

      // Use html2canvas with improved configuration
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: false,
        foreignObjectRendering: false,
        imageTimeout: 0,
        width: pdfContainer.offsetWidth,
        height: pdfContainer.offsetHeight,
        windowWidth: pdfContainer.offsetWidth,
        windowHeight: pdfContainer.offsetHeight
      });

      // Clean up
      document.body.removeChild(pdfContainer);
      if (tempStyle && tempStyle.parentNode) {
        tempStyle.parentNode.removeChild(tempStyle);
      }

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png', 0.9);
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`proposal-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    }
  };

  const formatContentForDocx = (content) => {
    if (!content) return '';
    
    if (typeof content === 'string') {
      // Split content into paragraphs and clean up
      return content.split(/\n\s*\n/).filter(para => para.trim()).join('\n\n');
    }
    
    if (Array.isArray(content)) {
      return content.map((item, index) => {
        if (typeof item === 'object' && item !== null) {
          return Object.entries(item)
            .map(([key, value]) => `${formatKey(key)}: ${value || 'N/A'}`)
            .join('\n');
        }
        return `${index + 1}. ${item}`;
      }).join('\n');
    }
    
    if (typeof content === 'object') {
      return Object.entries(content)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            const items = value.map((item, idx) => `  ${idx + 1}. ${item}`).join('\n');
            return `${formatKey(key)}:\n${items}`;
          }
          if (typeof value === 'object' && value !== null) {
            const subItems = Object.entries(value)
              .map(([k, v]) => `  • ${formatKey(k)}: ${v || 'N/A'}`)
              .join('\n');
            return `${formatKey(key)}:\n${subItems}`;
          }
          return `${formatKey(key)}: ${value || 'N/A'}`;
        })
        .join('\n\n');
    }
    
    return String(content);
  };

  const downloadDOCX = () => {
    const createParagraph = (text, options = {}) => {
      return new Paragraph({
        text: text || '',
        spacing: { before: options.spaceBefore || 0, after: options.spaceAfter || 200 },
        alignment: options.alignment,
        heading: options.heading,
        indent: options.indent,
        ...options
      });
    };

    const createHeading = (text, level = HeadingLevel.HEADING_1, spaceBefore = 400) => {
      return new Paragraph({
        text: text,
        heading: level,
        spacing: { before: spaceBefore, after: 200 },
      });
    };

    const createBulletPoint = (text, level = 0) => {
      return new Paragraph({
        text: text,
        bullet: { level: level },
        spacing: { after: 100 },
        indent: { left: 720 * (level + 1) },
      });
    };

    const formatContentToParagraphs = (content, isSubContent = false) => {
      const paragraphs = [];
      
      if (!content) return paragraphs;
      
      if (typeof content === 'string') {
        const lines = content.split(/\n/).filter(line => line.trim());
        lines.forEach(line => {
          if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
            paragraphs.push(createBulletPoint(line.replace(/^[•\-]\s*/, '').trim()));
          } else {
            paragraphs.push(createParagraph(line.trim(), { spaceAfter: 100 }));
          }
        });
        return paragraphs;
      }
      
      if (Array.isArray(content)) {
        content.forEach(item => {
          if (typeof item === 'object' && item !== null) {
            Object.entries(item).forEach(([key, value]) => {
              paragraphs.push(createParagraph(`${formatKey(key)}: ${value || 'N/A'}`, { 
                spaceAfter: 100,
                indent: isSubContent ? { left: 720 } : undefined
              }));
            });
          } else {
            paragraphs.push(createBulletPoint(String(item)));
          }
        });
        return paragraphs;
      }
      
      if (typeof content === 'object') {
        Object.entries(content).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            paragraphs.push(createParagraph(`${formatKey(key)}:`, { 
              spaceAfter: 100,
              indent: isSubContent ? { left: 720 } : undefined
            }));
            value.forEach(item => {
              paragraphs.push(createBulletPoint(String(item), isSubContent ? 1 : 0));
            });
          } else if (typeof value === 'object' && value !== null) {
            paragraphs.push(createParagraph(`${formatKey(key)}:`, { 
              spaceAfter: 100,
              indent: isSubContent ? { left: 720 } : undefined
            }));
            paragraphs.push(...formatContentToParagraphs(value, true));
          } else {
            paragraphs.push(createParagraph(`${formatKey(key)}: ${value || 'N/A'}`, { 
              spaceAfter: 100,
              indent: isSubContent ? { left: 720 } : undefined
            }));
          }
        });
        return paragraphs;
      }
      
      paragraphs.push(createParagraph(String(content)));
      return paragraphs;
    };

    const docChildren = [];
    
    // Title
    if (parsedProposal.title) {
      docChildren.push(
        new Paragraph({
          text: parsedProposal.title,
          heading: HeadingLevel.TITLE,
          spacing: { after: 600 },
          alignment: 'center'
        })
      );
    }
    
    // Document info
    docChildren.push(
      createParagraph(`Generated on: ${new Date().toLocaleDateString()}`, { 
        spaceAfter: 400,
        alignment: 'center'
      })
    );

    // Sections with enhanced formatting
    const sections = [
      { key: 'executiveSummary', title: 'Executive Summary' },
      { key: 'clientInformation', title: 'Client Information' },
      { key: 'projectOverview', title: 'Project Overview' },
      { key: 'proposedSolution', title: 'Proposed Solution' },
      { key: 'projectTimeline', title: 'Project Timeline' },
      { key: 'teamResources', title: 'Team & Resources' },
      { key: 'budgetEstimate', title: 'Budget Estimate' },
      { key: 'successMetrics', title: 'Success Metrics' },
      { key: 'termsConditions', title: 'Terms & Conditions' }
    ];

    sections.forEach(({ key, title }) => {
      if (parsedProposal[key]) {
        docChildren.push(createHeading(title));
        docChildren.push(...formatContentToParagraphs(parsedProposal[key]));
      }
    });

    // Full content fallback
    if (parsedProposal.content && !parsedProposal.executiveSummary) {
      docChildren.push(createHeading('Proposal Content'));
      docChildren.push(...formatContentToParagraphs(parsedProposal.content));
    }

    // Next Steps
    docChildren.push(
      createHeading('Next Steps'),
      createParagraph('Review this proposal and download it in your preferred format. The PDF version maintains the visual formatting, while the DOCX version allows for further editing.'),
      createParagraph('Please feel free to contact us if you have any questions or would like to discuss any aspects of this proposal in detail.', { spaceAfter: 200 })
    );

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch
              right: 1440,  // 1 inch
              bottom: 1440, // 1 inch
              left: 1440,   // 1 inch
            },
          },
        },
        children: docChildren,
      }],
      styles: {
        default: {
          document: {
            run: {
              font: 'Calibri',
              size: 22, // 11pt
            },
            paragraph: {
              spacing: {
                line: 276, // 1.15 line spacing
              },
            },
          },
        },
      },
    });
    
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `proposal-${new Date().toISOString().split('T')[0]}.docx`);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gray-50 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Generated Proposal</h2>
            <p className="text-sm text-gray-600 mt-1">
              Generated on {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadPDF}
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 px-4"
              title="Download as PDF"
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={downloadDOCX}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 px-4"
              title="Download as DOCX"
            >
              <FilePlus className="w-4 h-4" />
              DOCX
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6" ref={contentRef}>
          <div className="bg-white rounded-lg p-8">
            {/* Title */}
            {parsedProposal.title && (
              <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                {parsedProposal.title}
              </h1>
            )}

            {/* Executive Summary */}
            {parsedProposal.executiveSummary && renderSection(
              "Executive Summary",
              <Briefcase className="w-6 h-6 text-blue-600" />,
              parsedProposal.executiveSummary
            )}

            {/* Client Information */}
            {parsedProposal.clientInformation && renderSection(
              "Client Information",
              <Users className="w-6 h-6 text-blue-600" />,
              parsedProposal.clientInformation
            )}

            {/* Project Overview */}
            {parsedProposal.projectOverview && renderSection(
              "Project Overview",
              <FileText className="w-6 h-6 text-blue-600" />,
              parsedProposal.projectOverview
            )}

            {/* Proposed Solution */}
            {parsedProposal.proposedSolution && renderSection(
              "Proposed Solution",
              <Target className="w-6 h-6 text-blue-600" />,
              parsedProposal.proposedSolution
            )}

            {/* Project Timeline */}
            {parsedProposal.projectTimeline && renderSection(
              "Project Timeline",
              <Calendar className="w-6 h-6 text-blue-600" />,
              parsedProposal.projectTimeline
            )}

            {/* Team & Resources */}
            {parsedProposal.teamResources && renderSection(
              "Team & Resources",
              <Users className="w-6 h-6 text-blue-600" />,
              parsedProposal.teamResources
            )}

            {/* Budget Estimate */}
            {parsedProposal.budgetEstimate && renderSection(
              "Budget Estimate",
              <DollarSign className="w-6 h-6 text-blue-600" />,
              parsedProposal.budgetEstimate
            )}

            {/* Success Metrics */}
            {parsedProposal.successMetrics && renderSection(
              "Success Metrics",
              <CheckCircle className="w-6 h-6 text-blue-600" />,
              parsedProposal.successMetrics
            )}

            {/* Terms & Conditions */}
            {parsedProposal.termsConditions && renderSection(
              "Terms & Conditions",
              <FileText className="w-6 h-6 text-blue-600" />,
              parsedProposal.termsConditions
            )}

            {/* Full content fallback */}
            {parsedProposal.content && !parsedProposal.executiveSummary && (
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Proposal Content</h3>
                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {parsedProposal.content}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200 relative">
              <div className="flex items-center gap-3 mb-3">
                <ArrowRight className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-blue-900">Next Steps</h3>
              </div>
              <p className="text-blue-800">
                Review this proposal and download it in your preferred format. The PDF version maintains
                the visual formatting, while the DOCX version allows for further editing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDisplay;