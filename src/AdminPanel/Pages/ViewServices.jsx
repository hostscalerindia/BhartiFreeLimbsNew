import { useState, useEffect } from 'react';
import { get, del } from '../../utils/api';

const ViewServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await get('/api/centers');
      if (response.success) {
        setServices(response.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setMessage('Error fetching services');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this center?')) {
      try {
        const response = await del(`/api/centers/${id}`);
        if (response.success) {
          setMessage('Center deleted successfully!');
          fetchServices();
        } else {
          setMessage('Failed to delete center');
        }
      } catch (error) {
        console.error('Error deleting center:', error);
        setMessage('Error deleting center');
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
    <div className="w-full">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-800 mb-1 sm:mb-2">View Centers</h2>
        <p className="text-sm sm:text-base text-neutral-600">Manage all centers in BhartiFreeLimbs</p>
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

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-neutral-200">
        <div className="p-3 sm:p-4 lg:p-6 border-b border-neutral-200">
          <h3 className="text-xl font-semibold text-neutral-800">Centers List</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Service Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {services.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <i className="fa fa-inbox text-4xl text-neutral-400 mb-4"></i>
                      <p className="text-neutral-600">No centers found. Add your first center to BhartiFreeLimbs.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                services.map((service, index) => (
                  <tr key={service.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-primary">{index + 1}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        {service.image ? (
                          <img 
                            src={`${baseUrl}/api/centers/${service.id}/image`}
                            alt={service.name}
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
                        {service.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {service.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {service.phone_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {service.service_type_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors duration-200"
                          title="Delete Center"
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

export default ViewServices;
