import React, { Component } from 'react';
import './App.css';
import { status, json, makeGraph } from './helpers.js'
class App extends Component {
  
  componentDidMount() {
    // get json data and make graph
    fetch(
      "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
    )
      .then(status)
      .then(json)
      .then(data => {
        makeGraph(data);
      });
  }
  render() {
    return (
      <div className="App">
        <h1>Doping in Professional Bicycle Racing</h1>
        <h2>35 Fastest times up Alpe d'Huez (doping allegations in red)</h2>
        <div className="svg-container"></div>
      </div>
    );
  }
}

export default App;
