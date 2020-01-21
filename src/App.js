import React, { useState, useEffect } from "react";
import "./App.css";
import firebase from "firebase";
import "firebase/firestore";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

export default function App(props) {
  const [enemies, setEnemies] = useState([]); // store
  const [newEnemy, setNewEnemy] = useState(""); // store
  const [isSignedIn, setSignedIn] = useState(false); // Local signed-in state.
  const [user, setUser] = useState(null); //logged in user

  const FIREBASE_COLLECTION = "cats-dogs-col";
  const firestore = initFirestore();
  const uiConfig = loginUI();

  const removeEnemy = enemyToRemove => {
    // setEnemies(enemies.filter(enemy => enemy !== enemyToRemove));
    firestore
      .collection(FIREBASE_COLLECTION)
      .doc(enemyToRemove)
      .delete()
      .then(function() {
        console.log(
          "removeEnemy: Document successfully deleted!",
          enemyToRemove
        );
      })
      .catch(function(error) {
        console.error("removeEnemy: Error removing document: ", error);
      });
  };

  const addEnemy = () => {
    if (newEnemy !== "") {
      // setEnemies(enemies.concat(newEnemy));
      firestore
        .collection(FIREBASE_COLLECTION)
        .add({ name: newEnemy })
        .then(() => {
          setNewEnemy("");
          console.log("addEnemy: Document successfully written!");
        })
        .catch(function(error) {
          console.error("addEnemy: Error writing document: ", error);
        });
    }
  };

  function handleNewEnemyChange(e) {
    setNewEnemy(e.target.value);
  }

  useEffect(() => {
    //Read colls from db
    firestore.collection("cats-dogs-col").onSnapshot(querySnapshot => {
      console.log("useEffect: Current data", querySnapshot);
      setEnemies(
        querySnapshot.docs.map(entry => {
          // return entry.data().name;
          return [entry.id, entry.data().name];
        })
      );
    });

    // Listen to the Firebase Auth state and set the local state.
    let unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      console.log("useEffect: user", user);
      setUser(user);
      setSignedIn(!!user);
    });

    // Make sure we un-register Firebase observers when the component unmounts
    return () => {
      unregisterAuthObserver();
    };
  }, [newEnemy]);

  console.log("enemies", enemies);
  return (
    <div className="App">
      {/* <header className="App-header">react-firebase app</header> */}
      <header className="App-header">
        Welcome to react-firestore persistance
        {!isSignedIn ? (
          <div>
            <h4>react-firestore App</h4>
            <p>Please sign-in to add to list:</p>
            <StyledFirebaseAuth
              uiConfig={uiConfig}
              firebaseAuth={firebase.auth()}
            />
          </div>
        ) : (
          <div>
            <h4>react-firestore App</h4>
            <p>
              Welcome{" "}
              {isSignedIn &&
                firebase.auth().currentUser &&
                firebase.auth().currentUser.displayName}
              ! You are now signed-in!
            </p>
            <button onClick={() => firebase.auth().signOut()}>Sign-out</button>
          </div>
        )}
      </header>
      {/* Input form only visible to admin user */}
      {isSignedIn && user && user.uid === process.env.REACT_APP_PID && (
        <div>
          <div className="add-enemy-form">
            <input
              label={newEnemy}
              value={newEnemy}
              onChange={handleNewEnemyChange}
            />
            <button onClick={addEnemy}>add enemy</button>
          </div>

          <div className="enemies-list">
            {enemies.map((entry, index) => (
              <button onClick={() => removeEnemy(entry[0])} key={entry[0]}>
                {entry[1]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function initFirestore() {
  // Your web app's Firebase configuration
  let firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
  };

  !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();
  const firestore = firebase.firestore();
  return firestore;
}

function loginUI() {
  // Configure FirebaseUI.
  let uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    signInSuccessUrl: "/signedIn",
    // We will display Google as auth providers.
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  };
  return uiConfig;
}
