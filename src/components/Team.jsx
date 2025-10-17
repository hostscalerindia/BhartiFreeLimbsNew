import React, { useState } from "react";
import { useData } from "../context/DataContext";

const Team = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const { teamMembers, services } = useData();

  // Map dynamic data to the structure needed
  const mappedTeamMembers = teamMembers?.map((member) => ({
    id: member.id,
    name: member.name,
    title: member.designation,
    image: member.image,
    socialIcons: [
      member.facebook
        ? { icon: "fab fa-facebook-f", link: member.facebook }
        : null,
      member.twitter ? { icon: "fab fa-twitter", link: member.twitter } : null,
      member.instagram
        ? { icon: "fab fa-instagram", link: member.instagram }
        : null,
    ].filter(Boolean),
  }));

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-center items-start lg:items-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 leading-tight mb-6 lg:mb-0">
            Making a Difference Together
          </h2>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mappedTeamMembers?.map((member, idx) => (
            <div
              key={member.id}
              className="relative group cursor-pointer transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl"
              onMouseEnter={() => setHoveredCard(member.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
                {/* Image Section with fallback */}
                <div className="relative h-80 overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}

                  {/* Placeholder icon */}
                  <div
                    className={`w-full h-full items-center justify-center ${
                      member.image ? "hidden" : "flex"
                    }`}
                  >
                    <i className="fa fa-user text-blue-600 text-6xl"></i>
                  </div>

                  {/* Social Icons on Hover */}
                  {hoveredCard === member.id &&
                    member.socialIcons.length > 0 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                        {member.socialIcons.map((social, i) => (
                          <a
                            key={i}
                            href={social.link}
                            className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-neutral-600 hover:text-primary hover:scale-110 transition-all shadow-md"
                          >
                            <i className={`${social.icon} text-sm`}></i>
                          </a>
                        ))}
                      </div>
                    )}
                </div>

                {/* Text Section */}
                <div className="bg-primary p-5 text-center transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-orange-600">
                  <h3 className="text-white text-lg font-bold mb-1">
                    {member.name}
                  </h3>
                  <p className="text-white text-sm opacity-90">
                    {member.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
