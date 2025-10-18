// import { NavLink, Link } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { useData } from "../context/DataContext";

// function Navbar() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isTopBarVisible, setIsTopBarVisible] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);
//   const { announcements, loading, errors } = useData();

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = window.scrollY;
//       setIsScrolled(scrollTop > 50);
//       if (scrollTop > lastScrollY && scrollTop > 100) {
//         setIsTopBarVisible(false);
//       } else {
//         setIsTopBarVisible(true);
//       }
//       setLastScrollY(scrollTop);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [lastScrollY]);

//   const navItems = [
//     { path: "/", label: "Home", icon: "fa-home" },
//     { path: "/about", label: "About", icon: "fa-info-circle" },
//     { path: "/announcements", label: "Announcements", icon: "fa-newspaper" },
//     { path: "/contact", label: "Contact", icon: "fa-envelope" },
//   ];

//   return (
//     <>
//       {/* Mobile Toggle Button */}
//       <div className="fixed top-4 left-4 z-50 lg:hidden">
//         <button
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//           className="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-600 transition-all duration-300"
//         >
//           {isMenuOpen ? (
//             <i className="fa fa-times text-lg"></i>
//           ) : (
//             <i className="fa fa-bars text-lg"></i>
//           )}
//         </button>
//       </div>

//       {/* Mobile Menu Overlay */}
//       {isMenuOpen && (
//         <div className="fixed inset-0 z-40 lg:hidden">
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50"
//             onClick={() => setIsMenuOpen(false)}
//           ></div>
//           <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
//             <div className="p-6 overflow-y-auto h-full">
//               <div className="flex items-center justify-between mb-8">
//                 <div className="flex items-center">
//                   <div className="w-8 h-8 bg-primary rounded flex items-center justify-center mr-3">
//                     <span className="text-white font-bold text-sm">L</span>
//                   </div>
//                   <h1 className="text-xl font-bold text-neutral-800">
//                     BhartiFreeLimbs
//                   </h1>
//                 </div>
//                 <button
//                   onClick={() => setIsMenuOpen(false)}
//                   className="p-2 rounded-lg text-neutral-600 hover:text-primary hover:bg-primary-50"
//                 >
//                   <i className="fa fa-times"></i>
//                 </button>
//               </div>

//               {/* Mobile Navigation Links */}
//               <div className="space-y-2">
//                 {navItems.map((item) => (
//                   <NavLink
//                     key={item.path}
//                     to={item.path}
//                     end={item.path === "/"}
//                     className={({ isActive }) =>
//                       `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 flex items-center ${
//                         isActive
//                           ? "bg-primary-100 text-primary"
//                           : "text-neutral-600 hover:text-primary hover:bg-primary-50"
//                       }`
//                     }
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     <i className={`fa ${item.icon} mr-3`}></i>
//                     {item.label}
//                   </NavLink>
//                 ))}
//               </div>

//               {/* Donate Button */}
//               <div className="mt-8">
//                 <Link to="/donate">
//                   <button className="w-full bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center">
//                     Donate Now
//                     <i className="fa fa-arrow-right ml-2"></i>
//                   </button>
//                 </Link>
//               </div>

//               {/* Contact Info */}
//               <div className="mt-8 pt-6 border-t border-neutral-200 text-sm text-neutral-600 space-y-3">
//                 <div className="flex items-center">
//                   <i className="fa fa-phone mr-3 w-4"></i>
//                   +91-294-6622222
//                 </div>
//                 <div className="flex items-center">
//                   <i className="fab fa-whatsapp mr-3 w-4"></i>
//                   +91-7023509999
//                 </div>
//                 <div className="flex items-center">
//                   <i className="fa fa-envelope mr-3 w-4"></i>
//                   info@bhartifreelimbs.org
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Desktop Navigation */}
//       <div className="hidden lg:block fixed top-0 left-0 right-0 z-50">
//         {/* Top Bar */}
//         <div
//           className={`${
//             isScrolled ? "bg-neutral-800" : "bg-primary"
//           } text-white transition-all duration-500 ease-out ${
//             isTopBarVisible
//               ? "opacity-100 py-2 px-4"
//               : "opacity-0 py-0 px-4 h-0 overflow-hidden"
//           }`}
//         >
//           <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-2">
//             <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
//               <span className="flex items-center">
//                 <i className="fa fa-phone mr-2"></i>+91-294-6622222
//               </span>
//               <span className="flex items-center">
//                 <i className="fab fa-whatsapp mr-2"></i>+91-7023509999
//               </span>
//               <span className="flex items-center">
//                 <i className="fa fa-envelope mr-2"></i>info@bhartifreelimbs.org
//               </span>
//             </div>
//             <div className="flex items-center gap-3">
//               <span className="text-sm mr-1">Follow us:</span>
//               {["facebook-f", "twitter", "linkedin-in", "instagram"].map(
//                 (icon) => (
//                   <a
//                     key={icon}
//                     href="#"
//                     className="text-white hover:text-primary-300 transition-colors"
//                   >
//                     <i className={`fab fa-${icon}`}></i>
//                   </a>
//                 )
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Announcement Ticker */}
//         {announcements && announcements.length > 0 && (
//           <div className="bg-[#fbf9e4] border-b border-yellow-300 text-yellow-900">
//             <div className="max-w-7xl mx-auto px-4 flex items-center h-8 overflow-hidden relative">
//               <i className="fa fa-bullhorn mr-3 text-yellow-700 z-10"></i>
//               <div className="flex w-full overflow-hidden relative">
//                 <div className="flex animate-marquee gap-16">
//                   {[...announcements, ...announcements].map((item, i) => (
//                     <Link
//                       key={i}
//                       to={`/announcements/${item.id}`}
//                       className="text-sm font-medium flex-shrink-0 hover:underline hover:text-yellow-700 transition-colors"
//                     >
//                       {item.title}
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <style>{`
//       .animate-marquee {
//         display: flex;
//         gap: 4rem;
//         white-space: nowrap;
//         animation: marquee 20s linear infinite;
//       }

//       @keyframes marquee {
//         0% { transform: translateX(100%); }
//         100% { transform: translateX(-100%); }
//       }
//     `}</style>
//           </div>
//         )}

//         {/* Main Navbar */}
//         <nav
//           className={`${
//             isScrolled ? "bg-white shadow-lg" : "bg-transparent"
//           } transition-all duration-500 ease-out`}
//         >
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex justify-between items-center h-16">
//               {/* Logo */}
//               <Link to="/" className="flex items-center">
//                 <div className="w-8 h-8 bg-primary rounded flex items-center justify-center mr-3">
//                   <span className="text-white font-bold text-sm">L</span>
//                 </div>
//                 <h1 className="text-xl font-bold">
//                   <span
//                     className={isScrolled ? "text-neutral-800" : "text-white"}
//                   >
//                     BhartiFreeLimbs
//                   </span>
//                 </h1>
//               </Link>

//               {/* Navigation Links */}
//               <div className="flex items-center space-x-1">
//                 {navItems.map((item) => (
//                   <NavLink
//                     key={item.path}
//                     to={item.path}
//                     end={item.path === "/"}
//                     className={({ isActive }) =>
//                       `px-4 py-2 rounded-full text-sm font-medium transition-all duration-500 ease-out flex items-center ${
//                         isActive
//                           ? "bg-primary-100 text-primary"
//                           : `${
//                               isScrolled
//                                 ? "text-neutral-600 hover:text-primary hover:bg-primary-50"
//                                 : "text-white hover:bg-white hover:bg-opacity-10"
//                             }`
//                       }`
//                     }
//                   >
//                     <i className={`fa ${item.icon} mr-2`}></i>
//                     {item.label}
//                   </NavLink>
//                 ))}
//               </div>

//               {/* Donate Button */}
//               <Link to="/contact">
//                 <button className="bg-primary hover:bg-primary-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-500 ease-out flex items-center">
//                   Donate Now
//                   <i className="fa fa-arrow-right ml-2"></i>
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </nav>
//       </div>
//     </>
//   );
// }

// export default Navbar;

import { NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import logo from "../image/logo.png";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTopBarVisible, setIsTopBarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { announcements } = useData();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
      if (scrollTop > lastScrollY && scrollTop > 100) {
        setIsTopBarVisible(false);
      } else {
        setIsTopBarVisible(true);
      }
      setLastScrollY(scrollTop);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { path: "/", label: "Home", icon: "fa-home" },
    { path: "/about", label: "About", icon: "fa-info-circle" },
    { path: "/announcements", label: "Announcements", icon: "fa-newspaper" },
    { path: "/contact", label: "Contact", icon: "fa-envelope" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      {!isMenuOpen && (
        <div className="fixed top-4 right-4 z-[1001] lg:hidden">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-primary text-lg transition-colors duration-300 hover:text-primary/70"
          >
            <i className="fa fa-bars"></i>
          </button>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[1000] lg:hidden transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setIsMenuOpen(false)}
        ></div>
        <div className="absolute top-0 right-0 h-full w-72 bg-white p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center mr-3">
                <img
                  src={logo}
                  alt="logo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <h1 className="text-xl font-bold text-neutral-800">
                BhartiFreeLimbs
              </h1>
            </div>
            {/* Inside close button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-neutral-600 hover:text-primary transition-colors duration-300"
            >
              <i className="fa fa-times text-lg"></i>
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 flex items-center ${
                    isActive
                      ? "bg-primary-100 text-primary"
                      : "text-neutral-600 hover:text-primary hover:bg-primary-50"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <i className={`fa ${item.icon} mr-3`}></i>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Donate Button */}
          <div className="mt-8">
            <Link to="/contact">
              <button className="w-full bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center">
                Donate Now
                <i className="fa fa-arrow-right ml-2"></i>
              </button>
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-neutral-200 text-sm text-neutral-600 space-y-3">
            <div className="flex items-center">
              <i className="fa fa-phone mr-3 w-4"></i>
              +91-294-6622222
            </div>
            <div className="flex items-center">
              <i className="fab fa-whatsapp mr-3 w-4"></i>
              +91-7023509999
            </div>
            <div className="flex items-center">
              <i className="fa fa-envelope mr-3 w-4"></i>
              info@bhartifreelimbs.org
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <nav className="transition-all duration-500 ease-out bg-white sm:mx-10">
          <div className="max-w-7xl mx-2">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center mr-3">
                  <img
                    src={logo}
                    alt="logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <h1 className="text-xl font-bold text-neutral-800">
                  BhartiFreeLimbs
                </h1>
              </Link>

              {/* Navigation Links */}
              <div className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-full text-sm font-medium transition-all duration-500 ease-out flex items-center ${
                        isActive
                          ? "bg-primary-100 text-primary"
                          : "text-neutral-700 hover:text-primary hover:bg-primary-50"
                      }`
                    }
                  >
                    <i className={`fa ${item.icon} mr-2`}></i>
                    {item.label}
                  </NavLink>
                ))}
              </div>

              {/* Donate Button */}
              <Link to="/contact" className="hidden lg:block">
                <button className="bg-primary hover:bg-primary-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-500 ease-out flex items-center">
                  Donate Now
                  <i className="fa fa-arrow-right ml-2"></i>
                </button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Announcement Ticker */}
        {announcements && announcements.length > 0 && (
          <div className="bg-[#fbf9e4] border-t border-yellow-300 text-yellow-900">
            <div className="max-w-7xl mx-auto px-4 flex items-center h-8 overflow-hidden relative lg:px-[58px]">
              <i className="fa fa-bullhorn mr-3 text-yellow-700 z-10"></i>
              <div className="w-full overflow-hidden">
                <div className="flex animate-marquee hover:pause-marquee">
                  {[...announcements, ...announcements].map((item, i) => (
                    <Link
                      key={i}
                      to={`/announcements/${item.id}`}
                      className="text-sm font-medium flex-shrink-0 mr-16 hover:underline hover:text-yellow-700 transition-colors"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <style>{`
              .animate-marquee {
                display: inline-flex;
                gap: 4rem;
                white-space: nowrap;
                animation: marquee 20s linear infinite;
              }

              .hover\\:pause-marquee:hover {
                animation-play-state: paused;
              }

              @keyframes marquee {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
              }
            `}</style>
          </div>
        )}
      </div>
    </>
  );
}

export default Navbar;
