// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYF5Aa03yWdG7h-fBDfphjjo8hlPPwS6s",
  authDomain: "tebohoproject.firebaseapp.com",
  projectId: "tebohoproject",
  storageBucket: "tebohoproject.firebasestorage.app",
  messagingSenderId: "536814451439",
  appId: "1:536814451439:web:338d3b00a5d1fcbd5c391a",
  measurementId: "G-N72RYH4FXS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);



