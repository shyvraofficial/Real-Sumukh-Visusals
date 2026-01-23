// import { initializeApp } from "firebase/app";
// import { getAuth, signInWithEmailAndPassword, signInWithPopup,createUserWithEmailAndPassword, GoogleAuthProvider,sendEmailVerification } from "firebase/auth"
// const firebaseConfig = {
//   apiKey: "AIzaSyDykX7dsfBtBLLJQZCoseKFiKUzKu4ezuo",
//   authDomain: "sumukhvisuals.firebaseapp.com",
//   projectId: "sumukhvisuals",
//   storageBucket: "sumukhvisuals.firebasestorage.app",
//   messagingSenderId: "139618548157",
//   appId: "1:139618548157:web:7c59a12dd6c53dcaa6fad4",
//   measurementId: "G-57QZQ6884V"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const googleProvider = new GoogleAuthProvider();

// const handleGoogleLogin = async (setError) => {
//     try {
//         const result = await signInWithPopup(auth, googleProvider);
//         console.log('Google Sign-In:', result.user);
//         setError('');
//     } catch (err) {
//         console.log(err);
//         setError('Google Sign-In failed');
//     }
// }

// const handleLogin = (e, setError) => {
//     e.preventDefault();
//     const email = e.target.email.value;
//     const password = e.target.password.value;
//     const auth = getAuth();

//     signInWithEmailAndPassword(auth, email, password)
//         .then((userCredential) => {
//             // Signed in
//             const user = userCredential.user;
//             console.log(user);
//             setError('');
//             // You can redirect or do something else here
//         })
//         .catch((error) => {
//             setError(error.message);
//         });
// };

// const handleSignUp = (e, setError, setSuccess) => { // Add setSuccess parameter
//     e.preventDefault();
//     const email = e.target.email.value;
//     const password = e.target.password.value;
//     const confirmPassword = e.target.confirmPassword.value;

//     if (password !== confirmPassword) {
//         setError("Passwords do not match.");
//         return;
//     }

//     const auth = getAuth();
//     createUserWithEmailAndPassword(auth, email, password)
//         .then((userCredential) => {
//             // Signed up
//             const user = userCredential.user;
//             // Send verification email
//             sendEmailVerification(auth.currentUser)
//                 .then(() => {
//                     // Email verification sent!
//                     setSuccess('Account created! Please check your email to verify your account.');
//                     setError('');
//                 });
//         })
//         .catch((error) => {
//             setSuccess('');
//             setError(error.message);
//         });
// };


// export { auth, googleProvider, handleGoogleLogin,handleSignUp,handleLogin }

import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    sendEmailVerification,
    signOut // Added signOut
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDykX7dsfBtBLLJQZCoseKFiKUzKu4ezuo",
  authDomain: "sumukhvisuals.firebaseapp.com",
  projectId: "sumukhvisuals",
  storageBucket: "sumukhvisuals.firebasestorage.app",
  messagingSenderId: "139618548157",
  appId: "1:139618548157:web:7c59a12dd6c53dcaa6fad4",
  measurementId: "G-57QZQ6884V"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const handleGoogleLogin = async (setError) => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log('Google Sign-In:', result.user);
        setError('');
    } catch (err) {
        console.log(err);
        setError('Google Sign-In failed');
    }
}

const handleLogin = (e, setError) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;

            // CHECK IF EMAIL IS VERIFIED
            if (!user.emailVerified) {
                setError("Please verify your email before logging in. Check your inbox.");
                await signOut(auth); // Sign them out so they stay on the login page
                return;
            }

            console.log("Logged in successfully:", user);
            setError('');
            // Optional: window.location.href = "/dashboard";
        })
        .catch((error) => {
            setError("Invalid email or password.");
        });
};

const handleSignUp = (e, setError, setSuccess) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;

            // 1. Send verification email
            await sendEmailVerification(user);

            // 2. IMPORTANT: Sign the user out immediately!
            // Firebase logs them in automatically after signup. 
            // We sign them out so they are forced to verify and then log in manually.
            await signOut(auth);

            setSuccess('Account created! Please check your Gmail to verify your account before logging in.');
            setError('');
        })
        .catch((error) => {
            setSuccess('');
            if (error.code === 'auth/email-already-in-use') {
                setError("This email is already registered.");
            } else {
                setError(error.message);
            }
        });
};

export { auth, googleProvider, handleGoogleLogin, handleSignUp, handleLogin }