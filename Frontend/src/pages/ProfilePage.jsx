import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ReportSection from "../components/profile/report/ReportSection";
import ProfileMainPage from "../components/profile/home/ProfileMainPage";
import ReportsArchive from "../components/profile/archives/ReportsArchive";

function ProfilePage() {
  const { id } = useParams();
  const [selectedIcon, setSelectedIcon] = useState("Home");
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <div className="w-full flex">
        <div className="min-w-fit">
          <ProfileSidebar
            selectedIcon={selectedIcon}
            setSelectedIcon={setSelectedIcon}
          />
        </div>
        {selectedIcon === "Home" && <ProfileMainPage />}
        {selectedIcon === "Report" && <ReportSection />}
        {selectedIcon === "Archives" && <ReportsArchive />}
      </div>
    </div>
  );
}

export default ProfilePage;
