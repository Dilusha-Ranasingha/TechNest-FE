import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import axios from 'axios';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Log the payload to debug
      console.log('Sending payload:', { email, password });

      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password
      });
      const { token, role } = response.data;
      await login({ token, role, email });
      Swal.fire({
        title: 'Login Successful',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        draggable: true
      });
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        title: 'Login Failed',
        text: error.response?.data?.message || 'Invalid credentials',
        icon: 'error',
        draggable: true
      });
    } finally {
      setLoading(false);
    }
  };

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
            onChange={(e) => setEmail(e.target.value)} // Ensure e.target.value is a string
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Ensure e.target.value is a string
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
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