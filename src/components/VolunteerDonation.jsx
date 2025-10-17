import React, { useState } from 'react'
import children from '../image/children.jpg'

const VolunteerDonation = () => {
  const [selectedAmount, setSelectedAmount] = useState(40)
  const [customAmount, setCustomAmount] = useState(40)
  const donationAmounts = [10, 20, 30, 40, 50]

  return (
    <section className="py-8 bg-white">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[400px]">

          {/* Left Section - Become A Volunteer */}
          <div className="volunteer-section bg-primary relative overflow-hidden">
            {/* Background Vector Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
              <div className="absolute top-20 right-16 w-16 h-16 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-20 left-20 w-24 h-24 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-18 h-18 border-2 border-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/4 w-12 h-12 border-2 border-white rounded-full"></div>
              <div className="absolute top-1/3 right-1/3 w-14 h-14 border-2 border-white rounded-full"></div>
            </div>

            <div className="relative z-10 p-6 lg:p-8 flex flex-col justify-start h-full">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'cursive' }}>
                Become A Volunteer
              </h2>

              <p className="text-white text-xs md:text-sm mb-6 opacity-90 leading-relaxed">
                Dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit The aspernaturaut odit aut fugit, sed quia consequuntur. Nonprofits around the world apply
              </p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-white">
                  <i className="fa fa-check text-white mr-2 text-sm"></i>
                  <span className="text-xs">Donate Money</span>
                </div>
                <div className="flex items-center text-white">
                  <i className="fa fa-check text-white mr-2 text-xs"></i>
                  <span className="text-xs">Handle With Care</span>
                </div>
                <div className="flex items-center text-white">
                  <i className="fa fa-check text-white mr-2 text-xs"></i>
                  <span className="text-xs">Donate Money</span>
                </div>
              </div>

              <button className="volunteer-btn bg-white text-primary px-6 py-3 rounded-full font-semibold text-sm flex items-center justify-center w-fit">
                <i className="fa fa-arrow-right mr-1 text-primary"></i>
                Become A Volunteer
              </button>
            </div>
          </div>

          {/* Right Section - Send a Gift For Children's */}
          <div className="donation-section relative overflow-hidden">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${children})`,
                filter: 'brightness(0.4) contrast(1.2)'
              }}
            ></div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>

            <div className="relative z-10 p-6 lg:p-8 flex flex-col justify-start h-full">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'cursive' }}>
                Send a Gift For Children's
              </h2>

              <p className="text-white text-xs md:text-sm mb-6 opacity-90 leading-relaxed">
                Your small help can spark big change. Even the simplest act of kindness can bring hope, relief, and opportunity to those in need. Join us—because together, our caring efforts create a lasting impact and a brighter future for every life we touch.
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {donationAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`donation-amount-btn px-4 py-2 rounded-full font-semibold text-sm border-2 transition-all duration-300 ${
                      amount === selectedAmount 
                        ? 'selected text-white' 
                        : amount === 50 
                          ? 'blue text-white border-blue-500' 
                          : 'text-white border-white hover:bg-white hover:text-primary'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-full text-sm font-semibold text-neutral-800 bg-white border-2 border-transparent focus:border-primary focus:outline-none"
                  placeholder="Enter custom amount"
                />
              </div>

              <button className="donate-btn bg-primary hover:bg-primary-600 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center justify-center w-fit">
                Donate Now
                <i className="fa fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VolunteerDonation
