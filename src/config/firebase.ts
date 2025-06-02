import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDzckK_CPLIIXI6NGNlzlzexe3lms6Qfgk",
  authDomain: "register-95b5b.firebaseapp.com",
  databaseURL: "https://register-95b5b-default-rtdb.firebaseio.com",
  projectId: "register-95b5b",
  storageBucket: "register-95b5b.firebasestorage.app",
  messagingSenderId: "201147535765",
  appId: "1:201147535765:web:110b4d63e141379bbea69c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
