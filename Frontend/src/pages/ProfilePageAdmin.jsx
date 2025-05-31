import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import ReportSection from "../components/profile/report/ReportSection";
import ProfileMainPage from "../components/profile/home/ProfileMainPage";
import ReportsArchive from "../components/profile/archives/ReportsArchive";
import UserManagement from "../components/admin/users/UserManagement";
import Analytics from "../components/admin/analytics/Analytics";

function ProfilePage() {
  const { id } = useParams();
  const [selectedIcon, setSelectedIcon] = useState("Home");
  
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <div className="w-full flex">
        <div className="min-w-fit">
          <AdminSidebar
            selectedIcon={selectedIcon}
            setSelectedIcon={setSelectedIcon}
          />
        </div>
        {selectedIcon === "Home" && <ProfileMainPage />}
        {selectedIcon === "Report" && <ReportSection />}
        {selectedIcon === "Archives" && <ReportsArchive />}
        {selectedIcon === "User Management" && <UserManagement />}
        {selectedIcon === "Analytics" && <Analytics />}
      </div>
    </div>
  );
}

export default ProfilePage;