import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from "./Home/Home.js";
import Room from "./Room/Room.js";
import Roomselect from "./Roomselect/Roomselect.js";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact> <Home/> </Route>
          <Route path="/rooms/:roomName" exact> <Room/> </Route>
          <Route path="/rooms" exact > <Roomselect/> </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
