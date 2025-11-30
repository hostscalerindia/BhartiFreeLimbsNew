import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { get } from "../utils/api";
import aboutVector1 from "../image/about-img-vector-1.svg";
import aboutVector2 from "../image/about-img-vector-2.svg";

const AnnouncementDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.announcement) {
      setAnnouncement(location.state.announcement);
      setLoading(false);
    } else {
      // Fallback: fetch announcement by ID if no data passed
      const fetchAnnouncement = async () => {
        try {
          setLoading(true);
          setError(null);
          const announcementId = location.pathname.split("/").pop();
          const response = await get(`/api/announcements/${announcementId}`);

          if (response.data) {
            const announcementData = {
              id: response.data.id,
              title: response.data.title,
              content:
                response.data.content ||
                "No content available for this announcement.",
              category: response.data.category || "General",
              date: new Date(
                response.data.created_at || response.data.date
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              author: "By Admin",
              image: response.data.hasImage
                ? `${
                    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
                  }/api/announcements/${response.data.id}/image`
                : null,
            };
            setAnnouncement(announcementData);
          }
        } catch (err) {
          console.error("Error fetching announcement details:", err);
          setError("Failed to load announcement details");
        } finally {
          setLoading(false);
        }
      };

      fetchAnnouncement();
    }
  }, [location.state, location.pathname]);

  const handleBackToAnnouncements = () => {
    navigate("/announcements");
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="bg-section-second text-white py-5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`,
            }}
          ></div>
        </div>

        <div className="absolute top-6 left-6 opacity-20">
          <img
            src={aboutVector1}
            alt="Decorative vector"
            className="w-20 h-10 object-contain transform rotate-12"
          />
        </div>
        <div className="absolute top-6 right-6 opacity-20">
          <img
            src={aboutVector2}
            alt="Decorative vector hearts"
            className="w-12 h-12 object-contain"
          />
        </div>
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-20">
          <img
            src={aboutVector1}
            alt="Decorative vector"
            className="w-24 h-12 object-contain transform -rotate-12"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-20 lg:px-8 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-snug">
            Latest Updates
          </h1>
          <p className="text-xs sm:text-sm md:text-base mb-6 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Stay informed with our latest announcements and important updates
            from our organization.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            // Loading State
            <div className="text-center py-12">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                <span className="text-neutral-600">
                  Loading announcement details...
                </span>
              </div>
            </div>
          ) : error ? (
            // Error State
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <i className="fa fa-exclamation-triangle text-4xl mb-2"></i>
                <p className="text-lg font-medium">{error}</p>
                <p className="text-sm text-neutral-500">
                  Please try again later
                </p>
              </div>
              <button
                onClick={handleBackToAnnouncements}
                className="bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300"
              >
                Back to Announcements
              </button>
            </div>
          ) : announcement ? (
            <div className="max-w-6xl mx-auto">
              {/* Back Button */}
              <div className="mb-6">
                <button
                  onClick={handleBackToAnnouncements}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-6 py-2 rounded-full font-semibold transition-all duration-300 flex items-center justify-center w-fit mb-6"
                >
                  <i className="fa fa-arrow-left mr-2"></i>
                  Back to Announcements
                </button>
              </div>

              {/* Title */}
              <div className="mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
                  {announcement.title}
                </h2>
                <div className="w-20 h-1 bg-primary rounded-full mb-6"></div>
              </div>

              {/* Content with Image Float */}
              <div className="overflow-hidden">
                {/* Image Section - Floated Left */}
                <div className="float-left w-1/3 mr-6 mb-4 relative h-96 overflow-hidden rounded-2xl shadow-lg">
                  {announcement.image ? (
                    <img
                      src={announcement.image}
                      alt={announcement.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full ${
                      announcement.image ? "hidden" : "flex"
                    } items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200`}
                  >
                    <i className="fa fa-newspaper text-primary text-6xl"></i>
                  </div>
                </div>

                {/* Text Content - Flows around image */}
                <div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-3">
                    About This Announcement
                  </h3>
                  <p className="text-neutral-600 leading-relaxed text-lg">
                    {announcement.content}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // No Announcement Found
            <div className="text-center py-12">
              <div className="text-neutral-500">
                <i className="fa fa-info-circle text-4xl mb-2"></i>
                <p className="text-lg font-medium">Announcement not found</p>
                <p className="text-sm">
                  The announcement you're looking for doesn't exist.
                </p>
              </div>
              <button
                onClick={handleBackToAnnouncements}
                className="mt-4 bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300"
              >
                Back to Announcements
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AnnouncementDetails;
