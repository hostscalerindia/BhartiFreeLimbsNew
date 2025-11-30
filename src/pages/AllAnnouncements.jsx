import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useData } from "../context/DataContext";

const AllAnnouncements = () => {
  const location = useLocation();
  const { announcements, loading, errors } = useData();

  if (announcements.length === 0) {
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
          <div className="max-w-7xl mx-auto px-4 mt-20 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-snug">
              All Announcements
            </h1>
            <p className="text-xs sm:text-sm md:text-base mb-6 max-w-3xl mx-auto opacity-90 leading-relaxed">
              Stay updated with our latest news and announcements.
            </p>
            {/* <Link to="/">
              <button className="bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center mx-auto transform hover:scale-105 shadow-lg hover:shadow-xl">
                <i className="fa fa-arrow-left mr-2"></i>
                Back to Home
              </button>
            </Link> */}
          </div>
        </section>

        {/* No Announcements Message */}
        <section className="py-16 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <i className="fa fa-newspaper text-neutral-400 text-6xl mb-6"></i>
              <h2 className="text-3xl font-bold text-neutral-800 mb-4">
                No Announcements Yet
              </h2>
              <p className="text-xl text-neutral-600 mb-8">
                We're working on bringing you the latest updates. Check back
                soon!
              </p>
              <Link to="/">
                <button className="bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center mx-auto transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <i className="fa fa-home mr-2"></i>
                  Go to Home
                </button>
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-20 lg:px-8 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-snug">
            All Announcements
          </h1>
          <p className="text-sm sm:text-base md:text-lg mb-6 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Stay updated with our latest news and announcements.
          </p>
          <Link to="/">
            <button className="bg-primary hover:bg-primary-600 text-white px-6 py-2 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center mx-auto transform hover:scale-105 shadow-md hover:shadow-lg">
              <i className="fa fa-arrow-left mr-2"></i>
              Back to Home
            </button>
          </Link>
        </div>
      </section>

      {/* All Announcements Grid */}
      <section className="py-16 ">
        <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-3">
                <i className="fa fa-heart text-white text-sm"></i>
              </div>
              <span className="text-primary text-sm md:text-base font-medium">
                Announcements
              </span>
            </div>
          </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading.announcements ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                <span className="text-neutral-600">
                  Loading announcements...
                </span>
              </div>
            </div>
          ) : errors.announcements ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <i className="fa fa-exclamation-triangle text-4xl mb-2"></i>
                <p className="text-lg font-medium">{errors.announcements}</p>
                <p className="text-sm text-neutral-500">
                  Please try again later
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {announcements.map((announcement, index) => (
        <div
          key={announcement.id}
          style={{
            animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
          }}
        >
          {/* Whole Card Clickable using Link */}
          <Link
            to={`/announcements/${announcement.id}`}
            className="block cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-xl flex flex-col md:flex-row 
                       p-6 md:p-6 gap-4 md:gap-6 border border-primary 
                       shadow-[0_4px_6px_0_rgba(235,82,16,0.3)] 
                       hover:-translate-y-1 transition-all duration-300"
          >
            {/* Image Section - Left */}
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

            {/* Content Section - Right */}
            <div className="md:w-3/5 p-2 md:p-4 flex flex-col">
              <h3 className="text-lg font-bold text-neutral-800 mb-3 leading-tight line-clamp-2">
                {announcement.title}
              </h3>

              <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3 flex-1">
                {announcement.excerpt}
              </p>

              <div className="w-full h-px bg-neutral-200 my-3"></div>

              {/* Button (unchanged style) */}
              <button
                onClick={(e) => e.stopPropagation()} // prevent double navigation
                className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 flex items-center justify-center w-fit"
              >
                <i className="fa fa-arrow-right mr-2"></i>
                Read More
              </button>
            </div>
          </Link>
        </div>
      ))}
    </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AllAnnouncements;
