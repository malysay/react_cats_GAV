
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// firebase.js
import { getDatabase, ref, push, onValue } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzisErhe8ykeuSiBPa0MjFL3nb3wKGp5s",
  authDomain: "textsender-3a06c.firebaseapp.com",
  databaseURL: "https://textsender-3a06c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "textsender-3a06c",
  storageBucket: "textsender-3a06c.firebasestorage.app",
  messagingSenderId: "306758404347",
  appId: "1:306758404347:web:76c4631c5d728c340b485e",
  measurementId: "G-F5F69XCW3R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, push, onValue };