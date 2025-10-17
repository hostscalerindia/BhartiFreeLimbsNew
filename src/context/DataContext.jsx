import React, { createContext, useContext, useState, useEffect } from 'react'
import { get } from '../utils/api'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  // All data states
  const [services, setServices] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [galleryItems, setGalleryItems] = useState([])
  const [centers, setCenters] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  
  // Loading states
  const [loading, setLoading] = useState({
    services: true,
    announcements: true,
    galleryItems: true,
    centers: true,
    testimonials: true,
    teamMembers: true
  })
  
  
  // Error states
  const [errors, setErrors] = useState({
    services: null,
    announcements: null,
    galleryItems: null,
    centers: null,
    testimonials: null,
    teamMembers: null
  })
  
  // Data fetch timestamp for cache management
  const [lastFetch, setLastFetch] = useState(null)
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  // Check if data is stale
  const isDataStale = () => {
    if (!lastFetch) return true
    return Date.now() - lastFetch > CACHE_DURATION
  }

  // Fetch all data once - PARALLEL EXECUTION
  const fetchAllData = async () => {
    if (!isDataStale()) {
      console.log('📦 Data is fresh, skipping fetch')
      return
    }
    
    console.log('🚀 Fetching all data in parallel...')
    setLastFetch(Date.now())

    // Set all loading states to true
    setLoading({
      services: true,
      announcements: true,
      galleryItems: true,
      centers: true,
      testimonials: true,
      teamMembers: true
    })

    // Clear all errors
    setErrors({
      services: null,
      announcements: null,
      galleryItems: null,
      centers: null,
      testimonials: null,
      teamMembers: null
    })

    // Execute all API calls in parallel
    const apiCalls = [
      // Services
      get('/api/service-types').then(response => {
        const servicesList = (response.data || []).map((service) => ({
          id: service.id,
          title: service.name,
          description: service.description || "No description available for this service.",
          image: service.image ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/service-types/${service.id}/image` : null
        }))
        setServices(servicesList)
        setLoading(prev => ({ ...prev, services: false }))
        return { type: 'services', success: true }
      }).catch(error => {
        console.error('❌ Error fetching services:', error)
        setErrors(prev => ({ ...prev, services: 'Failed to load services' }))
        setLoading(prev => ({ ...prev, services: false }))
        return { type: 'services', success: false, error }
      }),

      // Announcements
      get('/api/announcements').then(response => {
        const announcementsList = (response.data || []).map((announcement) => ({
          id: announcement.id,
          title: announcement.title,
          content: announcement.content || "No content available for this announcement.",
          category: announcement.category || "General",
          date: new Date(announcement.created_at || announcement.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          author: "By Admin",
          image: announcement.hasImage ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/announcements/${announcement.id}/image` : null,
          excerpt: announcement.content ? announcement.content.substring(0, 100) + '...' : "No description available."
        }))
        setAnnouncements(announcementsList)
        setLoading(prev => ({ ...prev, announcements: false }))
        return { type: 'announcements', success: true }
      }).catch(error => {
        console.error('❌ Error fetching announcements:', error)
        setErrors(prev => ({ ...prev, announcements: 'Failed to load announcements' }))
        setLoading(prev => ({ ...prev, announcements: false }))
        return { type: 'announcements', success: false, error }
      }),

      // Gallery Items
      get('/api/gallery').then(response => {
        const galleryList = (response.data || []).map((item) => ({
          id: item.id,
          title: item.title || `Gallery Item ${item.id}`,
          description: item.description || "No description available.",
          image: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/gallery/${item.id}/image`,
          created_at: item.created_at
        }))
        setGalleryItems(galleryList)
        setLoading(prev => ({ ...prev, galleryItems: false }))
        return { type: 'galleryItems', success: true }
      }).catch(error => {
        console.error('❌ Error fetching gallery items:', error)
        setErrors(prev => ({ ...prev, galleryItems: 'Failed to load gallery items' }))
        setLoading(prev => ({ ...prev, galleryItems: false }))
        return { type: 'galleryItems', success: false, error }
      }),

      // Centers
      get('/api/centers').then(response => {
        const centersList = (response.data || []).map((center) => ({
          id: center.id,
          name: center.name,
          description: center.description || "No description available.",
          location: center.location,
          phone: center.phone_number,
          serviceType: center.service_type_name,
          image: center.image ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/centers/${center.id}/image` : null
        }))
        setCenters(centersList)
        setLoading(prev => ({ ...prev, centers: false }))
        return { type: 'centers', success: true }
      }).catch(error => {
        console.error('❌ Error fetching centers:', error)
        setErrors(prev => ({ ...prev, centers: 'Failed to load centers' }))
        setLoading(prev => ({ ...prev, centers: false }))
        return { type: 'centers', success: false, error }
      }),

      // Testimonials
      get('/api/testimonials').then(response => {
        const testimonialsList = (response.data || []).map((testimonial) => ({
          id: testimonial.id,
          name: testimonial.name,
          designation: testimonial.profession,
          content: testimonial.text,
          image: testimonial.image ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/testimonials/${testimonial.id}/image` : null
        }))
        setTestimonials(testimonialsList)
        setLoading(prev => ({ ...prev, testimonials: false }))
        return { type: 'testimonials', success: true }
      }).catch(error => {
        console.error('❌ Error fetching testimonials:', error)
        setErrors(prev => ({ ...prev, testimonials: 'Failed to load testimonials' }))
        setLoading(prev => ({ ...prev, testimonials: false }))
        return { type: 'testimonials', success: false, error }
      }),

      // Team Members
      get('/api/team-members').then(response => {
        // const teamList = (response.data || []).map((member) => ({
        //   id: member.id,
        //   name: member.name,
        //   designation: member.designation,
        //   image: member.image ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/team-members/${member.id}/image` : null,
        //   facebook: member.facebook,
        //   twitter: member.twitter,
        //   instagram: member.instagram
        // }))
        const teamList = (response.data || []).map((member) => ({
          id: member.id,
          name: member.name,
          designation: member.designation,
          image: member.image, // <-- Use the image data directly from the API
          facebook: member.facebook,
          twitter: member.twitter,
          instagram: member.instagram
        }));
        setTeamMembers(teamList)
        setLoading(prev => ({ ...prev, teamMembers: false }))
        return { type: 'teamMembers', success: true }
      }).catch(error => {
        console.error('❌ Error fetching team members:', error)
        setErrors(prev => ({ ...prev, teamMembers: 'Failed to load team members' }))
        setLoading(prev => ({ ...prev, teamMembers: false }))
        return { type: 'teamMembers', success: false, error }
      })
    ]

    // Wait for all API calls to complete
    try {
      const results = await Promise.allSettled(apiCalls)
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
      const failed = results.filter(r => r.status === 'rejected' || !r.value.success).length
      
      console.log(`✅ Data fetch completed: ${successful} successful, ${failed} failed`)
    } catch (error) {
      console.error('❌ Critical error in fetchAllData:', error)
    }
  }

  // Initialize data on mount
  useEffect(() => {
    fetchAllData()
  }, [])

  // CRUD operations for admin panel
  const addItem = (type, item) => {
    switch (type) {
      case 'services':
        setServices(prev => [...prev, item])
        break
      case 'announcements':
        setAnnouncements(prev => [...prev, item])
        break
      case 'galleryItems':
        setGalleryItems(prev => [...prev, item])
        break
      case 'centers':
        setCenters(prev => [...prev, item])
        break
      case 'testimonials':
        setTestimonials(prev => [...prev, item])
        break
      case 'teamMembers':
        setTeamMembers(prev => [...prev, item])
        break
    }
  }

  const updateItem = (type, id, updatedItem) => {
    switch (type) {
      case 'services':
        setServices(prev => prev.map(item => item.id === id ? { ...item, ...updatedItem } : item))
        break
      case 'announcements':
        setAnnouncements(prev => prev.map(item => item.id === id ? { ...item, ...updatedItem } : item))
        break
      case 'galleryItems':
        setGalleryItems(prev => prev.map(item => item.id === id ? { ...item, ...updatedItem } : item))
        break
      case 'centers':
        setCenters(prev => prev.map(item => item.id === id ? { ...item, ...updatedItem } : item))
        break
      case 'testimonials':
        setTestimonials(prev => prev.map(item => item.id === id ? { ...item, ...updatedItem } : item))
        break
      case 'teamMembers':
        setTeamMembers(prev => prev.map(item => item.id === id ? { ...item, ...updatedItem } : item))
        break
    }
  }

  const deleteItem = (type, id) => {
    switch (type) {
      case 'services':
        setServices(prev => prev.filter(item => item.id !== id))
        break
      case 'announcements':
        setAnnouncements(prev => prev.filter(item => item.id !== id))
        break
      case 'galleryItems':
        setGalleryItems(prev => prev.filter(item => item.id !== id))
        break
      case 'centers':
        setCenters(prev => prev.filter(item => item.id !== id))
        break
      case 'testimonials':
        setTestimonials(prev => prev.filter(item => item.id !== id))
        break
      case 'teamMembers':
        setTeamMembers(prev => prev.filter(item => item.id !== id))
        break
    }
  }

  // Force refresh data
  const refreshData = () => {
    setLastFetch(null)
    fetchAllData()
  }

  const value = {
    // Data
    services,
    announcements,
    galleryItems,
    centers,
    testimonials,
    teamMembers,
    
    // Loading states
    loading,
    
    // Error states
    errors,
    
    // CRUD operations
    addItem,
    updateItem,
    deleteItem,
    
    // Utility functions
    refreshData,
    isDataStale
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export default DataContext
