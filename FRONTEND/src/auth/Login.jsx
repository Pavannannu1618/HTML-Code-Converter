import React, { useState } from 'react';
import './Login.css';

/**
 * Login Component
 * 
 * Features:
 * - Beautiful, modern UI
 * - Email and password authentication
 * - Secure credential checking
 * - Error handling
 * - Remember me option
 * - Animated transitions
 */

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // ============================================================================
  // AUTHORIZED USERS
  // ============================================================================
  // Add your authorized users here
  // Format: { email: 'user@example.com', password: 'password123' }
  
  const AUTHORIZED_USERS = [
    { email: 'rakesh01@gmail.com', password: 'Rakesh01$$' },
    { email: 'anusha02@gmail.com', password: 'Anusha02$$' },
    { email: 'pavan03@gmail.com', password: 'Pavan03$$' },
    { email: 'ranjith04@gmail.com', password: 'Ranjith04$$' },
    { email: 'sathwika05@gmail.com', password: 'Sathwika05$$' },
    { email: 'gandhi06@gmail.com', password: 'Gandhi06$$' },
    { email: 'admin@gmail.com', password: 'admin@123' },
    // Add more users here as needed
  ];

  // ============================================================================
  // AUTHENTICATION LOGIC
  // ============================================================================

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading delay for better UX
    setTimeout(() => {
      // Check credentials
      const user = AUTHORIZED_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        // Successful login
        if (rememberMe) {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userEmail', email);
        } else {
          sessionStorage.setItem('isAuthenticated', 'true');
          sessionStorage.setItem('userEmail', email);
        }
        
        onLoginSuccess(email);
      } else {
        // Failed login
        setError('Invalid email or password. Please try again.');
        setPassword('');
      }
      
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <div className="logo">
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                <circle cx="25" cy="25" r="23" stroke="url(#gradient)" strokeWidth="3"/>
                <path d="M15 25 L22 32 L35 18" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <h1 className="login-title">HTML Code Formatter</h1>
          <p className="login-subtitle">Sign in to access your account</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          {error && (
            <div className="error-message">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
                <path d="M10 6v4M10 14h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="input-wrapper">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 4h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="2"/>
                <path d="M2 5l8 5 8-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-wrapper">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="9" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 9V5a3 3 0 016 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="checkbox-text">Remember me</span>
            </label>
          </div>

          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="footer-text">
            Protected Application - Authorized Users Only
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;