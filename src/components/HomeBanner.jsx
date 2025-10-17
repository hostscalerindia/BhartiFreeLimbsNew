import bannerImg from '../image/banner-img.png'
import vectorImg from '../image/vector-img.png'

const HomeBanner = () => {
  return (
    <section className="relative flex flex-col lg:flex-row bg-section-second">
      {/* Left Section - Text */}
      <div className="w-full lg:w-1/2 relative">
        {/* Desktop text */}
        <div className="hidden lg:flex relative z-10 p-12 flex-col justify-center h-full">
          <div className="mb-6">
            <p className="text-yellow-100 text-2xl font-medium flex items-center">
              <i className="fa fa-heart mr-2"></i>
              Charitable Services
            </p>
          </div>

          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Serving the Needy with Dignity & Care
          </h1>

          <p className="text-white text-sm mb-8 opacity-90 leading-relaxed">
            From free prosthetic limbs and homeless shelters to animal rescue and community support, Bharti Free Limbs transforms lives across India.
          </p>

          <div className="absolute bottom-0 left-8 w-50 h-50">
            <img
              src={vectorImg}
              alt="Hands illustration"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Mobile text overlay */}
        <div className="lg:hidden absolute inset-0 z-10 flex flex-col justify-center items-center text-center bg-black/30 p-6">
          <div className="mt-[28rem] md:mt-0">
            <p className="text-yellow-100 text-sm font-medium flex items-center justify-center">
              <i className="fa fa-heart mr-2"></i>
              Charitable Services
            </p>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4 leading-snug">
            Serving the Needy with Dignity & Care
          </h1>

          <p className="text-white text-xs mb-6 opacity-90 leading-relaxed">
            From free prosthetic limbs and homeless shelters to animal rescue and community support, Bharti Free Limbs transforms lives across India.
          </p>

          <div className="absolute bottom-4 left-4 w-20 h-20">
            <img
              src={vectorImg}
              alt="Hands illustration"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="w-full lg:w-1/2 relative">
        <img
          src={bannerImg}
          alt="Woman in orange head covering"
          className="w-full h-auto object-cover"
        />
      </div>
    </section>
  )
}

export default HomeBanner
