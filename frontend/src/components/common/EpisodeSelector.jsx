import { Box, Button, Stack, Tab, Tabs, useTheme } from "@mui/material";

const EpisodeSelector = ({
  episodes,
  currentServer,
  setCurrentServer,
  currentEpisode,
  setCurrentEpisode,
}) => {
  const theme = useTheme();

  const currentServerIndex = episodes.findIndex(
    (server) => server.server_name === currentServer.server_name,
  );

  const handleServerChange = (_, newIndex) => {
    const server = episodes[newIndex];
    setCurrentServer(server);
    // setCurrentEpisode(server.items[0]);
  };

  return (
    <Box>
      <Tabs
        value={currentServerIndex}
        onChange={handleServerChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 2,
          "& .MuiTab-root": {
            color: "text.secondary",
          },
          "& .Mui-selected": {
            color: "primary.main",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "primary.main",
          },
        }}
      >
        {episodes.map((server, index) => (
          <Tab key={index} label={server.server_name} />
        ))}
      </Tabs>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(3,1fr)",
            sm: "repeat(5,1fr)",
            md: "repeat(8,1fr)",
          },
          gap: 1,
        }}
      >
        {currentServer.server_data.map((episode) => {
          const selected = currentEpisode?.slug === episode.slug;

          return (
            <Button
              key={episode.slug}
              variant={selected ? "contained" : "outlined"}
              onClick={() => setCurrentEpisode(episode)}
              sx={{
                textTransform: "none",

                bgcolor: selected ? "primary.main" : "background.paper",

                color: selected ? "primary.contrastText" : "text.primary",

                borderColor: "primary.main",

                "&:hover": {
                  bgcolor: selected ? "primary.dark" : "action.hover",
                },
              }}
            >
              {episode.name}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
};

export default EpisodeSelector;
