import React, { useRef, useEffect, useState } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";
import { useMediaQuery, useTheme } from "@mui/material";

import { Box } from "@mui/material";

const MediaPlayer = ({ videoUrl, mediaThumbUrl }) => {
  const artPlayerRef = useRef(null);
  const artPlayerInstanceRef = useRef(null);
  const hlsInstanceRef = useRef(null);

  const theme = useTheme();

  const [isVideoMetadataLoaded, setIsVideoMetadataLoaded] = useState(false);

  useEffect(() => {
    if (!artPlayerRef.current) return;

    const artPlayer = new Artplayer({
      container: artPlayerRef.current,
      url: videoUrl,
      poster: mediaThumbUrl,
      type: "m3u8",
      customType: {
        m3u8: (video, url) => {
          hlsInstanceRef.current?.destroy();
          hlsInstanceRef.current = null;

          setIsVideoMetadataLoaded(false);

          video.addEventListener(
            "loadedmetadata",
            () => {
              setIsVideoMetadataLoaded(true);
            },
            { once: true },
          );

          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);

            hlsInstanceRef.current = hls;
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          }
        },
      },
      controls: [
        {
          name: "backward10",
          position: "left",
          tooltip: "Back 10 seconds",
          index: 28,
          html: `
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8"></path>
              <path d="M10.89 16h-.85v-3.26l-1.01.31v-.69l1.77-.63h.09zm4.28-1.76c0 .32-.03.6-.1.82s-.17.42-.29.57-.28.26-.45.33-.37.1-.59.1-.41-.03-.59-.1-.33-.18-.46-.33-.23-.34-.3-.57-.11-.5-.11-.82v-.74c0-.32.03-.6.1-.82s.17-.42.29-.57.28-.26.45-.33.37-.1.59-.1.41.03.59.1.33.18.46.33.23.34.3.57.11.5.11.82zm-.85-.86c0-.19-.01-.35-.04-.48s-.07-.23-.12-.31-.11-.14-.19-.17-.16-.05-.25-.05-.18.02-.25.05-.14.09-.19.17-.09.18-.12.31-.04.29-.04.48v.97c0 .19.01.35.04.48s.07.24.12.32.11.14.19.17.16.05.25.05.18-.02.25-.05.14-.09.19-.17.09-.19.11-.32.04-.29.04-.48v-.97z"></path>
            </svg>
          `,
          click: () => {
            artPlayer.backward = 10;
          },
        },
        {
          name: "forward10",
          position: "left",
          tooltip: "Forward 10 seconds",
          index: 29,
          html: `
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M18 13c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6v4l5-5-5-5v4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8z"></path>
              <path d="M10.86 15.94v-4.27h-.09L9 12.3v.69l1.01-.31v3.26zm1.39-2.5v.74c0 1.9 1.31 1.82 1.44 1.82.14 0 1.44.09 1.44-1.82v-.74c0-1.9-1.31-1.82-1.44-1.82-.14 0-1.44-.09-1.44 1.82m2.04-.12v.97c0 .77-.21 1.03-.59 1.03s-.6-.26-.6-1.03v-.97c0-.75.22-1.01.59-1.01.38-.01.6.26.6 1.01"></path>
            </svg>
          `,
          click: () => {
            artPlayer.forward = 10;
          },
        },
      ],

      setting: true,
      playbackRate: true,
      fullscreen: true,
      autoplay: false,
      autoPlayback: false,
      autoSize: true,
      pip: false,

      gesture: false,
      isLive: false,
      autoOrientation: true,
      lockScreen: true,
      flip: true,
    });

    artPlayerInstanceRef.current = artPlayer;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        artPlayer.pause();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      hlsInstanceRef.current?.destroy();
      hlsInstanceRef.current = null;

      artPlayerInstanceRef.current?.destroy(false);
      artPlayerInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (artPlayerInstanceRef.current) {
      if (videoUrl) {
        artPlayerInstanceRef.current.url = videoUrl;
      }

      if (mediaThumbUrl) {
        artPlayerInstanceRef.current.poster = mediaThumbUrl;
      }
    }
  }, [videoUrl]);
  return (
    <Box
      sx={{
        position: "relative",
        height: "max-content",
        aspectRatio: "16/9",
        borderRadius: "1%",
        overflow: "hidden",
        boxShadow: 3,
      }}
    >
      <Box
        ref={artPlayerRef}
        sx={{
          width: "100%",
          height: "100%",
        }}
      />
      {!isVideoMetadataLoaded && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 9999,
            cursor: "wait",
            pointerEvents: "auto",
          }}
        />
      )}
    </Box>
  );
};

export default MediaPlayer;
