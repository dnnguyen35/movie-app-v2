import React from "react";
import MediaPlayer from "../components/common/MediaPlayer";

const Testpage = () => {
  return (
    <MediaPlayer
      videoUrl={"https://v7.kkphimplayer7.com/20260630/wjbHjWYF/index.m3u8"}
      mediaThumbUrl={
        "https://fastly.picsum.photos/id/136/600/600.jpg?hmac=TykiDjJbAB-ETIFKZ9yTgEWXE13I8-ges2IrbOKKZIk"
      }
    />
  );
};

export default Testpage;
