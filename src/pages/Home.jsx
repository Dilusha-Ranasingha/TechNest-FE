import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-5xl font-bold text-cyan-400 mb-4">Welcome to TechNest</h1>
      <p className="text-lg mb-8">Your ultimate platform for tech learning and growth.</p>
      <div className="space-x-4">
        <Link to="/admin/login" className="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600">Admin Login</Link>
        <Link to="/user/login" className="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600">User Login</Link>
        <Link to="/user/register" className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600">Register</Link>
      </div>
    </div>
  );
}

export default Home;