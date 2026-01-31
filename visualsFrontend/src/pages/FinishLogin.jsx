

import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, isSignInWithEmailLink, signInWithEmailLink } from '../Config';
import { ShopContext } from '../context/ShopContext';
import { NotificationContext } from '../context/NotificationContext';

const FinishLogin = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(ShopContext);
  const { success, error: showError } = useContext(NotificationContext);

  useEffect(() => {
    const completeLogin = async () => {
      const url = window.location.href;

      if (!isSignInWithEmailLink(auth, url)) {
        showError('This login link has expired. Please request a new one.');
        navigate('/login');
        return;
      }

      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please enter your email to confirm');
        if (!email) {
          showError('Email is required to complete login.');
          navigate('/login');
          return;
        }
      }

      try {
        const result = await signInWithEmailLink(auth, email, url);

        window.localStorage.removeItem('emailForSignIn');

        const idToken = await result.user.getIdToken();

        setToken(idToken);
        localStorage.setItem('token', idToken);

        success('You are now logged in!');
        navigate('/');
      } catch (error) {
        console.error('FinishLogin error:', error);
        showError('This login link has expired. Please request a new one.');
        navigate('/login');
      }
    };

    completeLogin();
  }, [navigate, setToken]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
      <p className="mt-4 prata-regular text-xl">Verifying your secure link...</p>
      <p className="text-gray-500 text-sm">You will be redirected in a moment.</p>
    </div>
  );
};

export default FinishLogin;