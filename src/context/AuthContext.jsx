import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedEmail = localStorage.getItem('email');
    if (storedToken && storedRole && storedEmail) {
      setUser({ token: storedToken, role: storedRole, email: storedEmail });
    }
  }, []);

  const login = async (email, password, expectedRole) => {
    try {
      // Ensure email and password are strings
      const emailStr = String(email).trim();
      const passwordStr = String(password).trim();
      console.log('AuthContext sending payload:', { email: emailStr, password: passwordStr });

      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: emailStr,
        password: passwordStr
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const { token, role: userRole } = response.data;
      if (expectedRole && userRole !== expectedRole) {
        throw new Error(`Role mismatch: expected ${expectedRole}, but got ${userRole}`);
      }
      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      localStorage.setItem('email', emailStr);
      setUser({ token, role: userRole, email: emailStr });
      return true;
    } catch (error) {
      console.error('AuthContext login error:', error);
      throw error;
    }
  };

  const setOAuthUser = (token, role, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('email', email);
    setUser({ token, role, email });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, setOAuthUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}