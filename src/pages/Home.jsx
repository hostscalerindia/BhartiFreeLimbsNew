import HomeBanner from '../components/HomeBanner'
import ImageGallery from '../components/ImageGallery'
import Services from '../components/Services'
import VolunteerDonation from '../components/VolunteerDonation'
import Announcements from '../components/Announcements'
import DonationHero from '../components/DonationHero'
import unity from '../image/unity.jpg'

const Home = () => {
  return (
    <div>
      <HomeBanner />
      <Services />
      <ImageGallery />
      <DonationHero
        backgroundImage={unity}
        tagline="Start Donating Poor People"
        title="Children Need Your Help By Donating Today"
        height="h-[80vh]"
        showWavyBorder={true}
        overlayOpacity="bg-opacity-60"
      />
      <Announcements />
      <VolunteerDonation />

    </div>
  )
}

export default Home
