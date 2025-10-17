import { useState, useEffect } from 'react';
import { post, get } from '../../utils/api';

function TeamMemberForm() {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    facebook: '',
    twitter: '',
    instagram: ''
  });
  const [image, setImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentCount, setCurrentCount] = useState(0);

  useEffect(() => {
    loadCurrentCount();
  }, []);

  const loadCurrentCount = async () => {
    try {
      const response = await get('/api/team-members');
      setCurrentCount(response.data?.length || 0);
    } catch (error) {
      console.error('Error loading team count:', error);
    }
  };

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
    
    if (currentCount >= 4) {
      setMessage('Maximum 4 team members allowed. Please delete one before adding new.');
      return;
    }

    // Comprehensive validation
    if (!formData.name.trim()) {
      setMessage('Name is required');
      return;
    }

    if (!formData.designation.trim()) {
      setMessage('Designation is required');
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
      submitData.append('facebook', formData.facebook);
      submitData.append('twitter', formData.twitter);
      submitData.append('instagram', formData.instagram);
      
      if (image) {
        submitData.append('image', image);
      }

      await post('/api/team-members', submitData);
      
      setMessage('Team member added successfully!');
      setFormData({
        name: '',
        designation: '',
        facebook: '',
        twitter: '',
        instagram: ''
      });
      setImage(null);
      document.getElementById('imageInput').value = '';
      loadCurrentCount();
    } catch (error) {
      console.error('Error adding team member:', error);
      setMessage('Error: ' + (error.response?.data?.message || 'Failed to add team member'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-neutral-800 mb-2">Add New Team Member</h2>
        <p className="text-neutral-600">Add new team members to BhartiFreeLimbs</p>
        <div className="mt-2">
          <span className="text-sm text-neutral-500">
            Current team members: {currentCount}/4
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-neutral-200">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name and Designation Row */}
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
                  <i className="fa fa-image mr-1"></i>
                  Profile Image *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="imageInput"
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
              </div>
            </div>

            {/* Social Media Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  <i className="fab fa-facebook mr-1"></i>
                  Facebook URL
                </label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none text-sm"
                  placeholder="https://facebook.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  <i className="fab fa-twitter mr-1"></i>
                  Twitter URL
                </label>
                <input
                  type="url"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none text-sm"
                  placeholder="https://twitter.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  <i className="fab fa-instagram mr-1"></i>
                  Instagram URL
                </label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none text-sm"
                  placeholder="https://instagram.com/username"
                />
              </div>
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
              disabled={loading || !formData.name.trim() || !formData.designation.trim() || !image || currentCount >= 4}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                  Adding...
                </>
              ) : (
                <>
                  <i className="fa fa-plus text-xs"></i>
                  Add Team Member
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

export default TeamMemberForm;
