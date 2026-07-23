import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

import tmdbConfigs from "../../api/configs/tmdb.configs";

const MediaVideo = ({ video }) => {
  const iframeRef = useRef();

  useEffect(() => {
    if (!iframeRef.current) return;

    const height = (iframeRef.current.offsetWidth * 9) / 16 + "px";

    iframeRef.current.setAttribute("height", height);
  }, [video]);

  return (
    <Box
      sx={{
        height: "max-content",
        border: video.key.includes("index.m3u8") ? "5px solid" : "none",
        borderColor: "primary.main",
      }}
    >
      <iframe
        key={video.key}
        src={
          video.key.includes("embed.php")
            ? video.key
            : tmdbConfigs.youtubePath(video.key)
        }
        ref={iframeRef}
        width="100%"
        title={video?.id ? video.id : "media-video"}
        allowFullScreen
        allow="fullscreen"
        style={{ border: 0 }}
      ></iframe>
    </Box>
  );
};

export default MediaVideo;
