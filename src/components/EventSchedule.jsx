import React, { useState } from "react";
import { Link } from "react-router-dom";
import aboutVector1 from "../image/about-img-vector-1.svg";
import aboutVector2 from "../image/about-img-vector-2.svg";
import ourmission from "../image/ourmission.webp"
import homeless from "../image/homeless.jpg"
import distrilimb from "../image/distrilimb.jpg"

const EventSchedule = () => {
  const [activeTab, setActiveTab] = useState("history");

  const tabData = {
  mission: {
    title: "Our Mission",
    image: ourmission, // use imported image
    content:
      "Our mission is to serve the differently-abled, the homeless, and injured wildlife by providing free prosthetic limbs, shelters, and rescue care. We strive to empower communities and improve lives through compassion and dedicated service.",
  },
  vision: {
    title: "Our Vision",
    image: homeless, // assigned imported image for vision
    content:
      "We envision a world where every individual has access to essential support and opportunities, regardless of circumstance. Our vision is to create inclusive communities where care, dignity, and independence are guaranteed for all.",
  },
  history: {
    title: "Our History",
    image: distrilimb, // assigned imported image for history
    content:
      "Since our founding in 2022, we have grown from a local initiative to a nationwide organization, establishing 18 charitable centers across India. We have provided thousands of prosthetic limbs, rescued animals, and supported countless underprivileged families along the way.",
  },
};

  const tabs = [
    { id: "mission", label: "Our Mission" },
    { id: "vision", label: "Our Vision" },
    { id: "history", label: "Our History" },
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

        {/* Abstract Orange Lines */}
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 opacity-30">
          <div className="w-32 h-64 bg-primary rounded-l-full transform rotate-12"></div>
        </div>
        <div className="absolute bottom-1/4 right-8 opacity-20">
          <div className="w-24 h-48 bg-primary rounded-l-full transform -rotate-12"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
            {/* Left Side - Title */}
            <div className="mb-8 lg:mb-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                Charitics Information of Event{" "}
                <br className="hidden md:block" /> Schedule
              </h1>
            </div>

            {/* Right Side - Donate Now Button */}
            {/* <Link to="/donate">
              <button className="bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center transform hover:scale-105 shadow-lg hover:shadow-xl">
                <i className="fa fa-arrow-right mr-2"></i>
                <i className="fa fa-arrow-right mr-2"></i>
                Donate Now
              </button>
            </Link> */}
          </div>

          {/* Main Content Card */}
          <div
            className="bg-white rounded-3xl shadow-2xl overflow-hidden p-6 lg:p-8"
            style={{ animation: "fadeInUp 0.8s ease-out 0.3s both" }}
          >
            {/* Navigation Tabs */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-16 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-lg font-medium transition-all duration-300 relative px-6 py-2 ${
                    activeTab === tab.id
                      ? "text-primary"
                      : "text-neutral-600 hover:text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Indicator Line */}
            <div className="w-full h-px bg-neutral-200 mb-6 relative">
              <div
                className="absolute top-0 h-full bg-primary transition-all duration-300"
                style={{
                  width: "33.33%",
                  left:
                    activeTab === "mission"
                      ? "0%"
                      : activeTab === "vision"
                      ? "33.33%"
                      : "66.66%",
                }}
              ></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Left Side - Dynamic Image */}
              <div className="relative">
                <img
                  src={tabData[activeTab].image}
                  alt={tabData[activeTab].title}
                  className="w-full h-auto object-cover rounded-2xl shadow-lg transition-all duration-300"
                />
              </div>

              {/* Right Side - Dynamic Content */}
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-primary leading-tight">
                  {tabData[activeTab].title}
                </h2>
                <p className="text-neutral-600 text-lg leading-relaxed">
                  {tabData[activeTab].content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EventSchedule;
