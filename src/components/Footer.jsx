import { Link } from "react-router-dom";
import logo from "../image/logo.png";
const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-white">
      <div
        className="bg-primary py-6 mt-40 px-4 rounded-t-2xl relative"
        style={{
          width: "75%",
          bottom: "62px",
          left: "13%",
          position: "relative",
        }}
      >
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {/* Address */}
            <div className="flex items-center justify-start gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <i className="fa fa-map-marker-alt text-white text-xs sm:text-lg"></i>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-white opacity-90">
                  Address
                </p>
                <p className="text-white font-bold text-sm sm:text-base">
                  D-61 HastinaPur, Meerut
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center justify-start gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <i className="fa fa-envelope text-white text-xs sm:text-lg"></i>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-white opacity-90">
                  Send Email
                </p>
                <p className="text-white font-bold text-sm sm:text-base">
                  bhartifreelimbs@gmail.com
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-start gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <i className="fa fa-phone text-white text-xs sm:text-lg"></i>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-white opacity-90">
                  Call Emergency
                </p>
                <p className="text-white font-bold text-sm sm:text-base">
                  +91 8273851800
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-neutral-800 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: About Section */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8flex items-center justify-center mr-3">
                  <img
                    src={logo}
                    alt="logo"
                    className="max-w-full max-h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <span className="text-xl font-bold text-white">
                  BhartiFreeLimbs
                </span>
              </div>
              <p className="text-white mb-6 text-sm leading-relaxed">
                BHARTI FREE LIMBS is dedicated to serving the needy by providing
                free prosthetic limbs, homeless shelters, and animal rescue
                services across India. With 18 charitable centers, we offer 100%
                free support to amputees, the destitute, and injured wildlife,
                empowering lives and promoting dignity and care for all.
              </p>
              {/* <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-10 h-10 border border-neutral-600 rounded flex items-center justify-center hover:bg-primary hover:border-primary transition-colors"
                >
                  <i className="fab fa-facebook-f text-white"></i>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 border border-neutral-600 rounded flex items-center justify-center hover:bg-primary hover:border-primary transition-colors"
                >
                  <i className="fab fa-twitter text-white"></i>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 border border-neutral-600 rounded flex items-center justify-center hover:bg-primary hover:border-primary transition-colors"
                >
                  <i className="fab fa-linkedin-in text-white"></i>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 border border-neutral-600 rounded flex items-center justify-center hover:bg-primary hover:border-primary transition-colors"
                >
                  <i className="fab fa-youtube text-white"></i>
                </a>
              </div> */}
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 relative">
                Quick Links
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-primary"></div>
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/about"
                    className="text-white hover:text-white transition-colors flex items-center"
                  >
                    <i className="fa fa-angle-double-right text-white mr-2 text-sm"></i>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="text-white hover:text-white transition-colors flex items-center"
                  >
                    <i className="fa fa-angle-double-right text-white mr-2 text-sm"></i>
                    Our Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-white hover:text-white transition-colors flex items-center"
                  >
                    <i className="fa fa-angle-double-right text-white mr-2 text-sm"></i>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Recent Posts */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 relative">
                Our Mission
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-primary"></div>
              </h3>
              <div className="space-y-4">
                <p className="text-white text-sm">
                  To provide 100% free prosthetic support, rehabilitation, and
                  shelters for those in need, ensuring dignity and care for all
                  beneficiaries.
                </p>
                <p className="text-white text-sm">
                  We strive to create an inclusive society where every
                  differently-abled individual can live independently.
                </p>
              </div>
            </div>

            {/* Column 4: Contact Us */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 relative">
                Contact Us
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-primary"></div>
              </h3>
              <div className="space-y-4">
                {/* <div className="flex items-center text-white">
                  <i className="fa fa-envelope mr-3"></i>
                  <span className="text-sm">bhartifreelimbs@gmail.com</span>
                </div>
                <div className="flex items-center text-white">
                  <i className="fa fa-phone mr-3"></i>
                  <span className="text-sm">+91 8273851800</span>
                </div> */}

                {/* Email Subscription */}
                <div className="mt-6">
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Your Email Address"
                      className="flex-1 px-3 py-2 bg-white text-neutral-800 rounded-l text-sm focus:outline-none"
                    />
                    <button className="w-12 h-10 bg-primary rounded-r flex items-center justify-center hover:bg-primary-600 transition-colors">
                      <i className="fa fa-arrow-right text-white"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Orange Bar */}
      <div className="bg-primary py-4 px-4 rounded-b-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-white text-sm mb-2 md:mb-0">
            © 2025 BhartiFreeLimbs. All rights reserved
          </p>
          <p className="text-gray-300 text-xs mb-2 md:mb-0">
            Powered by www.hostscaller.com
          </p>

          <div className="flex space-x-6">
            <a
              href="#"
              className="text-white text-sm hover:text-neutral-200 transition-colors"
            >
              Terms & Conditions
            </a>
            <a
              href="#"
              className="text-white text-sm hover:text-neutral-200 transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
