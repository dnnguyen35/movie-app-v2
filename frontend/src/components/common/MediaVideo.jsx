import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

import tmdbConfigs from "../../api/configs/tmdb.configs";

const MediaVideo = ({ video }) => {
  const iframeRef = useRef();

  const videoId = new URL(video).searchParams.get("v");

  useEffect(() => {
    if (!iframeRef.current) return;

    const height = (iframeRef.current.offsetWidth * 9) / 16 + "px";

    iframeRef.current.setAttribute("height", height);
  }, [video]);

  return (
    <Box
      sx={{
        height: "max-content",
        border: "none",
        borderColor: "primary.main",
      }}
    >
      <iframe
        key={video}
        src={tmdbConfigs.youtubePath(videoId)}
        ref={iframeRef}
        width="100%"
        title={"media-video"}
        allowFullScreen
        allow="fullscreen"
        style={{ border: 0 }}
      ></iframe>
    </Box>
  );
};

export default MediaVideo;
