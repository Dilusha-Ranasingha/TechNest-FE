import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createAdvertisement } from '../../services/advertisementsService';

function CreateAdvertisement() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [adForm, setAdForm] = useState({
    title: '',
    description: '',
    category: '',
    referenceName: '',
    link: '',
  });

  if (!user || !token) {
    navigate(user?.role === 'ADMIN' ? '/admin/login' : '/user/login');
    return null;
  }

  const handleAdSubmit = async () => {
    if (!adForm.title.trim() || !adForm.description.trim() || !adForm.category.trim() || !adForm.referenceName.trim()) {
      Swal.fire({
        title: 'Error',
        text: 'Title, description, category, and reference name are required',
        icon: 'error',
        draggable: true,
      });
      return;
    }

    try {
      const payload = {
        title: adForm.title,
        description: adForm.description,
        category: adForm.category,
        referenceName: adForm.referenceName,
        link: adForm.link || 'https://via.placeholder.com/800x400',
      };

      await createAdvertisement(token, payload);
      Swal.fire({
        title: 'Advertisement Created',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        draggable: true,
      });
      navigate('/advertisements');
    } catch (err) {
      Swal.fire({
        title: 'Failed to create advertisement',
        text: err.message,
        icon: 'error',
        draggable: true,
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6">Create New Advertisement</h2>
      <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-300 mb-2">Title</label>
          <input
            type="text"
            id="title"
            value={adForm.title}
            onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-300 mb-2">Description</label>
          <textarea
            id="description"
            value={adForm.description}
            onChange={(e) => setAdForm({ ...adForm, description: e.target.value })}
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-300 mb-2">Category</label>
          <select
            id="category"
            value={adForm.category}
            onChange={(e) => setAdForm({ ...adForm, category: e.target.value })}
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          >
            <option value="">Select Category</option>
            <option value="UNIVERSITY">University</option>
            <option value="LEARNING_PLATFORM">Learning Platform</option>
            <option value="YOUTUBE">YouTube</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="referenceName" className="block text-gray-300 mb-2">Reference Name</label>
          <input
            type="text"
            id="referenceName"
            value={adForm.referenceName}
            onChange={(e) => setAdForm({ ...adForm, referenceName: e.target.value })}
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="link" className="block text-gray-300 mb-2">Image URL (Optional)</label>
          <input
            type="text"
            id="link"
            value={adForm.link}
            onChange={(e) => setAdForm({ ...adForm, link: e.target.value })}
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Enter image URL or leave blank for default"
          />
        </div>
        <button
          onClick={handleAdSubmit}
          className="w-full p-3 rounded bg-cyan-500 text-white font-semibold hover:bg-cyan-600"
        >
          Create Advertisement
        </button>
        <button
          onClick={() => navigate('/advertisements')}
          className="w-full mt-2 p-3 rounded bg-gray-600 text-white font-semibold hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default CreateAdvertisement;