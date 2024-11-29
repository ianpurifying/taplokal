import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXpZnxZnxT8IFJOZhVsZOQ3fTjjZ6s2yw",
  authDomain: "taplokal-9091d.firebaseapp.com",
  projectId: "taplokal-9091d",
  storageBucket: "taplokal-9091d.appspot.com",
  messagingSenderId: "369614112829",
  appId: "1:369614112829:web:5431f3732b6c86de114254"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const fs = getFirestore(app);
const storage = getStorage(app);

export { app, fs, auth, storage };