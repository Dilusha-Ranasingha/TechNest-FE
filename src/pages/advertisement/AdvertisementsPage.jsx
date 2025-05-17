import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { fetchAllAdvertisements, deleteAdvertisement } from '../../services/advertisementsService';

function AdvertisementsPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  if (!user) {
    // Redirect to login if user is not authenticated
    navigate(user?.role === 'ADMIN' ? '/admin/login' : '/user/login');
    return;
  }

  const fetchAds = async () => {
    try {
      const data = await fetchAllAdvertisements(user.token);
      setAds(data);
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

  fetchAds();
}, [user, navigate]);

  const handleDeleteAd = async (adId) => {
    try {
      await deleteAdvertisement(token, adId);
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

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6">Advertisements</h2>
      <button
        onClick={() => navigate('/advertisements/new')}
        className="inline-block mb-6 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
      >
        Create New Advertisement
        console.log('Navigating to create new advertisement');
      </button>
      <div className="grid gap-6">
        {ads.length > 0 ? (
          ads.map(ad => (
            <div key={ad.id} className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center">
              <img
                src={ad.link || 'https://via.placeholder.com/800x400'}
                alt={ad.title}
                className="w-full md:w-1/3 h-40 object-cover rounded-lg mb-4 md:mb-0 md:mr-6"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-300 mb-2">{ad.title}</h3>
                <p className="text-gray-400 mb-2">{ad.description}</p>
                <p className="text-gray-500 text-sm">Category: {ad.category}</p>
                <p className="text-gray-500 text-sm">Reference: {ad.referenceName}</p>
                <p className="text-gray-500 text-sm">Created by: {ad.createdBy}</p>
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