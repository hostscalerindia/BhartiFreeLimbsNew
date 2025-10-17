import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import aboutVector1 from "../image/about-img-vector-1.svg";
import aboutVector2 from "../image/about-img-vector-2.svg";

const ServiceDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { services, centers, loading, errors } = useData();
  const [service, setService] = useState(null);
  const [serviceCenters, setServiceCenters] = useState([]);

  useEffect(() => {
    if (location.state?.service) {
      setService(location.state.service);
    } else if (services.length > 0) {
      const serviceId = location.pathname.split("/").pop();
      const foundService = services.find((s) => s.id === parseInt(serviceId));
      if (foundService) {
        setService(foundService);
      }
    }
  }, [location.state, services, location.pathname]);

  // Filter centers for this service
  useEffect(() => {
    if (service && centers.length > 0) {
      const filteredCenters = centers.filter(
        (center) =>
          center.serviceType === service.title ||
          center.serviceType === service.name
      );
      setServiceCenters(filteredCenters);
    }
  }, [service, centers]);

  const handleBackToServices = () => {
    navigate("/services");
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
      <div>
        {/* Hero Section */}
        <section className="bg-section-second text-white py-40 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`,
              }}
            ></div>
          </div>

          {/* Decorative Vector Elements */}
          <div className="absolute top-8 left-8 opacity-20">
            <img
              src={aboutVector1}
              alt="Decorative vector"
              className="w-24 h-12 object-contain transform rotate-12"
            />
          </div>
          <div className="absolute top-8 right-8 opacity-20">
            <img
              src={aboutVector2}
              alt="Decorative vector hearts"
              className="w-16 h-16 object-contain"
            />
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-20">
            <img
              src={aboutVector1}
              alt="Decorative vector"
              className="w-32 h-16 object-contain transform -rotate-12"
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 mt-20 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Top Tagline */}
            <div className="mb-6">
              <p className="text-yellow-100 text-sm md:text-2xl font-medium flex items-center justify-center">
                <i className="fa fa-heart mr-2"></i>
                Service Details
              </p>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {loading.services
                ? "Loading..."
                : service?.title || "Service Details"}
            </h1>
            <p className="text-xs md:text-sm mb-8 max-w-3xl mx-auto opacity-90 leading-relaxed">
              {loading.services
                ? "Please wait while we load the service details..."
                : service?.description
                ? service.description.substring(0, 150) + "..."
                : "Discover more about this service and how it can help you."}
            </p>
          </div>
        </section>

        {/* Service Details Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading.services ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                  <span className="text-gray-600">
                    Loading service details...
                  </span>
                </div>
              </div>
            ) : errors.services ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  <i className="fa fa-exclamation-triangle text-4xl mb-2"></i>
                  <p className="text-lg font-medium">{errors.services}</p>
                  <p className="text-sm text-gray-500">
                    Please try again later
                  </p>
                </div>
                <button
                  onClick={handleBackToServices}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300"
                >
                  Back to Services
                </button>
              </div>
            ) : service ? (
              <div className="max-w-6xl mx-auto overflow-hidden">
                {/* Back Button */}
                <div className="mb-6">
                  <button
                    onClick={handleBackToServices}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-semibold transition-all duration-300 flex items-center justify-center w-fit mb-6"
                  >
                    <i className="fa fa-arrow-left mr-2"></i>
                    Back to Services
                  </button>
                </div>

                {/* Title */}
                <div className="mb-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    {service.title}
                  </h2>
                  <div className="w-20 h-1 bg-blue-600 rounded-full mb-6"></div>
                </div>

                {/* Content with Image Float */}
                <div className="overflow-hidden max-w-6xl mx-auto flex flex-col md:block">
                  {/* Image Section - Floated Left */}
                  <div className="w-full md:w-1/3 md:float-left md:mr-6 mb-6 md:mb-4 relative h-64 md:h-96 overflow-hidden rounded-2xl shadow-xl">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full ${
                        service.image ? "hidden" : "flex"
                      } items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200`}
                    >
                      <i className="fa fa-cog text-blue-600 text-6xl"></i>
                    </div>
                  </div>

                  {/* Text Content - Flows around image */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      About This Service
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <i className="fa fa-info-circle text-4xl mb-2"></i>
                  <p className="text-lg font-medium">Service not found</p>
                  <p className="text-sm">
                    The service you're looking for doesn't exist.
                  </p>
                </div>
                <button
                  onClick={handleBackToServices}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300"
                >
                  Back to Services
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Centers Section */}
        <section className="py-16 bg-yellow-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Centers Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <i className="fa fa-heart text-white text-sm"></i>
                </div>
                <span className="text-blue-600 text-sm md:text-base font-medium">
                  Centers
                </span>
              </div>
            </div>

            {/* Centers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {loading.centers ? (
                // Loading State
                <div className="col-span-full text-center py-12">
                  <div className="inline-flex items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                    <span className="text-gray-600">Loading centers...</span>
                  </div>
                </div>
              ) : errors.centers ? (
                // Error State
                <div className="col-span-full text-center py-12">
                  <div className="text-red-500 mb-4">
                    <i className="fa fa-exclamation-triangle text-4xl mb-2"></i>
                    <p className="text-lg font-medium">{errors.centers}</p>
                    <p className="text-sm text-gray-500">
                      Please try again later
                    </p>
                  </div>
                </div>
              ) : serviceCenters.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500">
                    <i className="fa fa-info-circle text-4xl mb-2"></i>
                    <p className="text-lg font-medium">No centers available</p>
                    <p className="text-sm">
                      No centers have been added for this service yet.
                    </p>
                  </div>
                </div>
              ) : (
                serviceCenters.map((center, index) => (
                  <div
                    onClick={() =>
                            navigate(`/center/${center.id}`, {
                              state: { center },
                            })
                          }
                    key={center.id}
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    <div className="cursor-pointer bg-white rounded-2xl flex flex-col md:flex-row p-3 md:p-4 gap-4 md:gap-6 border border-primary shadow-[0_4px_6px_0_rgba(235,82,16,0.3)]">
                      {/* Image Left */}
                      <div className="md:w-2/5 h-48 md:h-56 relative overflow-hidden">
                        {center.image ? (
                          <img
                            src={center.image}
                            alt={center.name}
                            className="w-full h-full object-cover transition-transform duration-300 md:group-hover:scale-105"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-full h-full ${
                            center.image ? "hidden" : "flex"
                          } items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200`}
                        >
                          <i className="fa fa-hospital text-primary text-3xl"></i>
                        </div>
                      </div>

                      {/* Content Right */}
                      <div className="md:w-3/5 p-4 md:p-6 pb-5 md:pb-6 flex flex-col">
                        {/* Title */}
                        <h3 className="text-lg font-bold text-neutral-800 mb-3 leading-tight line-clamp-2">
                          {center.name}
                        </h3>

                        {/* Description */}
                        <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3 flex-1">
                          {center.description}
                        </p>

                        {/* Separator */}
                        <div className="w-full h-px bg-neutral-200 my-3"></div>

                        {/* Center Details Button */}
                        <button
                          
                          className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 flex items-center justify-center w-fit"
                        >
                          <i className="fa fa-arrow-right mr-2"></i>
                          Center Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServiceDetails;
