import { useState, useEffect } from 'react';
import { get, del } from '../../utils/api';

const ViewGallary = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await get('/api/gallery');
      if (response.success) {
        setGallery(response.data);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setMessage('Error fetching gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      try {
        const response = await del(`/api/gallery/${id}`);
        if (response.success) {
          setMessage('Gallery item deleted successfully!');
          fetchGallery();
        } else {
          setMessage('Failed to delete gallery item');
        }
      } catch (error) {
        console.error('Error deleting gallery item:', error);
        setMessage('Error deleting gallery item');
      }
    }
  };

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-neutral-800 mb-2">View Gallery</h2>
        <p className="text-neutral-600">Manage all gallery items</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-6 ${
          message.includes('Error') || message.includes('Failed')
            ? 'bg-red-50 border border-red-200 text-red-700' 
            : 'bg-green-50 border border-green-200 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-xl font-semibold text-neutral-800">Gallery Items</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {gallery.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <i className="fa fa-inbox text-4xl text-neutral-400 mb-4"></i>
                      <p className="text-neutral-600">No gallery items found. Add your first gallery item.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                gallery.map((item, index) => (
                  <tr key={item.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-primary">{index + 1}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        {item.image ? (
                          <img 
                            src={`${baseUrl}/api/gallery/${item.id}/image`}
                            alt={item.title}
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
                        {item.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600 max-w-xs">
                      <div className="truncate" title={item.description}>
                        {item.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors duration-200"
                          title="Delete Gallery Item"
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
    </div>
  );
};

export default ViewGallary;
