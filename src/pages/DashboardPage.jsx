import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Dashboard from '../components/dashboard/Dashboard';

function DashboardPage() {
  const { user } = useAuth();

  if (!user || user.role !== 'USER') {
    return <Navigate to="/user/login" />;
  }

  return <Dashboard />;
}

export default DashboardPage;