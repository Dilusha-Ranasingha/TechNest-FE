import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

function OAuthRedirectHandler() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const role = params.get('role');
    const email = params.get('email');
    const error = params.get('error');

    if (error) {
      Swal.fire({
        title: 'OAuth Login Failed',
        icon: 'error',
        draggable: true
      });
      navigate('/user/login');
      return;
    }

    if (token && role && email) {
      login({ token, role, email });
      Swal.fire({
        title: 'Login Successful',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        draggable: true
      });
      if (role === 'USER') {
        navigate('/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    }
  }, [location, login, navigate]);

  return null;
}

export default OAuthRedirectHandler;