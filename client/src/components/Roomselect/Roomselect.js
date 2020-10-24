import React, {useState, useEffect, useRef} from 'react';
import Header from "../Header/Header.js";
import Footer from "../Footer/Footer.js";
import {Grid, Button} from '@material-ui/core';
import {useHistory} from 'react-router-dom';
import io from "socket.io-client";
import "./Roomselect.css";

export default (props) => {
  const socketRef = useRef();
  let socket;
  const history = useHistory();
  let [roomList, setRoomList] = useState([]);

  useEffect(() => {
    socketRef.current = io("https://youtubesyncbackend.herokuapp.com");

    socketRef.current.emit("getRoomList");
    socketRef.current.on("receiveRoomList", rooms => {
      setRoomList(rooms);
    });

    return () => {
      socketRef.current.close();
    }
  }, [socket]);

  function handleRefresh() {
    socketRef.current.emit("getRoomList");
  }

  return (
    <div>
      <Header />
      <Grid container className="roomSelectContainer">
        <Grid item xs={12}> <h1 className="browseRoomsH1"> Browse Rooms &nbsp;&nbsp;<Button onClick={ handleRefresh }variant="contained" color="default"> Refresh </Button></h1> </Grid>
        {roomList.map((item, id) => {
          return (
            <Grid item xs={12} sm={12} md={4} key={id}>
              <div className="roomChoiceOuterDiv" onClick={() => history.push(`/rooms/${item.name}`)}>
                <h1 className="roomNumberH1"> {`Room #${id + 1}`} </h1>
              </div>
            </Grid>)
        })}
      </Grid>
      <Footer marginTop="1000px" />
    </div>
  );
}
