import heartShapeImage from "../image/heart-shape-image.png";
// import aboutVector1 from "../image/about-img-vector-1.svg";
// import aboutVector2 from "../image/about-img-vector-2.svg";
import DonationHero from "../components/DonationHero";
// import Statistics from "../components/Statistics";
import EventSchedule from "../components/EventSchedule";
import Team from "../components/Team";
import hand from "../image/hands.jpg"
import InfoSection from "../components/InfoSection";

const About = () => {
  return (
    <div>
      <section className="bg-section-second text-white py-5 relative overflow-hidden">
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
        {/* <div className="absolute top-6 left-6 opacity-20">
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
        </div> */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-snug">
            Making a Difference Together
          </h1>
          <p className="text-xs sm:text-sm md:text-base mb-6 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Discover how Bharti Free Limbs transforms lives by providing free
            prosthetic limbs, shelters, and animal rescue services across India,
            empowering the needy with dignity and care.
          </p>
        </div>
      </section>

      <section className=" bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Section - Heart Shape Image */}
            <div className="relative">
              <img
                src={heartShapeImage}
                alt="Heart shape with donation images and experience text"
                className="w-full h-auto object-contain bg-transparent"
              />
            </div>

            {/* Right Section - Content */}
            <div className="space-y-8">
              {/* About Us Header
              <div className="flex items-center mb-6">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-3">
                  <i className="fa fa-heart text-white text-sm"></i>
                </div>
                <span className="text-primary text-sm md:text-2xl font-medium">
                  About Us
                </span>
              </div> */}

              {/* Main Heading */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 leading-tight">
                Serving the Needy with Compassion and Care
              </h2>

              {/* Description */}
              <p className="text-neutral-600 text-xs md:text-sm leading-relaxed">
                Bharti Free Limbs is dedicated to transforming lives across
                India by providing free prosthetic limbs, shelters for the
                homeless, and rescue services for injured animals. Our 18
                charitable centers empower communities, restore dignity, and
                create a lasting impact through compassionate service.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Vector Elements */}
        {/* <div className="absolute bottom-8 left-8 opacity-20">
          <img
            src={aboutVector1}
            alt="Decorative vector"
            className="w-48 h-24 object-contain"
          />
        </div>
        <div className="absolute bottom-8 right-8 opacity-20">
          <img
            src={aboutVector2}
            alt="Decorative vector hearts"
            className="w-24 h-24 object-contain"
          />
        </div> */}
      </section>

      <InfoSection/>

      {/* 
      <DonationHero
        backgroundImage={hand}
        tagline="Empowering Lives"
        title="Your Support Helps Provide Free Services and Shelter to the Needy"
        height="h-[70vh]"
        showWavyBorder={true}
        overlayOpacity="bg-opacity-50"
      /> */}

      {/* <Statistics /> */}
      {/* <EventSchedule /> */}
      <Team />
    </div>
  );
};

export default About;
