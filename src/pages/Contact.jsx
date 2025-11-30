import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div>
      {/* Hero Section */}
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

        <div className="max-w-7xl mx-auto px-4 mt-20 sm:px-6 lg:px-8 text-center relative z-10">

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-snug">
            Contact Us
          </h1>
          <p className="text-xs sm:text-sm md:text-base mb-6 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Get in touch with us. We're here to help and answer any questions
            you may have.
          </p>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              {/* Contact Form */}
              <div>
                {/* Header for the form */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-3">
                      <i className="fa fa-heart text-white text-sm"></i>
                    </div>
                    <span className="text-primary text-sm md:text-2xl font-medium">
                      Contact us
                    </span>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="sr-only">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="sr-only">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="sr-only">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="sr-only">
                      Type your message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      placeholder="Type your message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 resize-y"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <span className="mr-2">&gt;&gt;</span>
                    Get in Touch
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-[#fbf9e4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-3">
                <i className="fa fa-map-marker-alt text-white text-sm"></i>
              </div>
              <span className="text-primary text-sm md:text-2xl font-medium">
                Find Us
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 mb-4 leading-tight">
              Visit Our Office
            </h2>
            <p className="text-xs md:text-sm text-neutral-600">
              Visit our office or find us on the map
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg h-96 overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3525.196306424407!2d77.70455687507573!3d28.984461075564353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390c6515efb0c6ad%3A0xd0812f76a7b5c8df!2sMeerut%2C%20Uttar%20Pradesh%2C%20India!5e0!3m2!1sen!2sin!4v1730024349923!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bharti Free Limbs - Meerut, India"
            ></iframe>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Contact;
