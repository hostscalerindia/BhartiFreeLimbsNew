import { useState } from "react";
import { post } from "../../utils/api";
import { useData } from "../../context/DataContext";

function CenterGalleryForm() {
  const [formData, setFormData] = useState({
    center_id: "",
  });
  const [images, setImages] = useState([]);
  const [perFileMeta, setPerFileMeta] = useState([]);
  const [centerLoading, centerSetLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { centers, loading, errors, refreshData } = useData();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setPerFileMeta(files.map((f) => ({ name: f.name, previewUrl: URL.createObjectURL(f) })));
  };

  const removeImageAt = (idx) => {
    setPerFileMeta((prev) => {
      const meta = prev[idx];
      if (meta?.previewUrl) {
        try { URL.revokeObjectURL(meta.previewUrl) } catch {}
      }
      return prev.filter((_, i) => i !== idx);
    });
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.center_id) {
      setMessage({ type: 'error', text: 'Please select a center' });
      return;
    }

    if (!images.length) {
      setMessage({ type: 'error', text: 'Please select at least one image' });
      return;
    }

    centerSetLoading(true);
    setMessage("");

    try {
      const submitData = new FormData();
      submitData.append("center_id", formData.center_id);
      
      // Get center name from the selected center
      const selectedCenter = centers.find(center => center.id == formData.center_id);
      if (selectedCenter) {
        submitData.append("center_name", selectedCenter.name);
      }
      
      images.forEach((file, idx) => submitData.append('images', file));

      await post("/api/center-galleries", submitData, true);

      setMessage({ type: 'success', text: 'Center gallery images uploaded successfully!' });
      setFormData({
        center_id: "",
      });
      setImages([]);
      setPerFileMeta([]);
      document.getElementById("center-gallery-images").value = "";
    } catch (error) {
      console.error("Error adding center gallery images:", error);
      setMessage({ type: 'error', text: "Error: " + (error.response?.data?.message || "Failed to add center gallery images") });
    } finally {
      centerSetLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-neutral-800 mb-2">
          Upload Multiple Center Gallery Images
        </h2>
        <p className="text-neutral-600">Select multiple images and upload them to center galleries</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-neutral-200">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Center Selection and Images Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  <i className="fa fa-building mr-1"></i>
                  Select Center <span className="text-red-500">*</span>
                </label>
                <select
                  name="center_id"
                  value={formData.center_id}
                  onChange={handleInputChange}
                  required
                  disabled={loading.centers}
                  className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loading.centers ? 'Loading centers...' : (errors.centers || centers.length === 0) ? 'No centers available' : 'Select a center'}
                  </option>
                  {centers && centers.length > 0 ? (
                    centers.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.name}
                      </option>
                    ))
                  ) : null}
                </select>
                {(errors.centers || centers.length === 0) && !loading.centers && (
                  <p className="text-xs text-red-500 mt-1">
                    <i className="fa fa-exclamation-triangle mr-1"></i>
                    {errors.centers || 'No centers found. Please add centers first.'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  <i className="fa fa-images mr-1"></i>
                  Upload Images <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    id="center-gallery-images"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    required
                    className="block w-full text-sm text-neutral-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-600"
                  />
                  <span className="text-xs text-neutral-500">{images.length} selected</span>
                </div>
              </div>
            </div>

            {/* Multiple Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {perFileMeta.map((meta, idx) => (
                  <div key={meta.name} className="relative border border-neutral-200 rounded-xl p-3 flex gap-3 items-start">
                    <button
                      type="button"
                      onClick={() => removeImageAt(idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                      aria-label="Remove image"
                      title="Remove image"
                    >
                      <i className="fa fa-trash text-xs"></i>
                    </button>
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                      <img src={meta.previewUrl} alt={meta.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-700 mb-1">{meta.name}</p>
                      <p className="text-xs text-neutral-500">Ready to upload</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Message */}
            {message && (
              <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              disabled={centerLoading || !formData.center_id || !images.length}
            >
              {centerLoading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="fa fa-upload text-xs"></i>
                  Upload Images
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CenterGalleryForm;
