import React, { useState } from "react";
import aboutVector1 from "../image/about-img-vector-1.svg";
import aboutVector2 from "../image/about-img-vector-2.svg";
import fooddistribution from "../image/fooddistribution.jpg"
import blanket from "../image/blanket.jpg"
import limbs from "../image/limbs.jpg"
import bags from "../image/bags.jpg"

const Statistics = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

 const statisticsData = [
  {
    id: 1,
    icon: "fa-utensils",
    number: "350+",
    label: "Total Food Distributed",
    hoverImage: fooddistribution, // use imported image here
    stars: true,
  },
  {
    id: 2,
    icon: "fa-hands-helping",
    number: "4000+",
    label: "Total Blankets Given",
    hoverImage: blanket, // use imported image here
  },
  {
    id: 3,
    icon: "fa-hands-helping",
    number: "2000+",
    label: "Artificial Limbs Provided",
    hoverImage: limbs, // use imported image here
  },
  {
    id: 4,
    icon: "fa-bed",
    number: "3000+",
    label: "Sleeping Bags Distributed",
    hoverImage: bags, // use imported image here
  },
];

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

        .stat-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stat-card:hover {
          transform: scale(1.08);
        }

        .hover-image {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .default-content {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <section className="py-16 bg-section-second relative overflow-hidden">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Statistics Cards */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            {statisticsData.map((stat, index) => (
              <div
                key={stat.id}
                className="stat-card relative flex-shrink-0"
                style={{
                  animation: `fadeInUp 0.8s ease-out ${index * 0.15}s both`,
                }}
                onMouseEnter={() => setHoveredCard(stat.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="w-56 h-56 bg-neutral-700 rounded-full border-2 border-white border-opacity-20 overflow-hidden relative">
                  {/* Hover Image */}
                  {hoveredCard === stat.id && (
                    <div className="absolute inset-0 hover-image">
                      <img
                        src={stat.hoverImage}
                        alt={stat.label}
                        className="w-full h-full object-cover transform scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                    </div>
                  )}

                  {/* Default Content */}
                  <div
                    className={`default-content absolute inset-0 flex flex-col items-center justify-center text-white ${
                      hoveredCard === stat.id
                        ? "opacity-0 scale-95"
                        : "opacity-100 scale-100"
                    }`}
                  >
                    {/* Stars (only for first card) */}
                    {stat.stars && (
                      <div className="flex space-x-1 mb-2">
                        <i className="fa fa-star text-white text-sm"></i>
                        <i className="fa fa-star text-white text-sm"></i>
                        <i className="fa fa-star text-white text-sm"></i>
                      </div>
                    )}

                    {/* Icon */}
                    <div className="mb-3">
                      <i className={`fa ${stat.icon} text-white text-3xl`}></i>
                    </div>

                    {/* Number */}
                    <div className="font-bold mb-2 text-3xl">{stat.number}</div>

                    {/* Label */}
                    <div className="text-sm text-center px-4">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Statistics;
