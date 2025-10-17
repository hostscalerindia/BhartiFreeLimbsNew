import { useState, useEffect } from "react";
import { get } from "../../utils/api.js";

const ServiceForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    phone: "",
  });
  const [image, setImage] = useState(null);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch service types on component mount
  useEffect(() => {
    fetchServiceTypes();
  }, []);

  const fetchServiceTypes = async () => {
    try {
      const response = await get("/api/service-types");
      if (response.success) {
        setServiceTypes(response.data);
      }
    } catch (error) {
      console.error("Error fetching service types:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setForm({ ...form, phone: value });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage('');
      
      // Comprehensive validation
      if (!form.title.trim()) {
        throw new Error('Center name is required');
      }
      
      if (!form.description.trim()) {
        throw new Error('Description is required');
      }
      
      if (!form.location.trim()) {
        throw new Error('Location is required');
      }
      
      if (!form.category) {
        throw new Error('Please select a service type');
      }
      
      // Check phone number validation
      if (form.phone.length !== 10) {
        throw new Error('Phone number must be exactly 10 digits');
      }
      
      if (!image) {
        throw new Error('Please select an image before submitting');
      }
      
      // Get selected service type details
      const selectedServiceType = serviceTypes.find(type => type.id == form.category);
      if (!selectedServiceType) {
        throw new Error('Please select a valid service type');
      }
      
      const fd = new FormData();
      fd.append('name', form.title);
      fd.append('description', form.description);
      fd.append('location', form.location);
      fd.append('phone_number', form.phone);
      fd.append('service_type_id', form.category);
      fd.append('service_type_name', selectedServiceType.name); // Add service type name
      if (image) fd.append('image', image);
      
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/centers`, { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to save');
      
      setMessage('Center added successfully!');
      setForm({ title: "", description: "", location: "", category: "", phone: "" });
      setImage(null);
      // Reset file input
      document.getElementById('center-image').value = '';
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-800 mb-1 sm:mb-2">Add Center</h2>
        <p className="text-sm sm:text-base text-neutral-600">Add new centers to BhartiFreeLimbs</p>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-neutral-200">
        <div className="p-3 sm:p-4 lg:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Center Name, Location, Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  <i className="fa fa-building mr-1"></i>
                  Center Name *
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter center name..."
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none text-xs sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  <i className="fa fa-map-marker-alt mr-1"></i>
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter center location..."
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none text-xs sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  <i className="fa fa-phone mr-1"></i>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter 10-digit phone..."
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none text-xs sm:text-sm"
                  maxLength="10"
                  required
                />
                <p className="text-xs text-neutral-500 mt-1">{form.phone.length}/10</p>
              </div>
            </div>

            {/* Row 2: Service Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                <i className="fa fa-cog mr-1"></i>
                Service Type *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none text-sm"
                required
              >
                <option value="">Select Service Type</option>
                {serviceTypes
                  .filter(type => type.status === 'active')
                  .map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))
                }
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                <i className="fa fa-image mr-1"></i>
                Center Image *
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="center-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1 px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 text-sm"
                />
                {image && (
                  <button
                    type="button"
                    className="bg-primary hover:bg-primary-600 text-white px-3 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2 text-sm"
                    onClick={() => setShowImageModal(true)}
                  >
                    <i className="fa fa-eye text-xs"></i>
                    Preview
                  </button>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                <i className="fa fa-edit mr-1"></i>
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the center..."
                rows={4}
                className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none resize-none text-sm"
                required
              />
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-xl ${
                message.includes('Error') 
                  ? 'bg-red-50 border border-red-200 text-red-700' 
                  : 'bg-green-50 border border-green-200 text-green-700'
              }`}>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              disabled={loading || !form.title.trim() || !form.description.trim() || !form.location.trim() || !form.category || form.phone.length !== 10 || !image}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fa fa-plus text-xs"></i>
                  Add Center
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Image Preview Modal */}
      {showImageModal && image && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-800">Image Preview</h3>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
              >
                <i className="fa fa-times text-neutral-600"></i>
              </button>
            </div>
            <div className="p-6 text-center">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="max-h-96 w-full object-contain rounded-lg mx-auto"
              />
              <p className="mt-4 text-neutral-600">{image.name}</p>
            </div>
            <div className="p-6 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceForm;
