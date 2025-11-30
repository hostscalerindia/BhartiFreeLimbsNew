import { Link } from 'react-router-dom'
import { allEvents } from '../data/eventsData'

const AllEvents = () => {

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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-20 lg:px-8 text-center relative z-10">
          {/* Back Button */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-primary hover:text-primary-300 transition-colors">
              <i className="fa fa-arrow-left mr-2"></i>
              Back to Home
            </Link>
          </div>
          
          {/* Top Tagline */}
          <div className="mb-6">
            <p className="text-primary text-lg font-medium flex items-center justify-center">
              <i className="fa fa-calendar mr-2"></i>
              All Events
            </p>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-snug">
            All Our Events
          </h1>
          <p className="text-xs sm:text-sm md:text-base mb-6 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Discover all our upcoming events, campaigns, and community initiatives in one place.
          </p>
        </div>
      </section>

      {/* All Events Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Events Grid - 3 columns on large screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allEvents.map((event, index) => (
              <div 
                key={event.id} 
                className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="flex flex-col">
                  {/* Image Section */}
                  <div className="relative h-48">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Date Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium">
                        {event.date}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      {/* Title */}
                      <h3 className="text-lg font-bold text-neutral-800 mb-3 leading-tight">
                        {event.title}
                      </h3>

                      {/* Description */}
                      <p className="text-neutral-600 text-sm mb-4 leading-relaxed">
                        {event.description}
                      </p>

                      {/* Separator Line */}
                      <div className="w-full h-px bg-neutral-200 mb-4"></div>

                      {/* Venue Information */}
                      <div className="mb-4">
                        <p className="text-neutral-500 text-xs mb-1">Venue</p>
                        <p className="text-neutral-800 text-sm font-medium">
                          {event.venue}
                        </p>
                      </div>
                    </div>

                    {/* Event Details Button */}
                    <button className="bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 flex items-center justify-center w-full transform hover:scale-105">
                      <i className="fa fa-arrow-right mr-2"></i>
                      <i className="fa fa-arrow-right mr-2"></i>
                      Event Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default AllEvents
