import { useState } from "react";
import GalleryForm from "./Pages/GalleryForm";
import ServiceForm from "./Pages/ServiceForm";
import AnnouncementForm from "./Pages/AnnouncementForm";
import ViewServices from "./Pages/ViewServices";
import ViewGallary from "./Pages/ViewGallary";
import ServiceTypeForm from "./Pages/ServiceTypeForm";
import CenterGalleryForm from "./Pages/CenterGalleryForm";
import ViewCenterGallery from "./Pages/ViewCenterGallery";
import TestimonialForm from "./Pages/TestimonialForm";
import ViewTestimonials from "./Pages/ViewTestimonials";
import ViewAnnouncements from "./Pages/ViewAnnouncements";
import TeamMemberForm from "./Pages/TeamMemberForm";
import ViewTeamMembers from "./Pages/ViewTeamMembers";
// import MultipleGalleryForm from "./Pages/MultipleGalleryForm";
import logo from '../image/logo.png'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("addServiceType");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    window.location.href = "/admin/login";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "gallery":
        return <GalleryForm />;
      case "ViewGallary":
        return <ViewGallary />;
      // case "multipleGallery":
      //   return <MultipleGalleryForm />;
      case "services":
        return <ServiceForm />;
      case "announcement":
        return <AnnouncementForm />;
      case "viewService":
        return <ViewServices />;
      case "addServiceType":
        return <ServiceTypeForm />;
      case "centerGallery":
        return <CenterGalleryForm />;
      case "viewCenterGallery":
        return <ViewCenterGallery />;
      case "testimonial":
        return <TestimonialForm />;
      case "viewTestimonials":
        return <ViewTestimonials />;
      case "viewAnnouncements":
        return <ViewAnnouncements />;
      case "teamMember":
        return <TeamMemberForm />;
      case "viewTeamMembers":
        return <ViewTeamMembers />;
      default:
        return <ServiceTypeForm />;
    }
  };

  const getTabIcon = (tabName) => {
    switch (tabName) {
      case "gallery":
        return <i className="fa fa-images"></i>;
      case "ViewGallary":
        return <i className="fa fa-eye"></i>;
      // case "multipleGallery":
      //   return <i className="fa fa-clone"></i>;
      case "services":
        return <i className="fa fa-building"></i>;
      case "announcement":
        return <i className="fa fa-bullhorn"></i>;
      case "viewService":
        return <i className="fa fa-list"></i>;
      case "addServiceType":
        return <i className="fa fa-plus"></i>;
      case "centerGallery":
        return <i className="fa fa-camera"></i>;
      case "viewCenterGallery":
        return <i className="fa fa-images"></i>;
      case "testimonial":
        return <i className="fa fa-quote-left"></i>;
      case "viewTestimonials":
        return <i className="fa fa-comments"></i>;
      case "viewAnnouncements":
        return <i className="fa fa-newspaper"></i>;
      case "teamMember":
        return <i className="fa fa-user-plus"></i>;
      case "viewTeamMembers":
        return <i className="fa fa-users"></i>;
      default:
        return <i className="fa fa-bars"></i>;
    }
  };

  const getTabLabel = (tabName) => {
    switch (tabName) {
      case "gallery":
        return "Add Gallery";
      case "ViewGallary":
        return "View Gallery";
      // case "multipleGallery":
      //   return "Add Multiple Gallery";
      case "services":
        return "Add Center";
      case "announcement":
        return "Add Announcement";
      case "viewService":
        return "View Centers";
      case "addServiceType":
        return "Service Types";
      case "centerGallery":
        return "Add Center Gallery";
      case "viewCenterGallery":
        return "View Center Gallery";
      case "testimonial":
        return "Add Testimonial";
      case "viewTestimonials":
        return "View Testimonials";
      case "viewAnnouncements":
        return "View Announcements";
      case "teamMember":
        return "Add Team Member";
      case "viewTeamMembers":
        return "View Team Members";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="h-screen bg-neutral-50 flex flex-col overflow-hidden">
      {/* Top Navigation Bar - Fixed at top */}
      <nav className="bg-white shadow-lg border-b border-neutral-200 flex-shrink-0">
        <div className="w-full mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 sm:p-2 rounded-lg text-neutral-600 hover:text-primary hover:bg-primary/10 transition-colors duration-200"
              >
                <i className="fa fa-bars text-base sm:text-lg"></i>
              </button>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                  <img
                    src={logo}
                    alt="logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-neutral-800 truncate">
                  BhartiFreeLimbs Admin
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
              >
                <i className="fa fa-sign-out-alt text-xs sm:text-sm"></i>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area - Takes remaining height */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            ></div>
          </div>
        )}

        {/* Sidebar */}
        <div
          className={`bg-white shadow-lg border-r border-neutral-200 transition-all duration-300 ${
            sidebarOpen
              ? "fixed lg:relative  left-0 h-[calc(100vh-4rem)] w-64 sm:w-72 lg:w-64 z-50 lg:z-auto"
              : "fixed lg:relative  left-0 h-[calc(100vh-4rem)] w-0 lg:w-24 z-50 lg:z-auto overflow-hidden"
          }`}
        >
          <div className="p-2 sm:p-4 h-full overflow-y-auto">
            {/* Close Button */}
            {sidebarOpen && (
              <div className="flex justify-end">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg text-neutral-600 hover:text-primary hover:bg-primary-50 transition-colors duration-200"
                >
                  <i className="fa fa-times text-sm"></i>
                </button>
              </div>
            )}
            <div className="space-y-1 sm:space-y-2">
              {/* {["addServiceType", "services", "viewService", "centerGallery", "viewCenterGallery", "gallery", "multipleGallery", "ViewGallary", "announcement", "viewAnnouncements", "teamMember", "viewTeamMembers"].map((tab) => ( */}
              {[
                "addServiceType",
                "services",
                "viewService",
                "centerGallery",
                "viewCenterGallery",
                "gallery",
                "ViewGallary",
                "announcement",
                "viewAnnouncements",
                "teamMember",
                "viewTeamMembers",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    // Close sidebar on mobile after selection
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-primary text-white shadow-lg"
                      : "text-neutral-600 hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0">
                    {getTabIcon(tab)}
                  </div>
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left truncate">
                        {getTabLabel(tab)}
                      </span>
                      {activeTab === tab && (
                        <i className="fa fa-chevron-right text-xs flex-shrink-0"></i>
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-2 sm:p-4 lg:p-6 overflow-y-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-neutral-200 min-h-full">
            <div className="p-3 sm:p-4 lg:p-6">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
