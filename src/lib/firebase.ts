'use client';

// Import functions you need from SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, getDoc, setDoc, query, where, updateDoc, deleteDoc, serverTimestamp, doc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrmdxcWxOdxl0v_ARD8knKC2CcaAIXlIc",
  authDomain: "marktools-web-29d8e.firebaseapp.com",
  projectId: "marktools-web-29d8e",
  storageBucket: "marktools-web-29d8e.firebasestorage.app",
  messagingSenderId: "674926800702",
  appId: "1:674926800702:web:e28d13ee4ba9b1b496466f",
  measurementId: "G-6V1HDZC0R5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export { 
  app, 
  analytics, 
  auth, 
  db, 
  googleProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  doc
};