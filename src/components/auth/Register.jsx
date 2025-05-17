import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function Register({ role }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [birthday, setBirthday] = useState('');
  const [fullName, setFullName] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();

  // Password strength checker
  const checkPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;

    switch (strength) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
      case 3:
        return 'Moderate';
      case 4:
        return 'Strong';
      case 5:
        return 'Very Strong';
      default:
        return '';
    }
  };

  // Form validations
  const validateForm = () => {
    const nameRegex = /^[A-Za-z]+$/;
    const mobileRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const today = new Date();
    const selectedBirthday = new Date(birthday);

    if (role === 'USER') {
      if (!nameRegex.test(firstName)) {
        Swal.fire({ title: 'First Name must contain only letters', icon: 'error' });
        return false;
      }
      if (!nameRegex.test(lastName)) {
        Swal.fire({ title: 'Last Name must contain only letters', icon: 'error' });
        return false;
      }
      if (mobile && !mobileRegex.test(mobile)) {
        Swal.fire({ title: 'Mobile number must be 10 digits', icon: 'error' });
        return false;
      }
      if (birthday && selectedBirthday >= today) {
        Swal.fire({ title: 'Birthday must be before today', icon: 'error' });
        return false;
      }
    } else {
      if (!nameRegex.test(fullName.replace(/\s/g, ''))) {
        Swal.fire({ title: 'Full Name must contain only letters', icon: 'error' });
        return false;
      }
    }

    if (!emailRegex.test(email)) {
      Swal.fire({ title: 'Invalid email format', icon: 'error' });
      return false;
    }

    if (password.length < 8) {
      Swal.fire({ title: 'Password must be at least 8 characters', icon: 'error' });
      return false;
    }

    if (password !== confirmPassword) {
      Swal.fire({ title: 'Passwords do not match', icon: 'error' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const endpoint = role === 'USER' ? '/api/auth/register/user' : '/api/auth/register/admin';
      const payload = role === 'USER' ? {
        email,
        password,
        firstName,
        lastName,
        mobile,
        birthday: birthday || null
      } : {
        email,
        password,
        fullName
      };
      await axios.post(`http://localhost:8080${endpoint}`, payload);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Registered successfully',
        showConfirmButton: false,
        timer: 1500
      });
      navigate(`/${role.toLowerCase()}/login`);
    } catch (error) {
      Swal.fire({
        title: 'Registration failed',
        icon: 'error',
        draggable: true
      });
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-md">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4">{role} Register</h2>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg">
        {role === 'USER' ? (
          <>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Mobile</label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full p-3 rounded bg-gray-700 text-white focus:outline-ma focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Birthday</label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </>
        ) : (
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
        )}
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
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordStrength(checkPasswordStrength(e.target.value));
            }}
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
          {password && (
            <div className="mt-2 text-sm">
              Password Strength: <span className={
                passwordStrength === 'Weak' ? 'text-red-500' :
                passwordStrength === 'Moderate' ? 'text-yellow-500' :
                passwordStrength === 'Strong' ? 'text-green-500' :
                'text-blue-500'
              }>{passwordStrength}</span>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
        <button type="submit" className="w-full bg-cyan-500 text-white p-3 rounded-lg hover:bg-cyan-600">Register</button>
      </form>
    </div>
  );
}

export default Register;