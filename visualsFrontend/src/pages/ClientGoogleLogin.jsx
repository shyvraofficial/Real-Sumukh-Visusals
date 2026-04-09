import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../Config';

const ClientGoogleLogin = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        const clientData = {
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          avatar: user.photoURL || `https://via.placeholder.com/40`,
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
        avatar: user.photoURL || `https://via.placeholder.com/40`,
        token: idToken,
        uid: user.uid,
      };

      localStorage.setItem('clientToken', idToken);
      localStorage.setItem('clientData', JSON.stringify(clientData));
      onLogin(clientData);
      navigate('/client/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login with Google');
      console.error('Google login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-black mb-2">Sumukh Visuals</h1>
          <p className="text-[#a8a8a8]">Client Dashboard</p>
        </div>

        <div className="rounded-[24px] border border-black/10 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-black mb-2">Welcome back</h2>
          <p className="text-sm text-[#a8a8a8] mb-8">
            Sign in with your Google account to access your projects
          </p>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-black/20 bg-white px-6 py-3 font-semibold text-black transition-all hover:border-black/40 hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
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
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <p className="text-xs text-center text-[#a8a8a8] mt-6">
            We never share your information without your permission
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientGoogleLogin;
