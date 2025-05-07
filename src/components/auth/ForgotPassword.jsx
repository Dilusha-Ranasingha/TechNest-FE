import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Enter OTP and new password
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/auth/password/reset', { email });
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "OTP sent to your email",
        showConfirmButton: false,
        timer: 1500
      });
      setStep(2);
    } catch (error) {
      Swal.fire({
        title: "Failed to send OTP",
        icon: "error",
        draggable: true
      });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/auth/password/reset/confirm', { email, otp, newPassword });
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Password reset successfully",
        showConfirmButton: false,
        timer: 1500
      });
      navigate('/user/login');
    } catch (error) {
      Swal.fire({
        title: "Failed to reset password",
        icon: "error",
        draggable: true
      });
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-md">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4">Forgot Password</h2>
      {step === 1 ? (
        <form onSubmit={handleRequestOtp} className="bg-gray-800 p-6 rounded-lg shadow-lg">
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
          <button type="submit" className="w-full bg-cyan-500 text-white p-3 rounded-lg hover:bg-cyan-600">Request OTP</button>
          <div className="mt-4 text-center">
            <Link to="/user/login" className="text-cyan-400 hover:underline">Back to Login</Link>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <button type="submit" className="w-full bg-cyan-500 text-white p-3 rounded-lg hover:bg-cyan-600">Reset Password</button>
          <div className="mt-4 text-center">
            <Link to="/user/login" className="text-cyan-400 hover:underline">Back to Login</Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;