import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
const config = {
    apiKey: "AIzaSyCATk54OhYJ3FOQE0da91PqnCja87OP5uU",
    authDomain: "supplychainmanagement-8a41d.firebaseapp.com",
    projectId: "supplychainmanagement-8a41d",
    storageBucket: "supplychainmanagement-8a41d.appspot.com",
    messagingSenderId: "98420589020",
    appId: "1:98420589020:web:ace01633d4cb10f9ab0f19",
    measurementId: "G-38L6DJR19P"
  };
const firebase = !Firebase.apps.length ? Firebase.initializeApp(config) : Firebase.app();
const { FieldValue } = Firebase.firestore;
// seedDatabase(firebase)
export { firebase, FieldValue};