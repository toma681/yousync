import React from "react";
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import "./Header.css";

export default () => {
  const history = useHistory();
  function navHome() {
    history.push("/");
  }

  return (
    <div className="headerContainer">
      <Grid container alignItems="center" justify="center">
        <Grid item >
          <h1 className="header" onClick={navHome}> Youtube Sync </h1>
        </ Grid>
      </ Grid>
    </div>
  )
}
