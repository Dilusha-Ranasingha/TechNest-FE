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
import AdvertisementsPage from './pages/advertisement/AdvertisementsPage';
import CreateAdvertisement from './pages/advertisement/CreateAdvertisement';
import EditAdvertisement from './pages/advertisement/EditAdvertisement';
import PostDashboardPage from './pages/post management/PostDashboardPage';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
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
                <Route path="/PostDashboardPage" element={<PostDashboardPage />} />


                <Route path="/advertisements" element={<AdvertisementsPage />} />
                <Route path="/advertisements/new" element={<CreateAdvertisement />} />
                <Route path="/advertisements/edit/:adId" element={<EditAdvertisement />} />

                
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