import { useState } from 'react'
import { post } from '../../utils/api'

const MultipleGalleryForm = () => {
  const [images, setImages] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [perFileMeta, setPerFileMeta] = useState([]) // [{name, title, description, previewUrl}]
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)
  
  const removeImageAt = (idx) => {
    setPerFileMeta((prev) => {
      const meta = prev[idx]
      if (meta?.previewUrl) {
        try { URL.revokeObjectURL(meta.previewUrl) } catch {}
      }
      return prev.filter((_, i) => i !== idx)
    })
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    setImages(files)
    setPerFileMeta(files.map((f) => ({ name: f.name, title: '', description: '', previewUrl: URL.createObjectURL(f) })))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!images.length) {
      setMessage({ type: 'error', text: 'Please select at least one image' })
      return
    }
    setSubmitting(true)
    setMessage(null)
    try {
      const formData = new FormData()
      if (title) formData.append('title', title)
      if (description) formData.append('description', description)
      images.forEach((file, idx) => formData.append('images', file))
      // Attach per-file titles/descriptions if any are provided (titles[]/descriptions[])
      perFileMeta.forEach((meta) => formData.append('titles', meta.title))
      perFileMeta.forEach((meta) => formData.append('descriptions', meta.description))

      const res = await post('/api/gallery/bulk', formData, true)
      setMessage({ type: 'success', text: res?.message || 'Images uploaded successfully' })
      setImages([])
      setPerFileMeta([])
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Upload failed' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-4">Upload Multiple Gallery Images</h2>
        <p className="text-neutral-600 mb-6 text-sm">Select multiple images and upload them in one go. Title/Description are optional and will be applied to all images.</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Images <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-3">
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleFileChange} 
                  className="block w-full text-sm text-neutral-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-600"
                />
                <span className="text-xs text-neutral-500">{images.length} selected</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Title (optional)</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Common title for all images"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Description (optional)</label>
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Common description for all images"
              />
            </div>
          </div>

          {/* Per-file metadata grid */}
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
                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">Title (optional)</label>
                      <input
                        type="text"
                        value={meta.title}
                        onChange={(e) => {
                          const val = e.target.value
                          setPerFileMeta((prev) => prev.map((m, i) => i === idx ? { ...m, title: val } : m))
                        }}
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder={meta.name}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">Description (optional)</label>
                      <input
                        type="text"
                        value={meta.description}
                        onChange={(e) => {
                          const val = e.target.value
                          setPerFileMeta((prev) => prev.map((m, i) => i === idx ? { ...m, description: val } : m))
                        }}
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Write a short description"
                      />
                    </div>
                    <p className="text-[10px] text-neutral-500 truncate">{meta.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary hover:bg-primary-600 text-white px-5 py-2 rounded-full text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Uploading...' : 'Upload Images'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MultipleGalleryForm


