import { useState, useEffect } from "react";
import { get, post, put, del } from "../../utils/api";

const ServiceTypeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  const fetchServiceTypes = async () => {
    try {
      const response = await get('/api/service-types');
      if (response.success) {
        setServiceTypes(response.data);
      }
    } catch (error) {
      console.error("Error fetching service types:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // Clear image state if no file selected
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Comprehensive validation
    if (!formData.name.trim()) {
      setMessage({ type: "error", text: "Service type name is required." });
      return;
    }
    
    if (!formData.description.trim()) {
      setMessage({ type: "error", text: "Service type description is required." });
      return;
    }
    
    // Check if image is required and not selected
    if (!selectedImage && !editingId) {
      setMessage({ type: "error", text: "Please select an image before submitting." });
      return;
    }
    
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      let response;
      if (editingId) {
        response = await put(`/api/service-types/${editingId}`, formDataToSend, true);
        if (response.success) {
          setMessage({ type: "success", text: "Service type updated successfully!" });
          setEditingId(null);
          setFormData({ name: "", description: "" });
          setSelectedImage(null);
          setImagePreview(null);
        }
      } else {
        response = await post('/api/service-types', formDataToSend, true);
        if (response.success) {
          setMessage({ type: "success", text: "Service type added successfully!" });
          setFormData({ name: "", description: "" });
          setSelectedImage(null);
          setImagePreview(null);
        }
      }

      if (response.success) {
        fetchServiceTypes();
        // Reset file input
        document.getElementById('service-type-image').value = '';
      } else {
        setMessage({ type: "error", text: response.message || "An error occurred" });
      }
    } catch (error) {
      console.error("Error creating service type:", error);
      setMessage({ type: "error", text: "Failed to save service type" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (serviceType) => {
    setEditingId(serviceType.id);
    setFormData({
      name: serviceType.name,
      description: serviceType.description,
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service type?")) {
      try {
        const response = await del(`/api/service-types/${id}`);
        if (response.success) {
          setMessage({ type: "success", text: "Service type deleted successfully!" });
          fetchServiceTypes();
        } else {
          setMessage({ type: "error", text: response.message || "Failed to delete service type" });
        }
      } catch (error) {
        console.error("Error deleting service type:", error);
        setMessage({ type: "error", text: "Failed to delete service type" });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", description: "" });
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-800 mb-1 sm:mb-2">
          {editingId ? "Edit Service Type" : "Add New Service Type"}
        </h2>
        <p className="text-sm sm:text-base text-neutral-600">Manage service types for BhartiFreeLimbs</p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 text-sm sm:text-base ${
          message.type === "success" 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Add/Edit Service Type Form */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-neutral-200 mb-4 sm:mb-6 lg:mb-8">
        <div className="p-3 sm:p-4 lg:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Compact Form Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  <i className="fa fa-tag mr-1"></i>
                  Service Type Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter service type name..."
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none text-xs sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  <i className="fa fa-image mr-1"></i>
                  Service Type Image *
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    id="service-type-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1 px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 text-sm"
                  />
                  
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => setShowImageModal(true)}
                      className="flex items-center justify-center w-8 h-8 bg-primary hover:bg-primary-600 text-white rounded-lg transition-all duration-300"
                      title="Preview Image"
                    >
                      <i className="fa fa-eye text-sm"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                <i className="fa fa-edit mr-1"></i>
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description for the service type..."
                rows={4}
                className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none resize-none text-sm"
                required
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t border-neutral-200">
              <button
                type="submit"
                disabled={loading || !formData.name.trim() || !formData.description.trim() || (!selectedImage && !editingId)}
                className="bg-primary hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fa fa-check text-xs"></i>
                    {editingId ? "Update" : "Add Service Type"}
                  </>
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm"
                >
                  <i className="fa fa-times text-xs"></i>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Service Types List */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-neutral-200">
        <div className="p-3 sm:p-4 lg:p-6 border-b border-neutral-200">
          <h3 className="text-lg sm:text-xl font-semibold text-neutral-800">Service Types List</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {serviceTypes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <i className="fa fa-inbox text-4xl text-neutral-400 mb-4"></i>
                      <p className="text-neutral-600">No service types found. Add your first service type to BhartiFreeLimbs above.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                serviceTypes.map((serviceType, index) => (
                  <tr key={serviceType.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-primary">{index + 1}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        {serviceType.image ? (
                          <img 
                            src={`${baseUrl}/api/service-types/${serviceType.id}/image`}
                            alt={serviceType.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                            <i className="fa fa-image text-neutral-400"></i>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-neutral-800 text-sm">
                        {serviceType.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {new Date(serviceType.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(serviceType)}
                          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 p-2 rounded-lg transition-colors duration-200"
                          title="Edit Service Type"
                        >
                          <i className="fa fa-edit text-xs"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(serviceType.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors duration-200"
                          title="Delete Service Type"
                        >
                          <i className="fa fa-trash text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Preview Modal */}
      {showImageModal && imagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-800">Image Preview</h3>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors duration-200"
                >
                  <i className="fa fa-times text-xl"></i>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
                />
              </div>
              <p className="mt-4 text-neutral-600 text-center">{selectedImage?.name}</p>
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

export default ServiceTypeForm;
