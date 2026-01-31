import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { NotificationContext } from '../context/NotificationContext';
import { ShopContext } from '../context/ShopContext';
import { handleGoogleLogin } from '../Config';
import './Login.css';

const Login = () => {
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const { success, error: showError } = useContext(NotificationContext);
  const [email, setEmail] = useState('');
  const [sendingLink, setSendingLink] = useState(false);
  const [error, setError] = useState('');

  // Magic Link Logic
  const handleMagicLinkSubmit = async (e) => {
    e.preventDefault();
    setSendingLink(true);
    setError('');

    try {
      const res = await axios.post(`${backendUrl}/api/user/send-login-link`, {
        email,
      });

      if (res.data.success) {
        window.localStorage.setItem('emailForSignIn', email);
        success('Check your email for the login link');
        setEmail('');
      } else {
        showError(res.data.message || 'Unable to send login link');
      }
    } catch (err) {
      console.error(err);
      showError('Failed to send login link. Please try again.');
    } finally {
      setSendingLink(false);
    }
  };

  // Google Login
  const handleGoogleClick = async () => {
    try {
      const idToken = await handleGoogleLogin(setError);
      setToken(idToken);
      localStorage.setItem('token', idToken);
      success('Logged in successfully!');
    } catch (err) {
      console.error('Google login error:', err);
      showError('Google sign-in failed. Please try again.');
    }
  };

  // Auto-Redirect if logged in
  useEffect(() => {
    if (token) {
      const redirectPath = localStorage.getItem('lastVisitedPath') || localStorage.getItem('redirectAfterLogin');
      const loginPaths = ['/login', '/newlogin', '/finish-login'];
      const target = redirectPath && !loginPaths.includes(redirectPath) ? redirectPath : '/';
      localStorage.removeItem('redirectAfterLogin');
      navigate(target);
    }
  }, [token, navigate]);

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo */}
        <div className="login-logo-wrapper">
          <h1 className="login-logo">Sumukh Visuals</h1>
        </div>

        {/* Main Form Card */}
        <div className="login-card">
          <h2 className="login-heading">Sign in to Sumukh Visuals</h2>

          {error && <div className="login-error">{error}</div>}

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleClick}
            className="login-button login-google-btn"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="login-button-icon"
            />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="login-divider">
            <span>or continue with</span>
          </div>

          {/* Email Form - Magic Link */}
          <form onSubmit={handleMagicLinkSubmit} className="login-form">
            <div className="login-form-group">
              <label className="login-label">Email</label>
              <p className="login-description">Use an organization email to easily collaborate with teammates</p>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                placeholder="Enter your email address..."
              />
            </div>

            <button 
              type="submit" 
              className="login-button login-submit-btn"
              disabled={sendingLink}
            >
              {sendingLink ? 'Sending...' : 'Continue'}
            </button>
          </form>

          {/* Terms & Conditions */}
          <div className="login-terms">
            By continuing, you acknowledge that you understand and agree to the <button className="login-terms-link">Terms & Conditions</button> and <button className="login-terms-link">Privacy Policy</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;