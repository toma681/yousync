import {useHistory} from 'react-router-dom';
import randStr from "randomstring";
import React from "react";
import Header from "../Header/Header.js";
import Footer from "../Footer/Footer.js";
import {Grid, Button} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import "./Home.css";

export default () => {
  const history = useHistory();

  function makeNewRoomRandom() {
    let newRoom = randStr.generate(10);
    history.push(`/rooms/${newRoom}`);
  }

  function navToSelectRoom() {
    history.push("/rooms");
  }

  const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(10),
    borderRadius: "3em",
    backgroundColor: "#0C0C0C"
  }
  }));
  const classes = useStyles();

  return (
    <div className="container">
      <Header />
      <Grid className="homeContainer" container direction="column" alignItems="center" justify="center">
        <Grid item>
          <h1 className="topItem"> Watch YouTube Videos together </h1>
        </ Grid>
        <Grid item>
          <Button className={ `${classes.button} createRoomBtn` } size="large" onClick={makeNewRoomRandom} variant="text" color="default">
            <h1> Create Room </h1>
          </Button>
        </ Grid>
        <Grid item>
          <h1> OR </h1>
        </ Grid>
        <Grid item>
          <Button className={ `${classes.button} createRoomBtn` } size="large" onClick={navToSelectRoom} variant="text" color="default">
            <h1> Browse Rooms </h1>
          </Button>
        </ Grid>
      </ Grid>
      <Footer marginTop="300px" />
    </div>
  );
}
