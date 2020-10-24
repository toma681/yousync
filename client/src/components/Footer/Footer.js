import React from "react";
import {Grid} from '@material-ui/core';
import "./Footer.css"

export default (props) => {
  return (
    <div className="footerContainer" style={{marginTop: props.marginTop}}>
      <Grid direction="column" container alignItems="center" justify="center" >

        <Grid item >
          <h1 className="footerText" style={{}}> © Youtube Sync 2020 </h1>
        </ Grid>

        <Grid item >
          <p className="footerP footerText"> Andrew T </p>
        </ Grid>

      </ Grid>
    </div>
  );
}
