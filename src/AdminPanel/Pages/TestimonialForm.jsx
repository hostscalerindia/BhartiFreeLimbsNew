import { useState } from 'react';
import { post } from '../../utils/api';

function TestimonialForm() {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    content: '',
    rating: 5
  });
  const [image, setImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
    } else {
      // Clear image state if no file selected
      setImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Comprehensive validation
    if (!formData.name.trim()) {
      setMessage('Name is required');
      return;
    }

    if (!formData.designation.trim()) {
      setMessage('Designation is required');
      return;
    }

    if (!formData.content.trim()) {
      setMessage('Testimonial content is required');
      return;
    }

    if (!image) {
      setMessage('Please select a profile image before submitting');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('designation', formData.designation);
      submitData.append('content', formData.content);
      submitData.append('rating', formData.rating);
      
      if (image) {
        submitData.append('image', image);
      }

      await post('/api/testimonials', submitData);
      
      setMessage('Testimonial added successfully!');
      setFormData({
        name: '',
        designation: '',
        content: '',
        rating: 5
      });
      setImage(null);
      document.getElementById('testimonial-image').value = '';
    } catch (error) {
      console.error('Error adding testimonial:', error);
      setMessage('Error: ' + (error.response?.data?.message || 'Failed to add testimonial'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-neutral-800 mb-2">Add New Testimonial</h2>
        <p className="text-neutral-600">Add testimonials from satisfied clients</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-neutral-200">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name, Designation, Rating Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              <i className="fa fa-user mr-1"></i>
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none text-sm"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              <i className="fa fa-briefcase mr-1"></i>
              Designation *
            </label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none text-sm"
              placeholder="Enter designation"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              <i className="fa fa-star mr-1"></i>
              Rating *
            </label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none text-sm"
            >
              <option value={5}>5 Stars - Excellent</option>
              <option value={4}>4 Stars - Very Good</option>
              <option value={3}>3 Stars - Good</option>
              <option value={2}>2 Stars - Fair</option>
              <option value={1}>1 Star - Poor</option>
            </select>
          </div>
        </div>

        {/* Testimonial Content */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            <i className="fa fa-quote-left mr-1"></i>
            Testimonial Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none resize-none text-sm"
            placeholder="Write the testimonial content..."
          />
        </div>

        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            <i className="fa fa-image mr-1"></i>
            Profile Image *
          </label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="testimonial-image"
              accept="image/*"
              onChange={handleImageChange}
              className="flex-1 px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 text-sm"
            />
            {image && (
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
          <p className="text-xs text-neutral-500 mt-1">Max size: 5MB. Supported formats: JPG, PNG, GIF</p>
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
          disabled={loading || !formData.name.trim() || !formData.designation.trim() || !formData.content.trim() || !image}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
              Adding...
            </>
          ) : (
            <>
              <i className="fa fa-plus text-xs"></i>
              Add Testimonial
            </>
          )}
        </button>
          </form>
        </div>
      </div>

      {/* Image Preview Modal */}
      {showImageModal && image && (
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
                  src={URL.createObjectURL(image)}
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

export default TestimonialForm;
