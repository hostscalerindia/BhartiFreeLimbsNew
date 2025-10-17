import { useState, useEffect } from "react";
import { get, del } from "../../utils/api";

const ViewTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // const fetchTeamMembers = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await get("/api/team-members");
  //     if (response.success) {
  //       setTeamMembers(response.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching team members:", error);
  //     setMessage("Error fetching team members");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchTeamMembers = async () => {
  try {
    setLoading(true);
    const response = await get("/api/team-members");

    // ✅ Your backend returns { data: [...] } — not { success: true }
    if (response.data) {
      setTeamMembers(response.data);
    } else {
      console.error("Unexpected response format:", response);
      setMessage("Unexpected response format from server");
    }
  } catch (error) {
    console.error("Error fetching team members:", error);
    setMessage("Error fetching team members");
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      try {
        const response = await del(`/api/team-members/${id}`);
        if (response.success || response.message ==="Team member deleted successfully") {
          setMessage("Team member deleted successfully!");
          fetchTeamMembers();
        } else {
          setMessage("Failed to delete team member");
        }
      } catch (error) {
        console.error("Error deleting team member:", error);
        setMessage("Error deleting team member");
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
          View Team Members
        </h2>
        <p className="text-neutral-600">Manage all team members</p>
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
            Team Members List
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
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Social Links
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
              {teamMembers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <i className="fa fa-inbox text-4xl text-neutral-400 mb-4"></i>
                      <p className="text-neutral-600">
                        No team members found. Add your first team member.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                teamMembers.map((member, index) => (
                  <tr key={member.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-primary">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        {member.image ? (
                          // <img
                          //   src={`${baseUrl}/api/team-members/${member.id}/image`}
                          //   alt={member.name}
                          //   className="w-12 h-12 object-cover rounded-lg"
                          // />
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                            <i className="fa fa-user text-neutral-400"></i>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-neutral-800 text-sm">
                        {member.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {member.designation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {member.facebook && (
                          <a
                            href={member.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <i className="fab fa-facebook"></i>
                          </a>
                        )}
                        {member.twitter && (
                          <a
                            href={member.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-600"
                          >
                            <i className="fab fa-twitter"></i>
                          </a>
                        )}
                        {member.instagram && (
                          <a
                            href={member.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-600 hover:text-pink-800"
                          >
                            <i className="fab fa-instagram"></i>
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {new Date(member.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors duration-200"
                          title="Delete Team Member"
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

export default ViewTeamMembers;
