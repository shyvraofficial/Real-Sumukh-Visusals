import React, { useEffect, useState, useContext } from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft, FaApple } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext'; // Import Context
import { 
  socialLogin, 
  googleProvider, 
  microsoftProvider, 
  appleProvider 
} from '../Config';

const NewLogin = () => {
  const { setToken, backendUrl, cartItems } = useContext(ShopContext); // Get backendUrl and setToken
  const [email, setEmail] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setFormVisible(true);
    }, 100);
  }, []);

  // Handler for Social Logins
  const handleSocialClick = async (provider) => {
    setError('');
    try {
      const idToken = await socialLogin(provider); // Get token from Config helper
      
      // CRITICAL: Update Global State
      setToken(idToken); 
      localStorage.setItem('token', idToken);
      
      navigate('/'); // Redirect to Home
    } catch (err) {
      setError(err.message || "Social login failed. Check popup settings.");
    }
  };

  // Magic Link Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const redirectPath = localStorage.getItem('lastVisitedPath') || '/';

    try {
      const response = await axios.post(`${backendUrl}/api/user/send-login-link`, { email, redirectPath, cartItems });
      
      if (response.data.success) {
        window.localStorage.setItem('emailForSignIn', email);
        setLinkSent(true);
        setSentEmail(email);
        setEmail('');
        setSuccess("Secure sign-in link sent");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // Resend Sign-In Link
  const handleResendLink = async () => {
    setResending(true);
    setError('');
    const redirectPath = localStorage.getItem('lastVisitedPath') || '/';

    try {
      const response = await axios.post(`${backendUrl}/api/user/send-login-link`, { 
        email: sentEmail, 
        redirectPath, 
        cartItems 
      });
      
      if (response.data.success) {
        setSuccess("Link resent successfully");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to resend link. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-500 via-gray-700 to-gray-900 px-4'>
      <div className={`relative bg-gray-800 text-white shadow-lg rounded-lg p-10 max-w-md w-full border border-gray-700 hover:shadow-[0_0_25px_5px_rgba(56,140,248,1)] transition duration-300 ${formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'} transform transition-all duration-500 ease-out`}>
        
        <h2 className='text-3xl font-bold text-center mb-4'>Secure Sign In</h2>
        <p className='text-gray-400 text-center mb-6'>Enter your email to receive a passwordless link</p>

        {error && <p className='text-red-500 text-center text-sm mb-4 bg-red-500/10 py-2 rounded'>{error}</p>}
        {success && <p className='text-green-400 text-center text-sm mb-4 bg-green-500/10 py-2 rounded'>{success}</p>}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label htmlFor="email" className='block text-gray-300 font-medium mb-1'>Email Address</label>
            <div className='relative'>
              <input 
                required 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter Your Email' 
                className='w-full border-b border-gray-600 bg-transparent text-white px-2 py-1 focus:border-cyan-400 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed'
                disabled={linkSent}
              />
              {linkSent && (
                <button
                  type="button"
                  onClick={handleResendLink}
                  disabled={resending}
                  className='absolute right-0 bottom-1 text-cyan-400 hover:text-cyan-300 disabled:opacity-60 text-xs font-medium transition'
                >
                  {resending ? 'Resending...' : 'Resend'}
                </button>
              )}
            </div>
          </div>

          <button 
            type='submit' 
            disabled={loading}
            className='w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-md disabled:opacity-50'
          >
            {loading ? 'Sending Link...' : 'Send Magic Link'}
          </button>

          {linkSent && (
            <div className='flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20 relative group'>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className='text-green-400 flex-shrink-0'>
                <path d="M13.78 4.22a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 011.06-1.06L5.5 10.94l6.97-6.97a.75.75 0 011.06 0z" fill="currentColor"/>
              </svg>
              <div className='text-green-400 text-sm flex-1'>
                <p className='m-0'>Sign-in link sent to <strong>{sentEmail}</strong>. Check your inbox and click it to sign in.</p>
              </div>
              <button
                type="button"
                onClick={() => setLinkSent(false)}
                className='text-green-400 hover:text-green-300 transition flex-shrink-0'
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          )}
        </form>

        <div className='mt-8 flex items-center justify-between'>
          <span className='border-b w-1/4 border-gray-600'></span>
          <span className='text-gray-400 text-sm'>OR SOCIAL LOGIN</span>
          <span className='border-b w-1/4 border-gray-600'></span>
        </div>

        <div className='flex flex-col gap-3 mt-6'>
          <button onClick={() => handleSocialClick(googleProvider)} className='flex items-center justify-center bg-gray-700 border border-gray-600 py-2 rounded-lg hover:bg-gray-600 transition-all'>
            <FcGoogle className='h-5 w-5 mr-3' /> Continue with Google
          </button>
          
          <button onClick={() => handleSocialClick(microsoftProvider)} className='flex items-center justify-center bg-gray-700 border border-gray-600 py-2 rounded-lg hover:bg-gray-600 transition-all'>
            <FaMicrosoft className='h-5 w-5 mr-3 text-blue-400' /> Continue with Microsoft
          </button>

          <button onClick={() => handleSocialClick(appleProvider)} className='flex items-center justify-center bg-gray-700 border border-gray-600 py-2 rounded-lg hover:bg-gray-600 transition-all'>
            <FaApple className='h-5 w-5 mr-3 text-white' /> Continue with Apple
          </button>
        </div>

      </div>
    </div>
  );
};

export default NewLogin;