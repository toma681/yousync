import React from "react";
import {Grid} from '@material-ui/core';
import {useHistory} from 'react-router-dom';
import "./RoomHeader.css";

export default () => {
  const history = useHistory();
  function navHome() {
    history.push("/");
  }

  return (
    <div className="roomHeaderContainer">
      <Grid container>

        <Grid item >
          <h1 className="roomHeader" onClick={navHome}> Youtube Sync </h1>
        </ Grid>

      </ Grid>
    </div>
  );
}
