import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function Login({ role }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password, role);
    if (success) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Logged in successfully",
        showConfirmButton: false,
        timer: 1500
      });
      navigate('/dashboard');
    } else {
      Swal.fire({
        title: "Invalid credentials",
        icon: "error",
        draggable: true
      });
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/oauth/google', {
        credential: credentialResponse.credential
      });
      const { token, role: userRole, email: userEmail } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      localStorage.setItem('email', userEmail);
      login(userEmail, null, userRole); // Password not needed for OAuth
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Logged in with Google",
        showConfirmButton: false,
        timer: 1500
      });
      navigate('/dashboard');
    } catch (error) {
      Swal.fire({
        title: "Google login failed",
        icon: "error",
        draggable: true
      });
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-md">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4">{role} Login</h2>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
        <button type="submit" className="w-full bg-cyan-500 text-white p-3 rounded-lg hover:bg-cyan-600">Login</button>
        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-cyan-400 hover:underline">Forgot Password?</Link>
        </div>
        <div className="mt-4 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              Swal.fire({
                title: "Google login failed",
                icon: "error",
                draggable: true
              });
            }}
          />
        </div>
      </form>
    </div>
  );
}

export default Login;