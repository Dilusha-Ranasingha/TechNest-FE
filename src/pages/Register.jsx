import { useLocation } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

const Register = () => {
  const location = useLocation();
  const isAdmin = location.pathname.includes('admin');

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">{isAdmin ? 'Admin Register' : 'Register'}</h1>
      <RegisterForm isAdmin={isAdmin} />
    </div>
  );
};

export default Register;