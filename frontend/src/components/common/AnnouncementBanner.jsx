import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createNotificationEventSource } from "../../api/sse/eventSource.config";

const AnnouncementBanner = () => {
  const [message, setMessage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [animationDuration, setAnimationDuration] = useState("11s");

  const calculatedDurationForNotificationMessage = (messageLength) =>
    Math.max(11, Math.round(messageLength * 0.14));

  useEffect(() => {
    const notificationEventSource = createNotificationEventSource();

    let timers = [];

    const handleEvent = (event) => {
      const duration = calculatedDurationForNotificationMessage(
        event.data.length,
      );

      setIsClosing(false);
      setIsVisible(false);

      setAnimationDuration(`${duration}s`);

      setMessage(event.data);

      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);

      timers.push(timer);
    };

    notificationEventSource.addEventListener("maintenance", handleEvent);

    notificationEventSource.onError = (error) => {
      console.log("Sse error:", error);
    };

    return () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
      });

      notificationEventSource.removeEventListener("maintenance", handleEvent);

      notificationEventSource.close();
    };
  }, []);

  const handleCloseBanner = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMessage(null);
      setIsClosing(false);
      setIsVisible(false);
    }, 500);
  };

  const handleAnimationEnd = (event) => {
    if (event.animationName !== "marquee") return;
    handleCloseBanner();
  };

  if (!message) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 54,
        left: 0,
        right: 0,
        width: { xs: "90%", sm: "70%", md: "70%" },
        mx: "auto",
        zIndex: 99999,
        backgroundColor: "rgba(0,0,0,0.85)",
        borderRadius: 2,
        overflow: "hidden",
        py: 0.5,
        pl: 2,
        pr: 1,
        opacity: isClosing || !isVisible ? 0 : 1,
        transform: isVisible ? "translateY(0)" : "translateY(-15px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",

        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          flex: 1,
          height: 28,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          onAnimationEnd={handleAnimationEnd}
          sx={{
            position: "absolute",
            whiteSpace: "nowrap",
            color: "white",
            fontWeight: 600,
            fontSize: { xs: 14, sm: 16, md: 17 },
            animation: `marquee ${animationDuration} linear forwards 1s 3`,
            willChange: "transform",
            paddingLeft: "100%",

            "&:hover": {
              animationPlayState: "paused",
              cursor: "pointer",
            },

            "@keyframes marquee": {
              "0%": { transform: "translate3d(0, 0, 0)" },
              "100%": { transform: "translate3d(-100%, 0, 0)" },
            },
          }}
        >
          {message}
        </Typography>
      </Box>

      <IconButton
        onClick={handleCloseBanner}
        sx={{
          color: "rgba(255,255,255,0.5)",
          marginLeft: 1,
          "&:hover": {
            color: "white",
            backgroundColor: "rgba(255,255,255,0.1)",
          },
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

export default AnnouncementBanner;
