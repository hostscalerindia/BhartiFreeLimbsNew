import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";

const Announcements = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { announcements, loading, errors } = useData();
  const announcementsPerPage = 6; // 2 rows of 3 cards each

  // Pagination logic
  const totalPages = Math.ceil(announcements.length / announcementsPerPage);
  const startIndex = (currentPage - 1) * announcementsPerPage;
  const endIndex = startIndex + announcementsPerPage;
  const currentAnnouncements = announcements.slice(startIndex, endIndex);

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

        .announcement-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .announcement-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .announcement-image {
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .announcement-card:hover .announcement-image {
          transform: scale(1.05);
        }

        .read-more-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .read-more-btn:hover {
          transform: translateX(4px);
        }
      `}</style>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-3">
                <i className="fa fa-heart text-white text-sm"></i>
              </div>
              <span className="text-primary text-sm md:text-2xl font-medium">
                Our Latest Announcements
              </span>
            </div>
          </div>
          {/* Announcements Grid - 3 cards per row */};
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
            {loading.announcements ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                  <span className="text-neutral-600">
                    Loading announcements...
                  </span>
                </div>
              </div>
            ) : errors.announcements ? (
              <div className="col-span-full text-center py-12">
                <div className="text-red-500 mb-4">
                  <i className="fa fa-exclamation-triangle text-4xl mb-2"></i>
                  <p className="text-lg font-medium">{errors.announcements}</p>
                  <p className="text-sm text-neutral-500">
                    Please try again later
                  </p>
                </div>
              </div>
            ) : currentAnnouncements.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-neutral-500">
                  <i className="fa fa-newspaper text-4xl mb-2"></i>
                  <p className="text-lg font-medium">
                    No announcements available
                  </p>
                  <p className="text-sm">
                    No announcements have been published yet.
                  </p>
                </div>
              </div>
            ) : (
              currentAnnouncements.map((announcement, index) => (
                <div
                  key={announcement.id}
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  }}
                >
                  {/* Pure Card Clickable */}
                  <Link
                    to={`/announcements/${announcement.id}`}
                    className="block cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-xl 
                     flex flex-col md:flex-row p-3 md:p-4 gap-4 md:gap-6 
                     border border-primary shadow-[0_4px_6px_0_rgba(235,82,16,0.3)]
                     hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Image Left */}
                    <div className="md:w-2/5 h-48 md:h-56 relative overflow-hidden rounded-xl">
                      {announcement.image ? (
                        <img
                          src={announcement.image}
                          alt={announcement.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                          <i className="fa fa-newspaper text-primary text-3xl"></i>
                        </div>
                      )}
                    </div>

                    {/* Content Right */}
                    <div className="md:w-3/5 p-4 md:p-6 pb-5 md:pb-6 flex flex-col">
                      <h3 className="text-lg font-bold text-neutral-800 mb-3 leading-tight line-clamp-2">
                        {announcement.title}
                      </h3>

                      <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3 flex-1">
                        {announcement.excerpt}
                      </p>

                      <div className="w-full h-px bg-neutral-200 my-3"></div>

                      {/* Button (style same) */}
                      <button
                        onClick={(e) => e.stopPropagation()} // prevent double navigation
                        className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-full 
                         font-semibold text-sm transition-all duration-300 flex items-center 
                         justify-center w-fit"
                      >
                        <i className="fa fa-arrow-right mr-2"></i>
                        Read More
                      </button>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
          {/* Pagination */}
          {!loading.announcements &&
            !errors.announcements &&
            announcements.length > 0 &&
            totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mb-8">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white border border-neutral-200 text-neutral-600 hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <i className="fa fa-chevron-left mr-2"></i>
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                        currentPage === page
                          ? "bg-primary text-white"
                          : "bg-white border border-neutral-200 text-neutral-600 hover:bg-primary hover:text-white"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white border border-neutral-200 text-neutral-600 hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Next
                  <i className="fa fa-chevron-right ml-2"></i>
                </button>
              </div>
            )}
          {/* View All Announcements Button - Centered at Bottom */}
          <div className="flex justify-center">
            <Link
              to="/announcements"
              state={{
                announcements: announcements,
                loading: loading.announcements,
                error: errors.announcements,
              }}
            >
              <button className="bg-primary hover:bg-primary-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-500 ease-out flex items-center justify-center">
                View All Announcements
                <i className="fa fa-arrow-right ml-2"></i>
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Announcements;
