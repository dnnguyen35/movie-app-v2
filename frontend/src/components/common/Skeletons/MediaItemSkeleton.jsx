import { Box, Skeleton, Stack } from "@mui/material";

const MediaItemSkeleton = ({ mediaType }) => {
  return (
    <Box
      sx={{
        position: "relative",
        paddingTop: "160%",
        borderRadius: "2%",
        overflow: "hidden",
      }}
    >
      {/* skeleton poster */}
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
      {/* skeleton poster */}

      {/* movie or tv show item */}
      {mediaType !== "people" && (
        <>
          {/* play button skeleton */}
          <Skeleton
            variant="circular"
            animation="wave"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 48,
              height: 48,
            }}
          />
          {/* play button skeleton */}

          {/* media info skeleton */}
          <Stack
            spacing={{ xs: 1, md: 2 }}
            sx={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              padding: { xs: "10px", md: "2rem 1rem" },
            }}
          >
            {/* rate skeleton */}
            <Skeleton
              variant="circular"
              animation="wave"
              width={40}
              height={40}
            />
            {/* rate skeleton */}

            {/* release date skeleton */}
            <Skeleton variant="text" animation="wave" width="35%" height={24} />
            {/* release date skeleton */}

            {/* title skeleton */}
            <Skeleton variant="text" animation="wave" width="80%" height={28} />
            {/* title skeleton */}
          </Stack>
          {/* media info skeleton */}
        </>
      )}

      {/* actor */}
      {mediaType === "people" && (
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            bottom: 0,
            padding: "10px",
          }}
        >
          <Skeleton variant="text" animation="wave" width="70%" height={28} />
        </Box>
      )}
      {/* actor */}
    </Box>
  );
};

export default MediaItemSkeleton;
