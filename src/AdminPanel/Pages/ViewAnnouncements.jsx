import { useState, useEffect } from "react";
import { get, del } from "../../utils/api";

const ViewAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await get("/api/announcements");
      if (response.success) {
        setAnnouncements(response.data);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setMessage("Error fetching announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        const response = await del(`/api/announcements/${id}`);
        if (response.success || response.message === "Announcement deleted successfully") {
          setMessage("Announcement deleted successfully!");
          fetchAnnouncements();
        } else {
          setMessage("Failed to delete announcement");
        }
      } catch (error) {
        console.error("Error deleting announcement:", error);
        setMessage("Error deleting announcement");
      }
    }
  };

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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
        <h2 className="text-3xl font-bold text-neutral-800 mb-2">
          View Announcements
        </h2>
        <p className="text-neutral-600">Manage all announcements</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl mb-6 ${
            message.includes("Error") || message.includes("Failed")
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-green-50 border border-green-200 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-xl font-semibold text-neutral-800">
            Announcements List
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {announcements.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <i className="fa fa-inbox text-4xl text-neutral-400 mb-4"></i>
                      <p className="text-neutral-600">
                        No announcements found. Add your first announcement.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                announcements.map((announcement, index) => (
                  <tr key={announcement.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-primary">
                        {index + 1}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        {announcement.image ? (
                          <img 
                            src={`${baseUrl}/api/announcements/${announcement.id}/image`}
                            alt={announcement.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                            <i className="fa fa-image text-neutral-400"></i>
                          </div>
                        )}
                      </div>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        {/* Check for image_base64 instead of image */}
                        {announcement.image_base64 ? (
                          <img
                            // Construct the data URL for the image source
                            src={`data:${announcement.image_mime};base64,${announcement.image_base64}`}
                            alt={announcement.title}
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
                        {announcement.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {announcement.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600 max-w-xs">
                      <div className="truncate" title={announcement.content}>
                        {announcement.content}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(announcement.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors duration-200"
                          title="Delete Announcement"
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

export default ViewAnnouncements;
