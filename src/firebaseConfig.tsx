// Import the functions you need from the SDKs you need
import {getApps, initializeApp} from "firebase/app";
import {Auth, getAuth} from "@firebase/auth";
import {getFirestore, Firestore} from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MASSAGE_SENDER_ID,
    appId:process.env.NEXT_PUBLIC_APP_ID
};

let app;
let auth: Auth;

let firebaseDB: Firestore;

// Initialize Firebase
if (!getApps().length){
    app = initializeApp(firebaseConfig);
    auth = getAuth(app)
    firebaseDB = getFirestore(app)
}

export {app, auth, firebaseDB}