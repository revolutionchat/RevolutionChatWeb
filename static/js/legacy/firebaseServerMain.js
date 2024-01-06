// Firebase configuration

import { initialiseApp } from 'https://gstatic.com/firebasejs/9.1.0/firebase-app.js';
import { getDatabase, ref, set, child, update, remove } from "https://gstatic.com/firebasejs/9.1.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAotlrIKY14LMeslegj0z4tCuAzN9hprgU",
    authDomain: "goobler-2.firebaseapp.com",
    databaseURL: "https://goobler-2-default-rtdb.firebaseio.com",
    projectId: "goobler-2",
    storageBucket: "goobler-2.appspot.com",
    messagingSenderId: "376101565699",
    appId: "1:376101565699:web:66082bfa455536dddaa536",
    measurementId: "G-QJ1HF431F3"
  };

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize variables
const db = getDatabase();

// Setup register function eric what is firebase
function insertData() {
  set(ref(db, Math.random()), {
    messages: []
  });
}