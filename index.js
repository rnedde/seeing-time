// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";

console.log("hello");
const { initializeApp } = require("firebase/app");

const { getDatabase, ref, set, get, onValue, push } = require("firebase/database");
const firebaseDatabase = require("firebase/database");


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// const { getDatabase } = require("firebase/database");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQTe_Pn-hreXMg3HD-v9ODtmSGfUNMx9w",
  authDomain: "seeing-time-58600.firebaseapp.com",
  databaseURL: "https://seeing-time-58600-default-rtdb.firebaseio.com",
  projectId: "seeing-time-58600",
  storageBucket: "seeing-time-58600.firebasestorage.app-x",
  messagingSenderId: "337990844288",
  appId: "1:337990844288:web:42a0229a238f801c10cb65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Realtime Database instance
const database = getDatabase(app);
const dbRef = ref(database, "example");


// Write data to the database
async function writeData() {
  try {
    await firebaseDatabase.push(dbRef, {
      name: "John Doe 2",
      age: 30,
      isAdmin: false,
    });
    console.log("Data written successfully");
  } catch (error) {
    console.error("Error writing data:", error);
  }
}

// Read data from the database once
async function readDataOnce() {
  try {
    const snapshot = await firebaseDatabase.get(dbRef);
    if (snapshot.exists()) {
      console.log("Data:", snapshot.val());
    } else {
      console.log("No data found");
    }
  } catch (error) {
    console.error("Error reading data:", error);
  }
}

// Run Firebase operations
(async () => {
  await writeData();
  await readDataOnce();
})();