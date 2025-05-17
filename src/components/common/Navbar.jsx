import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getFirstLetter = () => {
    if (!user || !user.email) return '';
    const firstName = user.email.split('@')[0].charAt(0).toUpperCase();
    return firstName;
  };

  const handleLogoClick = () => {
    if (user) {
      if (user.role === 'USER') {
        navigate('/postManagement/PostDashboardPage'); // Updated path
      } else {
        navigate('/admin/dashboard');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-gray-900 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <span
          onClick={handleLogoClick}
          className="text-2xl font-bold text-cyan-400 cursor-pointer"
        >
          TechNest
        </span>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>
        <div className={`md:flex items-center space-x-4 ${isOpen ? 'block' : 'hidden'} md:block`}>
          {user ? (
            user.role === 'USER' ? (
              <>
                <Link to="/dashboard" className="text-white hover:text-cyan-400">Dashboard</Link> {/* Updated */}
                <Link to="/tutorials" className="text-white hover:text-cyan-400">Tutorials</Link>
                <Link to="/postManagement/user-posts" className="text-white hover:text-cyan-400">Manage Posts</Link> {/* add a new button to mange the own post */}
                <Link to="/community" className="text-white hover:text-cyan-400">Community</Link>
                <Link to="/community/manage" className="text-white hover:text-cyan-400">Manage Community</Link>
                <Link to="/advertisements-add" className="text-white hover:text-cyan-400">Advertisements-add</Link>                <Link to="/profile" className="flex items-center">
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                    {getFirstLetter()}
                  </div>
                </Link>
                <button onClick={handleLogout} className="text-white hover:text-cyan-400">Logout</button>
              </>
            ) : (
              <>
                <Link to="/admin/dashboard" className="text-white hover:text-cyan-400">Dashboard</Link>
                <Link to="/tutorials" className="text-white hover:text-cyan-400">Tutorials</Link>
                <Link to="/admin/profile" className="flex items-center">
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                    {getFirstLetter()}
                  </div>
                </Link>
                <button onClick={handleLogout} className="text-white hover:text-cyan-400">Logout</button>
              </>
            )
          ) : (
            <>
              <Link to="/admin/login" className="text-white hover:text-cyan-400">Admin Login</Link>
              <Link to="/user/login" className="text-white hover:text-cyan-400">User Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;