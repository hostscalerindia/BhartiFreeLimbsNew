import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { get } from '../utils/api'
import aboutVector1 from '../image/about-img-vector-1.svg'
import aboutVector2 from '../image/about-img-vector-2.svg'

const GalleryDetails = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [galleryItem, setGalleryItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (location.state?.galleryItem) {
      setGalleryItem(location.state.galleryItem)
      setLoading(false)
    } else {
      // Fallback: fetch gallery item by ID if no data passed
      const fetchGalleryItem = async () => {
        try {
          setLoading(true)
          setError(null)
          const galleryId = location.pathname.split('/').pop()
          const response = await get(`/api/gallery/${galleryId}`)
          
          if (response.data) {
            const galleryData = {
              id: response.data.id,
              title: response.data.title || `Gallery Item ${response.data.id}`,
              description: response.data.description || "No description available.",
              image: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/gallery/${response.data.id}/image`,
              created_at: response.data.created_at
            }
            setGalleryItem(galleryData)
          }
        } catch (err) {
          console.error('Error fetching gallery item details:', err)
          setError('Failed to load gallery item details')
        } finally {
          setLoading(false)
        }
      }

      fetchGalleryItem()
    }
  }, [location.state, location.pathname])

  const handleBackToGallery = () => {
    navigate('/')
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
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
          }}></div>
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-snug">
            Our Gallery
          </h1>
          <p className="text-xs sm:text-sm md:text-base mb-6 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Explore our collection of memorable moments and impactful work from our organization.
          </p>
        </div>
      </section>

      {/* Gallery Details Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            // Loading State
            <div className="text-center py-12">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                <span className="text-neutral-600">Loading gallery details...</span>
              </div>
            </div>
          ) : error ? (
            // Error State
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <i className="fa fa-exclamation-triangle text-4xl mb-2"></i>
                <p className="text-lg font-medium">{error}</p>
                <p className="text-sm text-neutral-500">Please try again later</p>
              </div>
              <button 
                onClick={handleBackToGallery}
                className="bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300"
              >
                Back to Gallery
              </button>
            </div>
          ) : galleryItem ? (
            <div className="max-w-6xl mx-auto">
              {/* Back Button */}
              <div className="mb-6">
                <button 
                  onClick={handleBackToGallery}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-6 py-2 rounded-full font-semibold transition-all duration-300 flex items-center justify-center w-fit mb-6"
                >
                  <i className="fa fa-arrow-left mr-2"></i>
                  Back to Gallery
                </button>
              </div>

              {/* Title */}
              <div className="mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
                  {galleryItem.title}
                </h2>
                <div className="w-20 h-1 bg-primary rounded-full mb-6"></div>
              </div>

              {/* Content with Image Float */}
              <div className="overflow-hidden">
                {/* Image Section - Floated Left */}
                <div className="float-left w-1/3 mr-6 mb-4 relative h-96 overflow-hidden rounded-2xl shadow-lg">
                  {galleryItem.image ? (
                    <img 
                      src={galleryItem.image} 
                      alt={galleryItem.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-full h-full ${galleryItem.image ? 'hidden' : 'flex'} items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200`}
                  >
                    <i className="fa fa-image text-primary text-6xl"></i>
                  </div>
                </div>

                {/* Text Content - Flows around image */}
                <div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-3">About This Image</h3>
                  <p className="text-neutral-600 leading-relaxed text-lg">
                    {galleryItem.description}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // No Gallery Item Found
            <div className="text-center py-12">
              <div className="text-neutral-500">
                <i className="fa fa-info-circle text-4xl mb-2"></i>
                <p className="text-lg font-medium">Gallery item not found</p>
                <p className="text-sm">The gallery item you're looking for doesn't exist.</p>
              </div>
              <button 
                onClick={handleBackToGallery}
                className="mt-4 bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300"
              >
                Back to Gallery
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default GalleryDetails
