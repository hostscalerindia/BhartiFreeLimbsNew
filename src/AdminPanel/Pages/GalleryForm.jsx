import { useState } from "react";

const GalleryForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    } else {
      // Clear image state if no file selected
      setImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Comprehensive validation
    if (!form.title.trim()) {
      alert('Gallery title is required');
      return;
    }
    
    if (!form.description.trim()) {
      alert('Description is required');
      return;
    }
    
    if (!image) {
      alert('Please select an image before submitting');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('image', image);

      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/gallery`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit');
      alert('Gallery item created');
      setForm({ title: '', description: '' });
      setImage(null);
      // Reset file input
      document.getElementById('gallery-image').value = '';
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-neutral-800 mb-2">Add Gallery Item</h2>
        <p className="text-neutral-600">Add new images to your gallery</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-neutral-200">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title and Image Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              <i className="fa fa-tag mr-1"></i>
              Gallery Title *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter gallery title..."
              className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none text-sm"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              <i className="fa fa-image mr-1"></i>
              Upload Image *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="gallery-image"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1 px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 text-sm"
                required
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
            placeholder="Write a description of the gallery item..."
            rows={4}
            className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none resize-none text-sm"
            required
          />
        </div>
        

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          disabled={submitting || !form.title.trim() || !form.description.trim() || !image}
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
              Submitting...
            </>
          ) : (
            <>
              <i className="fa fa-plus text-xs"></i>
              Add Gallery Item
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
};

export default GalleryForm;
