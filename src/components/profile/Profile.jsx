import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

function Profile() {
  const { user, logout } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/profile', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setUserDetails(response.data);
        setFormData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          mobile: response.data.mobile || '',
          birthday: response.data.birthday || '',
          fullName: response.data.fullName || ''
        });
      } catch (error) {
        Swal.fire({
          title: "Failed to load profile",
          icon: "error",
          draggable: true
        });
      }
    };
    fetchUserDetails();
  }, [user.token]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: "Don't save"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put('http://localhost:8080/api/profile', formData, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setUserDetails(response.data);
          setIsEditing(false);
          Swal.fire("Saved!", "", "success");
        } catch (error) {
          Swal.fire({
            title: "Failed to update profile",
            icon: "error",
            draggable: true
          });
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
        setIsEditing(false);
      }
    });
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure you want to delete your profile?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: "Cancel"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete('http://localhost:8080/api/profile', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          logout();
          Swal.fire("Profile deleted!", "", "success");
        } catch (error) {
          Swal.fire({
            title: "Failed to delete profile",
            icon: "error",
            draggable: true
          });
        }
      }
    });
  };

  if (!userDetails) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-2xl text-white animate-pulse">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8">
        <h2 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Your Profile
        </h2>
        <div className="space-y-6 bg-gray-800/30 backdrop-blur-sm p-8 rounded-xl border border-gray-700/30">
          {isEditing ? (
            <>
              {user.role === 'USER' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Mobile</label>
                      <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Birthday</label>
                      <input
                        type="date"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                  />
                </div>
              )}
              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 font-semibold text-lg"
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <p className="text-lg text-gray-300"><span className="font-semibold text-cyan-400">Email:</span> {userDetails.email}</p>
                {user.role === 'USER' ? (
                  <>
                    <p className="text-lg text-gray-300"><span className="font-semibold text-cyan-400">First Name:</span> {userDetails.firstName || '-'}</p>
                    <p className="text-lg text-gray-300"><span className="font-semibold text-cyan-400">Last Name:</span> {userDetails.lastName || '-'}</p>
                    <p className="text-lg text-gray-300"><span className="font-semibold text-cyan-400">Mobile:</span> {userDetails.mobile || '-'}</p>
                    <p className="text-lg text-gray-300"><span className="font-semibold text-cyan-400">Birthday:</span> {userDetails.birthday || '-'}</p>
                  </>
                ) : (
                  <p className="text-lg text-gray-300"><span className="font-semibold text-cyan-400">Full Name:</span> {userDetails.fullName || '-'}</p>
                )}
                <p className="text-lg text-gray-300"><span className="font-semibold text-cyan-400">Role:</span> {userDetails.role}</p>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleEdit}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 font-semibold text-lg"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-semibold text-lg"
                >
                  Delete Profile
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;