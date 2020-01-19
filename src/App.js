import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      enemies: ["one", "two", "three"]
    };
    // ref to input element
    this.inputRef = React.createRef();
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
    this.setState({
      enemies: this.state.enemies.concat(this.inputRef.current.value)
    });
    this.inputRef.current.value = "";
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">Input no persistance</header>
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
