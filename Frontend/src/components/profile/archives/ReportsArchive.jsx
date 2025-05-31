import React, { useState } from "react";
import {
  Archive,
  FileText,
  Calendar,
  User,
  Building2,
  Eye,
  Download,
  Trash2,
  Search,
  Filter,
  SortDesc,
  Clock,
  Tag,
  MoreVertical,
} from "lucide-react";

const ReportsArchive = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterBy, setFilterBy] = useState("all");

  // Mock data for demonstration
  const [reports] = useState([
    {
      id: 1,
      title: "E-commerce Platform Development Proposal",
      clientName: "TechCorp Solutions",
      clientIndustry: "Technology",
      createdDate: "2024-05-28",
      type: "Technical Proposal",
      status: "Completed",
      description:
        "Comprehensive proposal for building a modern e-commerce platform with React and Node.js",
      budget: "$75,000 - $100,000",
      techStack: ["React", "Node.js", "MongoDB", "AWS"],
      priority: "high",
    },
    {
      id: 2,
      title: "Healthcare Management System",
      clientName: "MediCare Inc.",
      clientIndustry: "Healthcare",
      createdDate: "2024-05-25",
      type: "System Analysis",
      status: "In Review",
      description:
        "Analysis and proposal for implementing a comprehensive healthcare management system",
      budget: "$150,000 - $200,000",
      techStack: ["Angular", "Java", "PostgreSQL", "Docker"],
      priority: "medium",
    },
    {
      id: 3,
      title: "Financial Dashboard Application",
      clientName: "FinanceFlow Ltd",
      clientIndustry: "Finance",
      createdDate: "2024-05-22",
      type: "Dashboard Design",
      status: "Completed",
      description:
        "Interactive financial dashboard with real-time analytics and reporting capabilities",
      budget: "$50,000 - $75,000",
      techStack: ["Vue.js", "Python", "MySQL", "Redis"],
      priority: "low",
    },
    {
      id: 4,
      title: "Mobile App Development Strategy",
      clientName: "StartupX",
      clientIndustry: "Startup",
      createdDate: "2024-05-20",
      type: "Strategy Document",
      status: "Draft",
      description:
        "Complete mobile application development strategy and implementation roadmap",
      budget: "$30,000 - $50,000",
      techStack: ["React Native", "Firebase", "TypeScript"],
      priority: "high",
    },
    {
      id: 5,
      title: "Data Analytics Platform",
      clientName: "DataDriven Corp",
      clientIndustry: "Analytics",
      createdDate: "2024-05-18",
      type: "Technical Specification",
      status: "Completed",
      description:
        "Advanced data analytics platform with machine learning capabilities",
      budget: "$120,000 - $180,000",
      techStack: ["Python", "TensorFlow", "Apache Spark", "Kubernetes"],
      priority: "medium",
    },
  ]);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.clientIndustry.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterBy === "all" ||
      report.status.toLowerCase() === filterBy.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.createdDate) - new Date(a.createdDate);
      case "title":
        return a.title.localeCompare(b.title);
      case "client":
        return a.clientName.localeCompare(b.clientName);
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in review":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 min-w-full mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Archive className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-medium text-gray-800">
            Reports Archive
          </h1>
        </div>
        <p className="text-gray-600">
          Manage and view all your generated reports
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reports, clients, or industries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:w-1/2 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="w-fit flex flex-col gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in review">In Review</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="relative">
            <SortDesc className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="client">Sort by Client</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {sortedReports.length} of {reports.length} reports
        </p>
      </div>

      {/* Reports Grid */}
      <div className=" w-full flex flex-wrap gap-6">
        {sortedReports.map((report) => (
          <div
            key={report.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}
                >
                  {report.status}
                </span>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded-full">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {report.title}
            </h3>

            {/* Client Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">{report.clientName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Tag className="w-4 h-4" />
                <span>{report.clientIndustry}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(report.createdDate)}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {report.description}
            </p>

            {/* Tech Stack */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {report.techStack.slice(0, 3).map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                  >
                    {tech}
                  </span>
                ))}
                {report.techStack.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                    +{report.techStack.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Budget and Priority */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-900">
                {report.budget}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}
              >
                {report.priority.charAt(0).toUpperCase() +
                  report.priority.slice(1)}{" "}
                Priority
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                <Eye className="w-4 h-4" />
                View
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedReports.length === 0 && (
        <div className="text-center py-12">
          <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No reports found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportsArchive;
