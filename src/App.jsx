import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import UserLogin from './pages/UserLogin';
import AdminRegister from './pages/AdminRegister';
import UserRegister from './pages/UserRegister';
import DashboardPage from './pages/DashboardPage';
import TutorialsPage from './pages/TutorialsPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import OAuthRedirectHandler from './components/auth/OAuthRedirectHandler';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProfilePage from './pages/AdminProfilePage';
import Quiz from './components/tutorials/Quiz';
import PostDashboardPage from './pages/postManagement/PostDashboardPage';
import UserPostsPage from './pages/postManagement/UserPostsPage';
import CommunityPage from './pages/community/CommunityPage';
import ManageCommunityPostsPage from './pages/community/ManageCommunityPostsPage';
import AdvertisementsPage from './pages/advertisement/AdvertisementsPage';
import CreateAdvertisement from './pages/advertisement/CreateAdvertisement';
import EditAdvertisement from './pages/advertisement/EditAdvertisement';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) {
    // Redirect to the appropriate login page based on the role or default to user login
    return <Navigate to="/user/login" />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId="227444504671-1bra01qrhonqenhk0n3nbpj2bcc9aekl.apps.googleusercontent.com">
        <Router>
          <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
            <OAuthRedirectHandler />
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/postManagement/PostDashboardPage" element={<ProtectedRoute roles={['USER']}><PostDashboardPage /></ProtectedRoute>} />
                <Route path="/postManagement/user-posts" element={<ProtectedRoute roles={['USER']}><UserPostsPage /></ProtectedRoute>} />
                <Route path="/community" element={<ProtectedRoute roles={['USER']}><CommunityPage /></ProtectedRoute>} />
                <Route path="/community/manage" element={<ProtectedRoute roles={['USER']}><ManageCommunityPostsPage /></ProtectedRoute>} />
                <Route path="/advertisements-add" element={<ProtectedRoute roles={['USER']}><AdvertisementsPage /></ProtectedRoute>} /> {/* Updated path */}
                <Route path="/advertisements/new" element={<ProtectedRoute roles={['USER']}><CreateAdvertisement /></ProtectedRoute>} />
                <Route path="/advertisements/edit/:adId" element={<ProtectedRoute roles={['USER']}><EditAdvertisement /></ProtectedRoute>} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/admin/register" element={<AdminRegister />} />
                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/dashboard" element={<ProtectedRoute roles={['USER']}><DashboardPage /></ProtectedRoute>} />
                <Route path="/feed" element={<ProtectedRoute roles={['USER']}><FeedPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute roles={['USER']}><ProfilePage /></ProtectedRoute>} />
                <Route path="/admin/dashboard" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboardPage /></ProtectedRoute>} />
                <Route path="/admin/profile" element={<ProtectedRoute roles={['ADMIN']}><AdminProfilePage /></ProtectedRoute>} />
                <Route
                  path="/tutorials/:action?/:tutorialId?"
                  element={<ProtectedRoute roles={['USER', 'ADMIN']}><TutorialsPage /></ProtectedRoute>}
                />
                <Route
                  path="/tutorials/quiz/:tutorialId"
                  element={<ProtectedRoute roles={['USER']}><Quiz /></ProtectedRoute>}
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </GoogleOAuthProvider>
    </AuthProvider>
  );
}

export default App;