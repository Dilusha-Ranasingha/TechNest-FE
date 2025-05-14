import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

// Mock data for advertisements with valid image URLs
const mockAds = [
  {
    id: 1,
    title: "Tech Conference 2025",
    description: "Join the biggest tech conference of the year! Learn from industry experts.",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
    createdAt: "2025-05-01",
  },
  {
    id: 2,
    title: "New Coding Bootcamp",
    description: "Enroll in our coding bootcamp and master JavaScript in 8 weeks!",
    imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=800&auto=format&fit=crop",
    createdAt: "2025-05-03",
  },
];

function AdvertisementsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const action = params.action || (window.location.pathname.includes('new') ? 'new' : 
                                 window.location.pathname.includes('edit') ? 'edit' : null);
  const adId = params.adId;

  const [ads, setAds] = useState([]);
  const [adForm, setAdForm] = useState({ title: '', description: '', imageUrl: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate(user?.role === 'ADMIN' ? '/admin/login' : '/user/login');
      return;
    }

    // Simulate fetching advertisements (using mock data)
    const fetchAds = async () => {
      try {
        setAds(mockAds);
      } catch (err) {
        Swal.fire({
          title: 'Failed to load advertisements',
          text: err.message,
          icon: 'error',
          draggable: true,
        });
        setError('Failed to load advertisements');
      } finally {
        setLoading(false);
      }
    };

    // Simulate fetching a specific ad for editing
    const fetchAdForEdit = async () => {
      if (action === 'edit' && adId) {
        try {
          const ad = mockAds.find(ad => ad.id === parseInt(adId));
          if (ad) {
            setAdForm({ title: ad.title, description: ad.description, imageUrl: ad.imageUrl });
          } else {
            throw new Error('Advertisement not found');
          }
        } catch (err) {
          Swal.fire({
            title: 'Failed to load advertisement',
            text: err.message,
            icon: 'error',
            draggable: true,
          });
          setError('Failed to load advertisement');
        }
      } else if (action === 'new') {
        setAdForm({ title: '', description: '', imageUrl: '' });
      }
    };

    fetchAds();
    fetchAdForEdit();
  }, [user, navigate, action, adId]);

  const handleAdSubmit = async (e) => {
    e.preventDefault();
    if (!adForm.title.trim() || !adForm.description.trim()) {
      Swal.fire({
        title: 'Error',
        text: 'Title and description are required',
        icon: 'error',
        draggable: true,
      });
      return;
    }

    try {
      const newAd = {
        id: action === 'edit' ? parseInt(adId) : ads.length + 1,
        title: adForm.title,
        description: adForm.description,
        imageUrl: adForm.imageUrl || 'https://images.unsplash.com/photo-1551288049-b1f3c6f4c7e4?q=80&w=800&auto=format&fit=crop',
        createdAt: new Date().toISOString().split('T')[0],
      };

      if (action === 'edit') {
        setAds(prev => prev.map(ad => ad.id === parseInt(adId) ? newAd : ad));
        Swal.fire({
          title: 'Advertisement Updated',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          draggable: true,
        });
      } else {
        setAds(prev => [...prev, newAd]);
        Swal.fire({
          title: 'Advertisement Created',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          draggable: true,
        });
      }
      navigate('/advertisements');
    } catch (err) {
      Swal.fire({
        title: action === 'edit' ? 'Failed to update advertisement' : 'Failed to create advertisement',
        text: err.message,
        icon: 'error',
        draggable: true,
      });
    }
  };

  const handleDeleteAd = async (adId) => {
    try {
      setAds(prev => prev.filter(ad => ad.id !== adId));
      Swal.fire({
        title: 'Advertisement Deleted',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        draggable: true,
      });
    } catch (err) {
      Swal.fire({
        title: 'Failed to delete advertisement',
        text: err.message,
        icon: 'error',
        draggable: true,
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto p-8 text-gray-400">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-gray-400">
        <p>{error}</p>
        <button
          onClick={() => navigate('/advertisements')}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back to Advertisements
        </button>
      </div>
    );
  }

  if (action === 'edit' || action === 'new') {
    return (
      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-bold text-cyan-400 mb-6">
          {action === 'edit' ? 'Edit Advertisement' : 'Create New Advertisement'}
        </h2>
        <form onSubmit={handleAdSubmit} className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
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
            <label htmlFor="imageUrl" className="block text-gray-300 mb-2">Image URL (Optional)</label>
            <input
              type="text"
              id="imageUrl"
              value={adForm.imageUrl}
              onChange={(e) => setAdForm({ ...adForm, imageUrl: e.target.value })}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter image URL or leave blank for default"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 rounded bg-cyan-500 text-white font-semibold hover:bg-cyan-600"
          >
            {action === 'edit' ? 'Update Advertisement' : 'Create Advertisement'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/advertisements')}
            className="w-full mt-2 p-3 rounded bg-gray-600 text-white font-semibold hover:bg-gray-700"
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6">Advertisements</h2>
      <button
        onClick={() => navigate('/advertisements/new')}
        className="inline-block mb-6 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
      >
        Create New Advertisement
      </button>
      <div className="grid gap-6">
        {ads.length > 0 ? (
          ads.map(ad => (
            <div key={ad.id} className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center">
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="w-full md:w-1/3 h-40 object-cover rounded-lg mb-4 md:mb-0 md:mr-6"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-300 mb-2">{ad.title}</h3>
                <p className="text-gray-400 mb-2">{ad.description}</p>
                <p className="text-gray-500 text-sm">Posted on: {ad.createdAt}</p>
              </div>
              <div className="flex space-x-3 mt-4 md:mt-0">
                <button
                  onClick={() => navigate(`/advertisements/edit/${ad.id}`)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAd(ad.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No advertisements available.</p>
        )}
      </div>
    </div>
  );
}

export default AdvertisementsPage;