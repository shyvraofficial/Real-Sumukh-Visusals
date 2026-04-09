import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { NotificationContext } from '../context/NotificationContext';
import { ShopContext } from '../context/ShopContext';
import { handleGoogleLogin } from '../Config';
import { authClient } from '../services/clientAPI';
import './Login.css';

const Login = () => {
  const { token, setToken, navigate, backendUrl, cartItems } = useContext(ShopContext);
  const { success, error: showError } = useContext(NotificationContext);
  const [email, setEmail] = useState('');
  const [sendingLink, setSendingLink] = useState(false);
  const [error, setError] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [resending, setResending] = useState(false);

  // Magic Link Logic
  const handleMagicLinkSubmit = async (e) => {
    e.preventDefault();
    setSendingLink(true);
    setError('');
    const redirectPath = localStorage.getItem('lastVisitedPath') || '/';

    try {
      const res = await axios.post(`${backendUrl}/api/user/send-login-link`, {
        email,
        redirectPath,
        cartItems,
      });

      if (res.data.success) {
        window.localStorage.setItem('emailForSignIn', email);
        setLinkSent(true);
        setSentEmail(email);
        setEmail('');
        success('Secure sign-in link sent');
      } else {
        showError(res.data.message || 'Unable to send sign-in link');
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
      const userInfo = await handleGoogleLogin(setError);
      
      // Auto-create/update client in MongoDB
      try {
        await authClient(userInfo.uid, userInfo.email, userInfo.name, userInfo.avatar);
      } catch (clientErr) {
        console.error('Failed to create/update client profile:', clientErr);
        // Continue anyway - client will still be logged in
      }
      
      // Store token
      setToken(userInfo.token);
      localStorage.setItem('token', userInfo.token);
      localStorage.setItem('firebaseUID', userInfo.uid);
      localStorage.setItem('userEmail', userInfo.email);
      localStorage.setItem('userName', userInfo.name); // Store user's display name from Google
      
      success('Logged in successfully!');
    } catch (err) {
      console.error('Google login error:', err);
      showError('Google sign-in failed. Please try again.');
    }
  };

  // Resend Sign-In Link
  const handleResendLink = async () => {
    setResending(true);
    setError('');
    const redirectPath = localStorage.getItem('lastVisitedPath') || '/';

    try {
      const res = await axios.post(`${backendUrl}/api/user/send-login-link`, {
        email: sentEmail,
        redirectPath,
        cartItems,
      });

      if (res.data.success) {
        success('Link resent successfully');
      } else {
        showError(res.data.message || 'Unable to resend link');
      }
    } catch (err) {
      console.error(err);
      showError('Failed to resend link. Please try again.');
    } finally {
      setResending(false);
    }
  };

  // Auto-Redirect if logged in
  useEffect(() => {
    if (token) {
      // Check if this is a client login (from /client/login)
      const searchParams = new URLSearchParams(window.location.search);
      const isClientMode = searchParams.get('mode') === 'client';
      
      if (isClientMode) {
        // Redirect to client dashboard
        navigate('/client/dashboard');
      } else {
        // Regular shop login - redirect to previous page or home
        const redirectPath = localStorage.getItem('lastVisitedPath') || localStorage.getItem('redirectAfterLogin');
        const loginPaths = ['/login', '/newlogin', '/finish-login'];
        const target = redirectPath && !loginPaths.includes(redirectPath) ? redirectPath : '/';
        localStorage.removeItem('redirectAfterLogin');
        navigate(target);
      }
    }
  }, [token, navigate]);

  return (
    <div className="login-page">
      <div className="login-container">
      

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
              <div className="login-input-wrapper">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  placeholder="Enter your email address..."
                  disabled={linkSent}
                />
                {linkSent && (
                  <button
                    type="button"
                    onClick={handleResendLink}
                    disabled={resending}
                    className="login-resend-field-btn"
                  >
                    {resending ? 'Resending...' : 'Resend'}
                  </button>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              className="login-button login-submit-btn"
              disabled={sendingLink || linkSent}
            >
              {sendingLink ? 'Sending...' : 'Continue'}
            </button>

            {linkSent && (
              <div className="login-success-message">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.78 4.22a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 011.06-1.06L5.5 10.94l6.97-6.97a.75.75 0 011.06 0z" fill="currentColor"/>
                </svg>
                <p>Sign-in link sent to <strong>{sentEmail}</strong>. Check your inbox and click it to sign in.</p>
                <button
                  type="button"
                  onClick={() => setLinkSent(false)}
                  className="login-success-close"
                  aria-label="Close"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            )}
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