import React from "react";
// import aboutVector1 from "../image/about-img-vector-1.svg";
// import aboutVector2 from "../image/about-img-vector-2.svg";
import why from "../image/why.jpg";
import wildlifecare from "../image/wildlifecare.jpg";
import prostheticlimb from "../image/prostheticlimb.jpg";
import blanket from "../image/blanket.jpg";
const InfoSection = () => {
    const sections = [
        {
            title: "Our Why",
            description:
                "At BHARTI FREE LIMBS, we believe that compassion and care have the power to transform lives. Our mission is rooted in serving humanity — to reach out to those who are often left behind, including amputees, the homeless, and injured wildlife. We envision a world where everyone, regardless of their background or circumstance, can live with dignity, self-respect, and independence. Every initiative we undertake is a step toward creating a kinder and more inclusive society built on empathy and service.",
            image: why,
        },
        {
            title: "Prosthetic & Homeless Services",
            description:
                "Through our network of charitable centers across India, BHARTI FREE LIMBS provides 100% free prosthetic limbs to those who have lost theirs due to accidents or illness. These limbs not only restore mobility but also give individuals a renewed sense of confidence and purpose. Alongside this, we run permanent homeless shelters offering food, comfort, and a safe space for those who have nowhere else to go. Each home represents hope — a place where people can rebuild their lives with love, care, and support.",
            image: prostheticlimb,
        },
        {
            title: "Animal & Wildlife Care",
            description:
                "Our commitment extends beyond humans — we also work tirelessly to protect and care for animals. From rescuing injured wild birds and animals to creating dedicated shelters, our aim is to give every creature a chance to heal and thrive. We have also established water ponds with hand pumps in forest areas to ensure wildlife has access to clean drinking water during extreme weather. Every act of kindness toward animals brings us closer to preserving the natural balance of life on Earth.",
            image: wildlifecare,
        },
        {
            title: "Community Support & Donations",
            description:
                "We actively organize donation drives that distribute free wheelchairs, sleeping bags, shoes, and other essential supplies to those in need. Our free food stalls in various cities provide nutritious meals to the poor and hungry every day. Beyond these initiatives, we extend help to Swamis and spiritual seekers living in remote jungles, ensuring they have the basic necessities to continue their sacred journeys. Every small act of generosity helps us strengthen our mission of humanity, unity, and service to all living beings.",
            image: blanket,
        },
    ];



    return (

        <section className=" text-white py-5 relative overflow-hidden">
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20  relative z-10">
                <div className="w-full flex flex-col gap-40">
                    {sections.map((item, index) => (
                        <div
                            key={index}
                            className={`flex flex-col lg:flex-row items-center justify-between gap-8 ${index % 2 === 0 ? "lg:flex-row-reverse" : ""
                                }`}
                        >
                            {/* Image */}
                            <div className="lg:w-1/2 w-full">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-[400px] object-cover rounded-2xl shadow-md"
                                />
                            </div>

                            {/* Content */}
                            <div className="lg:w-1/2 w-full flex flex-col gap-4">
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 leading-tight">
                                    {item.title}
                                </h2>
                                <p className="text-neutral-600 text-sm md:text-base leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </section>


    );
};

export default InfoSection;
