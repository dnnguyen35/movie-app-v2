import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TimelapseIcon from "@mui/icons-material/Timelapse";

import { LoadingButton } from "@mui/lab";
import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import CircularRate from "../components/common/CircularRate";
import Container from "../components/common/Container";
import ImageHeader from "../components/common/ImageHeader";

import uiConfigs from "../configs/ui.configs";
import tmdbConfigs from "../api/configs/tmdb.configs";
import mediaApi from "../api/modules/media.api";
import favoriteApi from "../api/modules/favorite.api";

import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import { setAuthModalOpen } from "../redux/features/authModalSlice";
import { addFavorite, removeFavorite } from "../redux/features/userSlice";

import CastSlide from "../components/common/CastSlide";
import MediaVideosSlide from "../components/common/MediaVideosSlide";
import BackdropSlide from "../components/common/BackdropSlide";
import PosterSlide from "../components/common/PosterSlide";
import RecommendSlide from "../components/common/RecommendSlide";
import MediaSlide from "../components/common/MediaSlide";
import MediaReview from "../components/common/MediaReview";
import PageNotFound from "./PageNotFound";
import { useTranslation } from "react-i18next";
import MediaVideo from "../components/common/MediaVideo";
import EpisodeSelector from "../components/common/EpisodeSelector";
import MediaPlayer from "../components/common/MediaPlayer";
import { convertGenreToSlugString } from "../utils/convertGenreToSlugString.utils";
import { convertCountryToSlugString } from "../utils/convertCountryIsoToSlugString.utils";
import { convertMinuteToHour } from "../utils/convertMinuteToHour.utils";
import { languageModes } from "../configs/language.config";
import favoriteUtils from "../utils/favorite.utils";

const MediaStream = () => {
  const { mediaSlug } = useParams();
  const [searchParams] = useSearchParams();
  const mediaGenre = searchParams.get("mediaGenre");
  const mediaId = searchParams.get("mediaId");

  const { user, listFavorites } = useSelector((state) => state.user);
  const { languageMode } = useSelector((state) => state.languageMode);

  const [media, setMedia] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
  const [onRequest, setOnRequest] = useState(false);
  const [genres, setGenres] = useState([]);
  const { t } = useTranslation();

  const [mediaEpisodes, setMediaEpisodes] = useState([]);
  const [currentServer, setCurrentServer] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);

  const [getMediaError, setGetMediaError] = useState(false);

  const dispatch = useDispatch();

  const videoRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const getMedia = async () => {
      dispatch(setGlobalLoading(true));
      const { response, error } = await mediaApi.getDetail({
        mediaSlug,
        mediaGenre,
        mediaId,
      });

      if (response) {
        setMediaEpisodes(response.detail.item.episodes);
        setCurrentServer(response.detail.item.episodes[0]);
        setCurrentEpisode(response.detail.item.episodes[0].server_data[0]);
        setMedia(response);
        setIsFavorite(response.isFavorite);
        setGenres(response.detail.item.category.splice(0, 2));
        setGetMediaError(false);
      }

      if (error) {
        toast.error(t(error.message));
        setGetMediaError(true);
      }

      dispatch(setGlobalLoading(false));
    };

    getMedia();
  }, [mediaSlug, mediaGenre, mediaId, dispatch, languageMode]);

  useEffect(() => {
    if (!user) {
      setIsFavorite(false);
      return;
    } else if (user && media) {
      const isFavorite = favoriteUtils.check({
        listFavorites,
        mediaId: media?.detail?.item._id,
      });

      setIsFavorite(isFavorite);
    }
  }, [user, listFavorites]);

  const onFavoriteClick = async () => {
    if (!user) return dispatch(setAuthModalOpen(true));

    if (onRequest) return;

    if (isFavorite) {
      onRemoveFavorite();
      return;
    }

    setOnRequest(true);

    const body = {
      mediaId: media.detail.item._id,
      mediaTitle: media.detail.item.name,
      mediaType: "movie",
      mediaPoster: media.detail.item.poster_url,
      mediaRate: media.detail.item.tmdb.vote_average || 0,
    };

    const { response, error } = await favoriteApi.add(body);

    setOnRequest(false);

    if (error) toast.error(error.message);
    if (response) {
      dispatch(addFavorite(response));
      setIsFavorite(true);

      // toast.success(t("success.add_favorite"));
    }
  };

  const onRemoveFavorite = async () => {
    if (onRequest) return;
    setOnRequest(true);

    const favorite = listFavorites.find(
      (favorite) =>
        favorite.mediaId.toString() === media.detail.item._id.toString(),
    );

    const { response, error } = await favoriteApi.remove({
      favoriteId: favorite.id,
    });

    setOnRequest(false);

    if (error) toast.error(error.message);
    if (response) {
      dispatch(removeFavorite(favorite));
      setIsFavorite(false);
      // toast.success(t("success.delete_favorite"));
    }
  };

  if (!mediaSlug || !mediaGenre || !mediaId) return <PageNotFound />;

  if (!media && !getMediaError) return null;

  if (!media && getMediaError) return <PageNotFound />;

  return (
    media && (
      <>
        <Box
          sx={{
            color: "primary.contrastText",
            ...uiConfigs.style.mainContent,
          }}
        >
          {/* media video */}
          {mediaEpisodes.length > 0 && currentEpisode && (
            <div ref={videoRef} style={{ paddingTop: "3rem" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LiveTvIcon sx={{ fontWeight: "500", color: "primary.main" }} />
                <Typography
                  variant="h6"
                  fontWeight="500"
                  sx={{
                    my: "1rem",
                    color: "text.primary",
                    ...uiConfigs.style.typoLines(1, "left"),
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                  }}
                >
                  {`${
                    media.detail.item.name || media.detail.item.origin_name
                  }${currentEpisode?.name ? ` - ${currentEpisode.name}` : ""}`}
                </Typography>
              </Box>

              {/* <Container header={t("mediadetail.videos")}> */}
              <MediaPlayer
                videoUrl={currentEpisode?.link_m3u8}
                mediaThumbUrl={
                  media.detail.item.thumb_url || media.detail.item.poster_url
                }
              />

              {currentServer && (
                <EpisodeSelector
                  episodes={mediaEpisodes}
                  currentServer={currentServer}
                  setCurrentServer={setCurrentServer}
                  currentEpisode={currentEpisode}
                  setCurrentEpisode={setCurrentEpisode}
                  videoFrameRef={videoRef}
                />
              )}
              {/* </Container> */}
            </div>
          )}
          {/* media video */}

          {/* media content */}
          <Box
            sx={{
              marginTop: { xs: "1rem", md: "2rem", lg: "3rem" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { md: "row", xs: "column" },
              }}
            >
              {/* poster */}
              <Box
                sx={{
                  width: { xs: "50%", sm: "30%", md: "40%" },
                  margin: { xs: "2rem auto 2rem", md: "0 2rem 0 0" },
                }}
              >
                <Box
                  sx={{
                    borderRadius: "2%",
                    paddingTop: "140%",
                    ...uiConfigs.style.backgroundImage(
                      media.detail.item.poster_url ||
                        media.detail.item.thumb_url,
                    ),
                  }}
                />
              </Box>
              {/* poster */}

              {/* media info */}
              <Box
                sx={{
                  width: { xs: "100%", md: "60%" },
                  color: "text.primary",
                }}
              >
                <Stack spacing={5}>
                  <Stack
                    direction={"column"}
                    spacing={1}
                    alignItems={"flex-start"}
                  >
                    {/* title */}
                    <Typography
                      variant="h4"
                      fontSize={{ xs: "2rem", md: "2rem", lg: "3rem" }}
                      fontWeight="700"
                      sx={{ ...uiConfigs.style.typoLines(1, "left") }}
                    >
                      {media.detail.item.name}
                    </Typography>

                    <Typography
                      variant="h4"
                      fontSize={{ xs: "1rem", md: "1rem", lg: "2rem" }}
                      fontWeight="200"
                      sx={{ ...uiConfigs.style.typoLines(1, "left") }}
                    >
                      {media.detail.item.origin_name}
                    </Typography>
                    {/* title */}
                  </Stack>

                  {/* rate and genres */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    {/* rate */}
                    <CircularRate
                      value={media.detail.item.tmdb.vote_average || 0}
                    />
                    {/* rate */}
                    <Divider orientation="vertical" />
                    {/* genres */}
                    {genres.map((genre, index) => (
                      <Chip
                        label={genre.name}
                        variant="filled"
                        color="primary"
                        key={genre._id}
                      />
                    ))}
                    {/* genres */}
                  </Stack>
                  {/* rate and genres */}

                  {/* release date and duration time*/}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarMonthIcon color="primary" />
                      <Chip
                        label={media.detail.item.year}
                        variant="filled"
                        color="primary"
                      />
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <TimelapseIcon color="primary" />
                      <Chip
                        label={media.detail.item.time}
                        variant="filled"
                        color="primary"
                      />
                    </Stack>
                  </Stack>
                  {/* release date and duration time*/}

                  {/* overview */}
                  <Typography
                    variant="body1"
                    sx={{ ...uiConfigs.style.typoLines(5) }}
                  >
                    {media.detail.item.content
                      ?.replace(/<\/?[^>]+(>|$)/g, "")
                      ?.replaceAll("&quot;", '"')
                      ?.replaceAll("&amp;", "&")
                      ?.replaceAll("&#039;", "'")
                      ?.replaceAll("&apos;", "'") || media.detail.overview}
                  </Typography>
                  {/* overview */}

                  {/* buttons */}
                  <Stack direction="row" spacing={1}>
                    <LoadingButton
                      variant="text"
                      sx={{
                        width: "max-content",
                        "& .MuiButon-starIcon": { marginRight: "0" },
                      }}
                      size="large"
                      startIcon={
                        isFavorite ? (
                          <FavoriteIcon />
                        ) : (
                          <FavoriteBorderOutlinedIcon />
                        )
                      }
                      loadingPosition="start"
                      loading={onRequest}
                      onClick={onFavoriteClick}
                    />
                    <Button
                      variant="contained"
                      sx={{ width: "max-content" }}
                      size="large"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.scrollIntoView({
                            behavior: "smooth",
                          });
                        }
                      }}
                    >
                      {media.detail.item.episodes.length > 0 &&
                      media.detail.item.episodes[0].server_data[0].link_m3u8 !==
                        ""
                        ? t("common.watch_now")
                        : t("common.available_soon")}
                    </Button>
                  </Stack>
                  {/* buttons */}

                  {/* cast */}
                  <Container header={t("mediadetail.cast")}>
                    <CastSlide casts={media.detail.item.actor} />
                  </Container>
                  {/* cast */}
                </Stack>
              </Box>
              {/* media info */}
            </Box>
          </Box>
          {/* media content */}

          {/* media recommendation */}
          <Container header={t("mediadetail.you_may_like")}>
            {media.recommend.items.length > 0 && (
              <RecommendSlide
                medias={media.recommend.items}
                mediaType={"movie"}
              />
            )}
            {/* {media.recommend.results.length === 0 && (
              <MediaSlide
                mediaType={mediaType}
                mediaCategory={tmdbConfigs.mediaCategory.top_rated}
              />
            )} */}
          </Container>
          {/* media recommendation */}
        </Box>
      </>
    )
  );
};

export default MediaStream;
