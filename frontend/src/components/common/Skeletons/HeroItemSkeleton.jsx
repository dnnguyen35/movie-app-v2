import { Box, Skeleton, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import uiConfigs from "../../../configs/ui.configs";

const HeroItemSkeleton = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        color: "primary.contrastText",
        "&::before": {
          content: '""',
          width: "100%",
          height: "30%",
          position: "absolute",
          bottom: 0,
          left: 0,
          zIndex: 2,
          pointerEvents: "none",
          ...uiConfigs.style.gradientBgImage[theme.palette.mode],
        },
      }}
    >
      {/* hero image skeleton */}
      <Box
        sx={{
          paddingTop: {
            xs: "130%",
            sm: "80%",
            md: "60%",
            lg: "45%",
          },
          backgroundPosition: "top",
          backgroundSize: "cover",
          position: "relative",
        }}
      >
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
      {/* hero image skeleton */}

      {/* horizontal gradient */}
      <Box
        sx={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          ...uiConfigs.style.horizontalGradientBgImage[theme.palette.mode],
        }}
      />
      {/* horizontal gradient */}

      {/* content */}
      <Box
        sx={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          paddingX: {
            sm: "10px",
            md: "5rem",
            lg: "10rem",
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            paddingX: "30px",
            width: {
              sm: "unset",
              md: "30%",
              lg: "40%",
            },
          }}
        >
          <Stack spacing={4} direction="column">
            {/* title */}
            <Stack spacing={1}>
              <Skeleton
                variant="text"
                animation="wave"
                width="90%"
                height={70}
              />
              <Skeleton
                variant="text"
                animation="wave"
                width="70%"
                height={70}
              />
            </Stack>
            {/* title */}

            {/* rating, genres */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Skeleton
                variant="circular"
                animation="wave"
                width={45}
                height={45}
              />

              <Skeleton
                variant="rectangular"
                animation="wave"
                width={2}
                height={30}
              />

              <Skeleton
                variant="rounded"
                animation="wave"
                width={70}
                height={32}
              />

              <Skeleton
                variant="rounded"
                animation="wave"
                width={70}
                height={32}
              />
            </Stack>
            {/* rating, genres */}

            {/* overview */}
            <Stack spacing={1}>
              <Skeleton variant="text" animation="wave" width="100%" />

              <Skeleton variant="text" animation="wave" width="95%" />

              <Skeleton variant="text" animation="wave" width="75%" />
            </Stack>
            {/* overview */}

            {/* button */}
            <Skeleton
              variant="rounded"
              animation="wave"
              width={150}
              height={45}
            />
            {/* button */}
          </Stack>
        </Box>
      </Box>
      {/* content */}
    </Box>
  );
};

export default HeroItemSkeleton;
