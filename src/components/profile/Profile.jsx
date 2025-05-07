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

  if (!userDetails) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-8 max-w-md">
      <h2 className="text-3xl font-bold text-cyan-400 mb-8">Profile</h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        {isEditing ? (
          <>
            {user.role === 'USER' ? (
              <>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Mobile</label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Birthday</label>
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </>
            ) : (
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            )}
            <button
              onClick={handleSave}
              className="w-full bg-cyan-500 text-white p-3 rounded-lg hover:bg-cyan-600"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-300 mb-2"><strong>Email:</strong> {userDetails.email}</p>
            {user.role === 'USER' ? (
              <>
                <p className="text-gray-300 mb-2"><strong>First Name:</strong> {userDetails.firstName || '-'}</p>
                <p className="text-gray-300 mb-2"><strong>Last Name:</strong> {userDetails.lastName || '-'}</p>
                <p className="text-gray-300 mb-2"><strong>Mobile:</strong> {userDetails.mobile || '-'}</p>
                <p className="text-gray-300 mb-2"><strong>Birthday:</strong> {userDetails.birthday || '-'}</p>
              </>
            ) : (
              <p className="text-gray-300 mb-2"><strong>Full Name:</strong> {userDetails.fullName || '-'}</p>
            )}
            <p className="text-gray-300 mb-2"><strong>Role:</strong> {userDetails.role}</p>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={handleEdit}
                className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600"
              >
                Edit Profile
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Delete Profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;