import { useState } from 'react';
import { post } from '../../utils/api';
import { useData } from '../../context/DataContext'

function AnnouncementForm() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    details: '',
    category: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [announcementLoading, setAnnouncementLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { services } = useData()

  const categories = services && services.length > 0 
  ? [...new Set(services.map(service => service.title))]
  : []


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // Clear image state if no file selected
      setImage(null);
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Comprehensive validation
    if (!formData.title.trim()) {
      setMessage('Title is required.');
      return;
    }
    
    if (!formData.content.trim()) {
      setMessage('Content is required.');
      return;
    }
    
    if (!formData.category.trim()) {
      setMessage('Category is required.');
      return;
    }
    
    if (!image) {
      setMessage('Please select an image before submitting.');
      return;
    }
    
    setAnnouncementLoading(true);
    setMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('details', formData.details);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('priority', 'medium'); // Default priority
      
      if (image) {
        formDataToSend.append('image', image);
      }

      const response = await post('/api/announcements', formDataToSend);
      
      setMessage('Announcement added successfully!');
      setFormData({
        title: '',
        content: '',
        details: '',
        category: ''
      });
      setImage(null);
      setImagePreview(null);
      // Reset file input
      document.getElementById('announcement-image').value = '';
      
    } catch (error) {
      console.error('Error adding announcement:', error);
      let errorMessage = 'Error adding announcement. Please try again.';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setMessage(errorMessage);
    } finally {
      setAnnouncementLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-800 mb-1 sm:mb-2">Add New Announcement</h2>
        <p className="text-sm sm:text-base text-neutral-600">Create new announcements for BhartiFreeLimbs</p>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-neutral-200">
        <div className="p-3 sm:p-4 lg:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title and Category Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              <i className="fa fa-bullhorn mr-1"></i>
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter announcement title"
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none text-xs sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              <i className="fa fa-tag mr-1"></i>
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none text-xs sm:text-sm"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              <i className="fa fa-image mr-1"></i>
              Image *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="announcement-image"
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

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            <i className="fa fa-edit mr-1"></i>
            Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={3}
            placeholder="Enter the main announcement content..."
            className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none resize-none text-sm"
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
          disabled={announcementLoading || !formData.title.trim() || !formData.content.trim() || !formData.category.trim() || !image}
        >
          {announcementLoading ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
              Adding...
            </>
          ) : (
            <>
              <i className="fa fa-plus text-xs"></i>
              Add Announcement
            </>
          )}
        </button>
          </form>
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
              <p className="mt-4 text-neutral-600 text-center">{image?.name}</p>
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
}

export default AnnouncementForm;
