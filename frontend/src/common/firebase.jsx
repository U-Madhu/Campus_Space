
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import{GoogleAuthProvider,getAuth, signInWithPopup} from "firebase/auth"


const firebaseConfig = {
  apiKey: "AIzaSyCFhmPyeAZftlQKPepHpQnAB5Gb5q1c3YY",
  authDomain: "campus-space-01.firebaseapp.com",
  projectId: "campus-space-01",
  storageBucket: "campus-space-01.firebasestorage.app",
  messagingSenderId: "366927803649",
  appId: "1:366927803649:web:d982ac4f2bd8bcb58fd700",
  measurementId: "G-NRCXN6VKMP"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Google Autentication 

const provider=new GoogleAuthProvider();
const auth=getAuth();

export const authWithGoogle=async()=>{
  let user=null;
  await signInWithPopup(auth,provider).then((result)=>{
    user=result.user;
  }).catch((err)=>{console.log(err)})

  return user;
}