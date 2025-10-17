import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import aboutVector1 from "../image/about-img-vector-1.svg";
import aboutVector2 from "../image/about-img-vector-2.svg";

const Services = () => {
  const navigate = useNavigate();
  const { services, loading, errors } = useData();

  const handleServiceDetails = (service) => {
    navigate(`/service/${service.id}`, { state: { service } });
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
        <section className="bg-section-second text-white py-20 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`,
              }}
            ></div>
          </div>

          {/* Decorative Vectors */}
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Comprehensive Support Programs
            </h1>
            <p className="text-xs md:text-sm mb-6 max-w-3xl mx-auto opacity-90 leading-relaxed">
              Discover our range of services designed to address the diverse
              needs of our community through dedicated support and compassionate
              care.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
              {loading.services ? (
                <div className="col-span-full text-center py-12">
                  <div className="inline-flex items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                    <span className="text-neutral-600">
                      Loading services...
                    </span>
                  </div>
                </div>
              ) : errors.services ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-red-500 mb-4">
                    <i className="fa fa-exclamation-triangle text-4xl mb-2"></i>
                    <p className="text-lg font-medium">{errors.services}</p>
                    <p className="text-sm text-neutral-500">
                      Please try again later
                    </p>
                  </div>
                </div>
              ) : services.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-neutral-500">
                    <i className="fa fa-info-circle text-4xl mb-2"></i>
                    <p className="text-lg font-medium">No services available</p>
                    <p className="text-sm">
                      Please check back later or contact the administrator.
                    </p>
                  </div>
                </div>
              ) : (
                services.map((service, index) => (
                  <div
                    onClick={() => handleServiceDetails(service)}
                    key={service.id}
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    <div className="cursor-pointer bg-white rounded-2xl flex flex-col md:flex-row p-3 md:p-4 gap-4 md:gap-6 border border-primary shadow-[0_4px_6px_0_rgba(235,82,16,0.3)]">
                      {/* Image */}
                      <div className="md:w-2/5 h-48 md:h-56 relative overflow-hidden">
                        {service.image ? (
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover transition-transform duration-300 md:group-hover:scale-105"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-full h-full ${
                            service.image ? "hidden" : "flex"
                          } items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200`}
                        >
                          <i className="fa fa-cog text-primary text-3xl"></i>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="md:w-3/5 p-4 md:p-6 pb-5 md:pb-6 flex flex-col">
                        <h3 className="text-lg font-bold text-neutral-800 mb-3 leading-tight line-clamp-2">
                          {service.title}
                        </h3>
                        <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3 flex-1">
                          {service.description}
                        </p>
                        <div className="w-full h-px bg-neutral-200 my-3"></div>
                        <button
                          
                          className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 flex items-center justify-center w-fit"
                        >
                          <i className="fa fa-arrow-right mr-2"></i>
                          Service Details
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

export default Services;
