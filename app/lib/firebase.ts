import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCBn2Pw2hMYBKRvpaMRBBtfqjeb7cK1fQ0",
  authDomain: "habuild-quiz.firebaseapp.com",
  projectId: "habuild-quiz",
  storageBucket: "habuild-quiz.firebasestorage.app",
  messagingSenderId: "356629741857",
  appId: "1:356629741857:web:23387790716356dd09fe60",
  measurementId: "G-579DWGF6LZ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
