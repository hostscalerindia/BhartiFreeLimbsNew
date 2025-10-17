import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { DataProvider } from './context/DataContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import ServiceDetails from './pages/ServiceDetails'
import Contact from './pages/Contact'
import AllEvents from './pages/AllEvents'
import AllAnnouncements from './pages/AllAnnouncements'
import AnnouncementDetails from './pages/AnnouncementDetails'
import GalleryDetails from './pages/GalleryDetails'
import CenterDetails from './pages/CenterDetails'
import AdminLogin from './AdminPanel/AdminLogin'
import AdminPanel from './AdminPanel/AdminPanel'
import ProtectedRoute from './AdminPanel/ProtectedRoute'
import Footer from './components/Footer'

function App() {
  const [isTopBarVisible, setIsTopBarVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      
      
      if (scrollTop > lastScrollY && scrollTop > 100) {
        setIsTopBarVisible(false)
      } else {
        setIsTopBarVisible(true)
      }
      
      setLastScrollY(scrollTop)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Scroll to top on route change
  useEffect(() => {
    // Smooth scroll to top on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
    }, [location.pathname])

  // Check if current route is admin route
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <DataProvider>
      <div className="min-h-screen bg-body font-manrope">
        {!isAdminRoute && <Navbar />}
        <main className={`transition-all duration-500 ease-out ${isAdminRoute ? 'pt-0' : (isTopBarVisible ? 'pt-0' : 'pt-12')}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/service/:id" element={<ServiceDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/all-events" element={<AllEvents />} />
            <Route path="/announcements" element={<AllAnnouncements />} />
            <Route path="/announcements/:id" element={<AnnouncementDetails />} />
            <Route path="/gallery/:id" element={<GalleryDetails />} />
            <Route path="/center/:id" element={<CenterDetails />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        {!isAdminRoute && <Footer />}
      </div>
    </DataProvider>
  )
}

export default App
