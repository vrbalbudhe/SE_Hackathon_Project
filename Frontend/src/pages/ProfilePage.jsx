import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ReportSection from "../components/profile/report/ReportSection";
import ProfileMainPage from "../components/profile/home/ProfileMainPage";
import UserProposalArchives from "../components/profile/archives/UserProposalArchives";

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
        {selectedIcon === "Archives" && <UserProposalArchives />}
      </div>
    </div>
  );
}

export default ProfilePage;
