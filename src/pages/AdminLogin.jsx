import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent double submission
    setLoading(true);
    try {
      console.log('Sending payload:', { email, password });
      console.log('Email type:', typeof email, 'Value:', email);
      console.log('Password type:', typeof password, 'Value:', password);

      const success = await login(email, password, 'ADMIN');
      if (success) {
        Swal.fire({
          title: 'Login Successful',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          draggable: true
        });
        navigate('/admin/dashboard');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data, 'Status:', error.response?.status);
      Swal.fire({
        title: 'Login Failed',
        text: error.response?.data?.message || 'Invalid credentials',
        icon: 'error',
        draggable: true
      });
    } finally {
      setLoading(false);
    }
  }, [email, password, login, navigate, loading]);

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">Admin Login</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
            autoComplete="email"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded text-white font-semibold ${loading ? 'bg-gray-600' : 'bg-cyan-500 hover:bg-cyan-600'}`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-cyan-400 hover:underline">Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;