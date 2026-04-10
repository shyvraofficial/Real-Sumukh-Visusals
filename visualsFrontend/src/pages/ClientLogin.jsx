import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../Config';

/**
 * Client Login Page - Professional Client Portal with Google OAuth
 * Strict Color Palette: #000000 (black), #131313 (dark), #f3f3f3 (off-white), #ffffff (white)
 */
const ClientLogin = ({ onLogin }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        const clientData = {
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          avatar: user.photoURL || `https://via.placeholder.com/40/131313/f5f5f5?text=${user.email[0].toUpperCase()}`,
          token: idToken,
          uid: user.uid,
        };
        localStorage.setItem('clientToken', idToken);
        localStorage.setItem('clientData', JSON.stringify(clientData));
        onLogin(clientData);
        navigate('/client/dashboard');
      }
    });
    return () => unsubscribe();
  }, [onLogin, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setIsLoading(true);

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const clientData = {
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        avatar: user.photoURL || `https://via.placeholder.com/40/131313/f5f5f5?text=${user.email[0].toUpperCase()}`,
        token: idToken,
        uid: user.uid,
      };

      localStorage.setItem('clientToken', idToken);
      localStorage.setItem('clientData', JSON.stringify(clientData));
      onLogin(clientData);
      navigate('/client/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoData = {
      email: 'demo@alexstudios.com',
      name: 'Alex Studios',
      avatar: 'https://via.placeholder.com/40/131313/f5f5f5?text=AS',
      token: 'demo-token-' + Math.random().toString(36).substr(2, 9),
    };

    localStorage.setItem('clientToken', demoData.token);
    localStorage.setItem('clientData', JSON.stringify(demoData));

    onLogin(demoData);
    navigate('/client/dashboard');
  };

  return (
    <div style={{ backgroundColor: '#000000' }} className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-12">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center font-bold text-2xl mx-auto mb-4"
            style={{ backgroundColor: '#131313', color: '#ffffff' }}
          >
            ▶
          </div>
          <h1 style={{ color: '#ffffff' }} className="text-4xl font-bold mb-2 tracking-tight">Sumukh Visuals</h1>
          <p style={{ color: '#f3f3f3' }} className="text-xs tracking-widest font-semibold">CLIENT PORTAL</p>
        </div>

        {/* Login Card */}
        <div
          className="p-8 rounded-lg border"
          style={{ backgroundColor: '#131313', borderColor: '#f3f3f3' }}
        >
          <h2 style={{ color: '#ffffff' }} className="text-2xl font-bold mb-8 tracking-tight">SIGN IN</h2>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-lg border" style={{ backgroundColor: '#131313', borderColor: '#f3f3f3' }}>
              <p style={{ color: '#ffffff' }} className="text-sm font-semibold">{error}</p>
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg border font-semibold transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-3"
            style={{
              backgroundColor: '#f3f3f3',
              borderColor: '#f3f3f3',
              color: '#000000'
            }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                SIGNING IN...
              </span>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                CONTINUE WITH GOOGLE
              </>
            )}
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ backgroundColor: '#f3f3f3' }} />
            <span style={{ color: '#f3f3f3' }} className="text-xs font-semibold">
              OR
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#f3f3f3' }} />
          </div>

          {/* Demo Login */}
          <button
            onClick={handleDemoLogin}
            className="w-full px-4 py-3 rounded-lg border font-semibold transition-all text-sm hover:opacity-80"
            style={{
              backgroundColor: '#000000',
              borderColor: '#f3f3f3',
              color: '#f3f3f3'
            }}
          >
            TRY DEMO ACCOUNT
          </button>

          {/* Footer */}
          <p style={{ color: '#f3f3f3' }} className="text-center text-xs mt-6">
            Need help? Contact{' '}
            <a href="mailto:support@sumukhvisuals.com" style={{ color: '#ffffff' }} className="font-semibold hover:underline">
              support@sumukhvisuals.com
            </a>
          </p>
        </div>

        {/* Info Box */}
        <div
          className="mt-6 p-4 rounded-lg border"
          style={{ backgroundColor: '#131313', borderColor: '#f3f3f3' }}
        >
          <p style={{ color: '#f3f3f3' }} className="text-xs">
            <span className="font-semibold">SECURE LOGIN:</span>
            <br />
            Sign in with your Google account for secure access to your projects.
            <br />
We never share your information without permission.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;
