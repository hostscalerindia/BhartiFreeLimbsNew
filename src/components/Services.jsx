import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'

const Services = () => {
  const navigate = useNavigate()
  const { services, loading, errors } = useData()
  const [currentPage, setCurrentPage] = useState(1)
  const [servicesPerPage, setServicesPerPage] = useState(4) // default 4

  // Handle responsive services per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setServicesPerPage(4) // small screens: 1 per row, 4 total
      } else {
        setServicesPerPage(4) // md/lg screens: 2 per row, 4 total
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const totalPages = Math.ceil(services.length / servicesPerPage)

  const getCurrentPageServices = () => {
    const startIndex = (currentPage - 1) * servicesPerPage
    const endIndex = startIndex + servicesPerPage
    return services.slice(startIndex, endIndex)
  }

  

  const currentServices = getCurrentPageServices()

  const handlePageChange = (page) => setCurrentPage(page)
  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1)
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1)
  const handleServiceDetails = (service) => navigate(`/service/${service.id}`, { state: { service } })

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-3">
                <i className="fa fa-heart text-white text-sm"></i>
              </div>
              <span className="text-primary text-sm md:text-2xl font-medium">Services</span>
            </div>
          </div>

          {/* Services Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-12`}>
            {loading.services ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                  <span className="text-neutral-600">Loading services...</span>
                </div>
              </div>
            ) : errors.services ? (
              <div className="col-span-full text-center py-12">
                <div className="text-red-500 mb-4">
                  <i className="fa fa-exclamation-triangle text-4xl mb-2"></i>
                  <p className="text-lg font-medium">{errors.services}</p>
                  <p className="text-sm text-neutral-500">Please try again later</p>
                </div>
              </div>
            ) : services.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-neutral-500">
                  <i className="fa fa-info-circle text-4xl mb-2"></i>
                  <p className="text-lg font-medium">No services available</p>
                  <p className="text-sm">Please check back later or contact the administrator.</p>
                </div>
              </div>
            ) : (
              currentServices.map((service, index) => (
                <div
                  onClick={() => handleServiceDetails(service)}
                  key={service.id}
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
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
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full ${service.image ? 'hidden' : 'flex'} items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200`}>
                        <i className="fa fa-cog text-primary text-3xl"></i>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:w-3/5 p-4 md:p-6 pb-5 md:pb-6 flex flex-col">
                      <h3 className="text-lg font-bold text-neutral-800 mb-3 leading-tight line-clamp-2">{service.title}</h3>
                      <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3 flex-1">{service.description}</p>
                      <div className="w-full h-px bg-neutral-200 my-3"></div>
                      <button
                        onClick={() => handleServiceDetails(service)}
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

          {/* Pagination + Show All */}
          {!loading.services && !errors.services && services.length > 0 && (
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* {totalPages > 1 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="fa fa-chevron-left text-sm"></i>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-500 ${
                        currentPage === page
                          ? 'bg-primary text-white scale-110 shadow-lg'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-primary hover:text-white hover:shadow-md'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="fa fa-chevron-right text-sm"></i>
                  </button>
                </div>
              )} */}
              <Link
                to="/services"
                state={{ services, loading, errors }}
              >
                <button className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 flex items-center justify-center transform hover:scale-105 shadow-md hover:shadow-lg">
                  <i className="fa fa-list mr-1"></i>
                  Show All
                  <i className="fa fa-arrow-right ml-1"></i>
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Services
