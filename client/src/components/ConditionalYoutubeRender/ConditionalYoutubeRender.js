import React from "react";
import Youtube from "react-youtube";
import "./ConditionalYoutubeRender.css";

export default (props) => {
  if (props.videoLoaded) {
    let ytOPS = props.opts;
    let storeYT = props.onReady;
    let stateChange = props.onStateChange;
    return (<Youtube className="youtubePlayer" opts={ytOPS} videoId="" onReady={storeYT} onStateChange={stateChange}/>)
    
  } else {
    return (
      <div className="noVideoLoadedDiv">
        <h1 className="noVideoLoadedH1"> NO VIDEO LOADED </h1>
      </div>
    )
  }
}
