import React, { Component } from "react";
import "./App.css";
import firebase from 'firebase'
import 'firebase/firestore'

class App extends Component {
  constructor() {
    super();
    this.state = {
      // enemies: ["one", "two", "three"]
      enemies: []
    };
    // ref to input element
    this.inputRef = React.createRef();
        
    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: process.env.REACT_APP_API_KEY,
      authDomain: process.env.REACT_APP_AUTH_DOMAIN,
      databaseURL: process.env.REACT_APP_DATABASE_URL,
      projectId: process.env.REACT_APP_PROJECT_ID,
      storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_APP_ID,
      measurementId: process.env.REACT_APP_MEASUREMENT_ID,
    };
    
    firebase.initializeApp(firebaseConfig)
    this.firestore = firebase.firestore()
  }

  // const [enemies, setEnemies] = useState(["one", "two", "three"]);
  // useEffect() {
  //   setEnemies(removeEnemy(enemyToRemove)
  // }

  removeEnemy = enemyToRemove => {
    this.setState({
      enemies: this.state.enemies.filter(enemy => enemy !== enemyToRemove)
    });
  };

  addEnemy = () => {
    // this.setState({
    //   enemies: this.state.enemies.concat(this.inputRef.current.value)
    // });
    // this.inputRef.current.value = "";
    this.firestore.collection('cats-dogs-col')
    .add({name: this.inputRef.current.value})
    .then(()=>{
      this.inputRef.current.value=''
      console.log("addEnemy: Document successfully written!");
    })
    .catch(function(error) {
      console.error("addEnemy: Error writing document: ", error);
    });
  };

  componentDidMount(){
    //Read colls from db
    this.firestore.collection('cats-dogs-col')
    .onSnapshot(querySnapshot => {
      console.log("CDM: Current data", querySnapshot);
      this.setState({
        enemies: querySnapshot.docs.map(entry => entry.data().name)
      })
    })
    
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">Writing to firestore persistance</header>
        <div className="add-enemy-form">
          <input ref={this.inputRef} />
          <button onClick={this.addEnemy}>add enemy</button>
        </div>
        <div className="enemies-list">
          {this.state.enemies.map(enemy => (
            <button onClick={() => this.removeEnemy(enemy)} key={enemy}>
              {enemy}
            </button>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
