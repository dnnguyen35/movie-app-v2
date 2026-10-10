import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { setGlobalLoading } from "../../redux/features/globalLoadingSlice";
import { routesGen } from "../../routes/routes";

import uiConfigs from "../../configs/ui.configs";

import CircularRate from "./CircularRate";
import tmdbConfigs from "../../api/configs/tmdb.configs";
import mediaApi from "../../api/modules/media.api";
import HeroItemSkeleton from "./Skeletons/HeroItemSkeleton";

const HeroSlide = ({ mediaType, page }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { languageMode } = useSelector((state) => state.languageMode);

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const getMedias = async () => {
      dispatch(setGlobalLoading(true));

      const { response, error } = await mediaApi.getListByType({
        type: mediaType,
        page: page,
      });

      if (response) {
        setMovies(response?.data?.items || []);
      }

      if (error) {
        toast.error(error.message);
      }

      dispatch(setGlobalLoading(false));
    };

    getMedias();
  }, [mediaType, page, dispatch, languageMode]);

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
      <Swiper
        key={movies.length}
        grabCursor={true}
        loop={true}
        modules={[Autoplay]}
        style={{ width: "100%", height: "max-content" }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
      >
        {movies && movies.length > 0 ? (
          movies.map((movie, index) => (
            <SwiperSlide key={movie._id}>
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
                  backgroundImage: `url(${tmdbConfigs.kkmovieImagePath(
                    movie.thumb_url || movie.poster_url,
                  )})`,
                }}
              />
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  ...uiConfigs.style.horizontalGradientBgImage[
                    theme.palette.mode
                  ],
                }}
              />
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  paddingX: { sm: "10px", md: "5rem", lg: "10rem" },
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    paddingX: "30px",
                    color: "text.primary",
                    width: { sm: "unset", md: "30%", lg: "40%" },
                  }}
                >
                  <Stack spacing={4} direction="column">
                    {/* title */}
                    <Typography
                      variant="h4"
                      fontSize={{ xs: "1.5rem", md: "2rem", lg: "4rem" }}
                      fontWeight="700"
                      sx={{
                        ...uiConfigs.style.typoLines(2, "left"),
                      }}
                    >
                      {movie.name}
                    </Typography>
                    {/* title */}

                    <Stack direction="row" spacing={1} alignItems="center">
                      {/* rating */}
                      <CircularRate value={movie.tmdb?.vote_average || 0} />
                      {/* rating */}

                      <Divider orientation="vertical" />
                      {/* genres */}
                      {movie.category?.slice(0, 2).map((category) => (
                        <Chip
                          variant="filled"
                          color="primary"
                          key={category.id}
                          label={category.name}
                        />
                      ))}
                      {/* genres */}
                    </Stack>

                    {/* overview */}
                    <Typography
                      variant="body1"
                      sx={{
                        ...uiConfigs.style.typoLines(3),
                      }}
                    >
                      {movie.origin_name}
                    </Typography>
                    {/* overview */}

                    {/* buttons */}
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<PlayArrowIcon />}
                      component={Link}
                      to={routesGen.mediaDetail(
                        movie.slug,
                        movie.category[0]?.slug,
                        movie._id,
                      )}
                      sx={{ width: "max-content", borderRadius: "50px" }}
                    >
                      {t("common.watch_now")}
                    </Button>
                    {/* buttons */}
                  </Stack>
                </Box>
              </Box>
            </SwiperSlide>
          ))
        ) : (
          <HeroItemSkeleton />
        )}
      </Swiper>
    </Box>
  );
};

export default HeroSlide;
