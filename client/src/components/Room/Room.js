import React, { useState, useEffect, useRef } from "react";
import RoomHeader from "../RoomHeader/RoomHeader.js";
import { Grid, TextField } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import ConditionalYoutube from "../ConditionalYoutubeRender/ConditionalYoutubeRender.js";
import Footer from "../Footer/Footer.js";
import { useParams } from "react-router-dom";
import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import getYoutubeTitle from "get-youtube-title";
import getRandomColor from "randomcolor";
import io from "socket.io-client";
import "./Room.css";

export default (props) => {
  const socketRef = useRef();
  let { roomName } = useParams();
  let myColorRef = useRef();
  let myUsername = useRef();
  let youtubeRef = useRef();
  let [curTimes, setCurTime] = useState(0);
  let [youtubeURL, setURL] = useState("");
  let [isVideoLoaded, setIsVideoLoaded] = useState(false);
  let [youtubeTitle, setYoutubeTitle] = useState("No Video Loaded");
  let [currentMessage, setCurrentMessage] = useState("");
  let [messageList, setMessageList] = useState([]);
  let playerRef = useRef();

  const config = {
    dictionaries: [adjectives, colors, animals],
    style: "capital",
    separator: "",
  };

  useEffect(() => {
    myColorRef.current = getRandomColor();
    myUsername.current = uniqueNamesGenerator(config);
    playerRef.current = false;

    socketRef.current = io("https://youtubesyncbackend.herokuapp.com");
    socketRef.current.emit("roomName", roomName);
    socketRef.current.emit("getPrevMessages", roomName);

    socketRef.current.emit("checkIfLoaded", roomName);
    socketRef.current.emit("sendUserName", myUsername.current);
    socketRef.current.emit("sendMessage", {
      currentMessage: `${myUsername.current} has joined the room`,
      roomName,
      color: null,
      userName: null,
    });
    socketRef.current.on("receiveMessage", (msg) => {
      setMessageList(msg);
      let scrollDiv = document.querySelector(".scrollDiv");
      scrollDiv.scrollTop = scrollDiv.scrollHeight;
    });

    socketRef.current.on("receivePlay", () => {
      youtubeRef.current.playVideo();
    });

    socketRef.current.on("receivePause", () => {
      youtubeRef.current.pauseVideo();
    });

    socketRef.current.on("receiveLoaded", (isLoaded) => {
      if (isLoaded.loaded) {
        playerRef.current = true;
        setIsVideoLoaded(true);
        setTimeout(() => {
          youtubeRef.current.loadVideoById(isLoaded.videoID);
          getYoutubeTitle(isLoaded.videoID, (err, title) => {
            setYoutubeTitle(title);
          });
          socketRef.current.emit("sendSeek", { name: roomName, time: 0 });
        }, 1000);
      }
    });

    socketRef.current.on("receiveVideoSwitch", (id) => {
      if (!playerRef.current) {
        setIsVideoLoaded(true);

        const int = setInterval(() => {
          if (playerRef.current) {
            youtubeRef.current.loadVideoById(id);
            getYoutubeTitle(id, (err, title) => {
              setYoutubeTitle(title);
            });
            clearInterval(int);
          }
        }, 100);
      } else {
        youtubeRef.current.loadVideoById(id);
        getYoutubeTitle(id, (err, title) => {
          setYoutubeTitle(title);
        });
      }
    });

    socketRef.current.on("receiveSeek", (seekToTime) => {
      youtubeRef.current.seekTo(seekToTime);
    });

    let checkSeek;
    let check = setInterval(() => {
      if (playerRef.current) {
        clearInterval(check);
        setTimeout(() => {
          checkSeek = setInterval(() => {
            let time = youtubeRef.current.getCurrentTime();
            setCurTime((prevTime) => {
              // Assume seek is always > 1/2 of a second
              if (Math.abs(time - prevTime) > 0.5) {
                socketRef.current.emit("sendSeek", { name: roomName, time });
              }
              return time;
            });
          }, 100);
        }, 1000);
      }
    }, 100);

    return () => {
      clearInterval(checkSeek);
      socketRef.current.close();
    };
  }, [roomName]);

  function handleSendMessage(e) {
    e.preventDefault();
    if (currentMessage !== "") {
      socketRef.current.emit("sendMessage", {
        currentMessage,
        roomName,
        color: myColorRef.current,
        userName: myUsername.current,
      });
      setCurrentMessage("");
    }
  }

  function editMessage(e) {
    setCurrentMessage(e.target.value);
  }

  function storeYT(event) {
    playerRef.current = true;
    youtubeRef.current = event.target;
  }

  function makeVideoSwitch(e) {
    e.preventDefault();
    let urlInput = youtubeURL;
    setURL("");
    // let id = urlInput.match(/(?<=v=).{11}/); Safari does not Support this
    let id = urlInput.match(/v=.{11}/);
    if (id) {
      let data = { roomName, id: id[0].substring(2) };
      socketRef.current.emit("sendVideoSwitch", data);
    }
  }

  function stateChange(event) {
    if (event.data === 1) {
      socketRef.current.emit("sendPlay", roomName);
    } else if (event.data === 2) {
      socketRef.current.emit("sendPause", roomName);
    }
  }

  const ytOPS = {
    height: "620",
    width: "1000",
  };

  function handleURLChange(e) {
    setURL(e.target.value);
  }

  const theme = createMuiTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 1587,
        lg: 1920,
        xl: 4000,
      },
    },
  });

  return (
    <div className="roomContainer">
      <RoomHeader />
      <ThemeProvider theme={theme}>
        <Grid container direction="row">
          <Grid item xs={12}>
            <form onSubmit={makeVideoSwitch}>
              <TextField
                size="small"
                autoComplete="off"
                onChange={handleURLChange}
                value={youtubeURL}
                placeholder="Enter Youtube URL Here"
                id="outlined-basic"
                className="inputVideoURL"
                variant="outlined"
                inputProps={{ style: { color: "white" } }}
              />
            </form>
          </Grid>

          <Grid item xs={12}>
            <h1 className="videoTitle"> {youtubeTitle} </h1>
          </Grid>

          <Grid item sm={8}>
            <ConditionalYoutube
              opts={ytOPS}
              videoLoaded={isVideoLoaded}
              onReady={storeYT}
              onStateChange={stateChange}
            />
          </Grid>

          <Grid item sm={8} md={3}>
            <div className="messageOuterDiv">
              <div className="scrollDiv">
                <ul>
                  {messageList.map((item, index) => {
                    return item.userName ? (
                      <li className="messageItem" key={index}>
                        {" "}
                        <span style={{ color: item.color }}>
                          {" "}
                          {item.userName}:{" "}
                        </span>{" "}
                        <span style={{ color: "white" }}>
                          {" "}
                          {item.currentMessage}{" "}
                        </span>{" "}
                      </li>
                    ) : (
                      <li className="messageItem joinLeaveMessage" key={index}>
                        {" "}
                        {item.currentMessage}{" "}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <form onSubmit={handleSendMessage}>
                <TextField
                  className="sendMessageField"
                  size="small"
                  autoComplete="off"
                  onChange={editMessage}
                  value={currentMessage}
                  placeholder="Enter Message"
                  id="outlined-basic"
                  variant="outlined"
                  inputProps={{ style: { color: "white" } }}
                />
              </form>
            </div>
          </Grid>
        </Grid>
      </ThemeProvider>
      <Footer marginTop="600px" />
    </div>
  );
};
