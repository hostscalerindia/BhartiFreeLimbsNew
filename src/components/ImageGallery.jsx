import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'

const ImageGallery = () => {
  const navigate = useNavigate()
  const { galleryItems, loading, errors } = useData()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [enableTransition, setEnableTransition] = useState(true)
  const intervalRef = useRef(null)

  const handleGalleryItemClick = (galleryItem) => {
    navigate(`/gallery/${galleryItem.id}`, { state: { galleryItem } })
  }

  const baseLen = galleryItems.length
  // duplicate twice for smooth infinite loop
  const items = baseLen > 0 ? [...galleryItems, ...galleryItems, ...galleryItems] : []

  useEffect(() => {
    if (!baseLen) return
    // start from middle chunk
    setCurrentIndex(baseLen)
  }, [baseLen])

  const nextSlide = () => setCurrentIndex((prev) => prev + 1)
  const prevSlide = () => setCurrentIndex((prev) => prev - 1)

  // Autoplay
  useEffect(() => {
    if (!baseLen) return
    intervalRef.current = setInterval(nextSlide, 2500)
    return () => clearInterval(intervalRef.current)
  }, [baseLen])

  // Seamless infinite loop logic
  useEffect(() => {
    if (!baseLen || items.length === 0) return

    if (currentIndex >= baseLen * 2) {
      setEnableTransition(false)
      setCurrentIndex(currentIndex - baseLen)
      requestAnimationFrame(() => setEnableTransition(true))
    }

    if (currentIndex < baseLen) {
      setEnableTransition(false)
      setCurrentIndex(currentIndex + baseLen)
      requestAnimationFrame(() => setEnableTransition(true))
    }
  }, [currentIndex, baseLen, items.length])

  if (loading.galleryItems) return <div>Loading...</div>
  if (errors.galleryItems) return <div>{errors.galleryItems}</div>
  if (galleryItems.length === 0) return <div>No gallery items</div>

  return (
    <section className="py-16 bg-yellow-100 relative overflow-hidden">
      <div className="relative overflow-hidden">
        <div
          className={`flex ${enableTransition ? 'transition-transform duration-700 ease-linear' : ''}`}
          style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
        >
          {items.map((item, index) => (
            <div key={`${item.id}-${index}`} className="w-1/3 flex-shrink-0 px-2">
              <div
                className="bg-white rounded-lg shadow-md border border-neutral-100 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
                onClick={() => handleGalleryItemClick(item)}
              >
                {/* Increased height and centered content */}
                <div className="h-72 relative flex items-center justify-center overflow-hidden group bg-gray-100">
  {item.image ? (
    <>
      <img
        src={item.image}
        alt={item.title}
        className="max-w-full max-h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:opacity-0"></div>
    </>
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-200">
      <i className="fa fa-image text-primary text-3xl"></i>
    </div>
  )}
  {/* Title on hover */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <div className="absolute inset-x-0 bottom-0 origin-bottom-left -skew-y-2 bg-black/60 py-2 px-3">
      <h3 className="text-white text-sm md:text-base font-semibold line-clamp-2">{item.title}</h3>
    </div>
  </div>
</div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center mt-5">
        <div className="flex space-x-2">
          <button
            onClick={prevSlide}
            className="w-10 h-10 bg-primary border border-neutral-200 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm"
          >
            <i className="fa fa-chevron-left text-sm text-white"></i>
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 bg-primary border border-neutral-200 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm"
          >
            <i className="fa fa-chevron-right text-sm text-white"></i>
          </button>
        </div>
      </div>
    </section>
  )
}

export default ImageGallery
