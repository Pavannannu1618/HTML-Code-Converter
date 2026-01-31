import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple validation (replace with real auth)
    if (email && password) {
      if (rememberMe) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
      } else {
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userEmail', email);
      }
      onLoginSuccess(email);
    } else {
      setError('Please fill in all fields');
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Blobs */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <div className="animate-blob" style={{
          position: 'absolute',
          top: '5rem',
          left: '5rem',
          width: '18rem',
          height: '18rem',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          mixBlendMode: 'overlay'
        }}></div>
        <div className="animate-blob animation-delay-2000" style={{
          position: 'absolute',
          top: '10rem',
          right: '5rem',
          width: '18rem',
          height: '18rem',
          background: 'rgba(168, 85, 247, 0.3)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          mixBlendMode: 'overlay'
        }}></div>
        <div className="animate-blob animation-delay-4000" style={{
          position: 'absolute',
          bottom: '-2rem',
          left: '50%',
          width: '18rem',
          height: '18rem',
          background: 'rgba(236, 72, 153, 0.3)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          mixBlendMode: 'overlay'
        }}></div>
      </div>

      {/* Login Card */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '28rem' }} className="animate-scale-in">
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {/* Logo/Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-block', position: 'relative' }}>
              <div className="animate-float" style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                marginBottom: '16px'
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <div className="animate-pulse" style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                width: '24px',
                height: '24px',
                background: '#10b981',
                borderRadius: '50%',
                border: '4px solid white'
              }}></div>
            </div>
            <h1 style={{
              fontSize: '30px',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '8px'
            }}>
              Welcome Back!
            </h1>
            <p style={{ color: '#6b7280' }}>Sign in to continue to HTML Formatter</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="animate-shake" style={{
              marginBottom: '24px',
              padding: '16px',
              background: '#fef2f2',
              borderLeft: '4px solid #ef4444',
              borderRadius: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg style={{ width: '20px', height: '20px', color: '#ef4444' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p style={{ fontSize: '14px', color: '#991b1b', fontWeight: '500' }}>{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Email Input */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}>
                  <svg style={{ width: '20px', height: '20px', color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-modern"
                  style={{ paddingLeft: '48px' }}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}>
                  <svg style={{ width: '20px', height: '20px', color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-modern"
                  style={{ paddingLeft: '48px' }}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                userSelect: 'none'
              }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    marginRight: '8px',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '14px', color: '#374151' }}>Remember me</span>
              </label>
              <a href="#" style={{
                fontSize: '14px',
                color: '#3b82f6',
                fontWeight: '600',
                textDecoration: 'none'
              }}>
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '18px',
                fontWeight: 'bold',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <span style={{ position: 'relative', zIndex: 10 }}>Sign In</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ position: 'relative', margin: '32px 0' }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center'
            }}>
              <div style={{
                width: '100%',
                borderTop: '1px solid #d1d5db'
              }}></div>
            </div>
            <div style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <span style={{
                padding: '0 16px',
                background: 'white',
                fontSize: '14px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
            <button className="btn-secondary" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px'
            }}>
              <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Google</span>
            </button>
            <button className="btn-secondary" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px'
            }}>
              <svg style={{ width: '20px', height: '20px' }} fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Facebook</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p style={{
            marginTop: '32px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Don't have an account?{' '}
            <a href="#" style={{
              fontWeight: 'bold',
              color: '#3b82f6',
              textDecoration: 'none'
            }}>
              Sign up now
            </a>
          </p>
        </div>

        {/* Features */}
        <div style={{
          marginTop: '32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          textAlign: 'center'
        }}>
          {['🔒 Secure', '⚡ Fast', '🎨 Modern'].map((feature, index) => (
            <div 
              key={index}
              className="animate-fade-in"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                animationDelay: `${index * 100}ms`
              }}
            >
              <p style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#374151'
              }}>
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;