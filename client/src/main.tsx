import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { db, auth } from './lib/firebase';
import { collection, addDoc, getDocs, getDoc, setDoc, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';

// Temporarily expose Firebase functions for console access
if (typeof window !== 'undefined') {
  (window as any).db = db;
  (window as any).auth = auth;
  (window as any).collection = collection;
  (window as any).addDoc = addDoc;
  (window as any).getDocs = getDocs;
  (window as any).query = query;
  (window as any).where = where;
  (window as any).orderBy = orderBy;
  (window as any).doc = doc;
  (window as any).updateDoc = updateDoc;
  (window as any).getDoc = getDoc;
  (window as any).setDoc = setDoc;
  console.log('🔧 Firebase functions exposed to window for console access');
  console.log('💡 Available: window.db, window.auth, window.collection, window.addDoc, window.getDocs, window.query, window.where, window.orderBy, window.doc, window.updateDoc');
}
createRoot(document.getElementById("root")!).render(<App />);
