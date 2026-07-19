import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TimelapseIcon from "@mui/icons-material/Timelapse";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Chip,
  colors,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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
import videoSourceApi from "../api/modules/video.api";
import { routesGen } from "../routes/routes";
import { convertGenreToSlugString } from "../utils/convertGenreToSlugString.utils";
import { convertCountryToSlugString } from "../utils/convertCountryIsoToSlugString.utils";
import { convertMinuteToHour } from "../utils/convertMinuteToHour.utils";
import { languageModes } from "../configs/language.config";

const MediaDetail = () => {
  const { mediaType, mediaId } = useParams();

  const { user, listFavorites } = useSelector((state) => state.user);
  const { languageMode } = useSelector((state) => state.languageMode);

  const [media, setMedia] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
  const [onRequest, setOnRequest] = useState(false);
  const [genres, setGenres] = useState([]);
  const { t } = useTranslation();

  const [mediaSourceStatus, setMediaSourceStatus] = useState(false);
  const [mediaSource, setMediaSource] = useState(null);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const getMedia = async () => {
      dispatch(setGlobalLoading(true));
      const { response, error } = await mediaApi.getDetail({
        mediaType,
        mediaId,
      });

      if (response) {
        const { response: mediaSearchResponse, error: mediaSearchError } =
          await videoSourceApi.getMediaSearch({
            keyword: response.detail?.original_title
              ? response.detail?.original_title
              : response.detail?.original_name,
            year:
              response.detail?.release_date?.split("-")[0] ||
              [
                response.detail?.last_air_date?.split("-")[0],
                response.detail?.first_air_date?.split("-")[0],
              ]
                .filter(Boolean)
                .join(","),
            category: convertGenreToSlugString(response.detail?.genres),
            country: convertCountryToSlugString(
              response.detail?.production_countries,
            ),
          });

        if (mediaSearchResponse && mediaSearchResponse?.items?.length > 0) {
          const { response: mediaVideoResponse, error: mediaVideoError } =
            await videoSourceApi.getMediaVideo({
              mediaSlug: mediaSearchResponse.items[0].slug,
            });

          if (
            mediaVideoResponse &&
            mediaVideoResponse.item.episodes.length > 0 &&
            mediaVideoResponse.item.episodes[0].server_data[0].link_m3u8
          ) {
            if (
              mediaType === tmdbConfigs.mediaType.tv &&
              mediaVideoResponse.item.type === "series"
            ) {
              setMediaSourceStatus(true);
              setMediaSource(mediaVideoResponse);
            } else if (
              mediaType === tmdbConfigs.mediaType.movie &&
              mediaVideoResponse.item.type !== "series"
            ) {
              setMediaSourceStatus(true);
              setMediaSource(mediaVideoResponse);
            }
          }
        }
      }

      dispatch(setGlobalLoading(false));

      if (response) {
        setMedia(response);
        setIsFavorite(response.isFavorite);
        setGenres(response.detail.genres.splice(0, 2));
      }

      if (error) toast.error(error.message);
    };

    if (tmdbConfigs.mediaType.hasOwnProperty(mediaType) && !isNaN(mediaId))
      getMedia();

    return () => {
      setMediaSourceStatus(false);
      setMediaSource(null);
    };
  }, [mediaType, mediaId, dispatch, languageMode]);

  useEffect(() => {
    if (!user) {
      setIsFavorite(false);
      return;
    } else if (user && media) {
      setIsFavorite(media.isFavorite);
    }
  }, [user]);

  const onFavoriteClick = async () => {
    if (!user) return dispatch(setAuthModalOpen(true));

    if (onRequest) return;

    if (isFavorite) {
      onRemoveFavorite();
      return;
    }

    setOnRequest(true);

    const body = {
      mediaId: media.detail.id,
      mediaTitle: media.detail.title || media.detail.name,
      mediaType: mediaType,
      mediaPoster: media.detail.poster_path,
      mediaRate: media.detail.vote_average,
    };

    const { response, error } = await favoriteApi.add(body);

    setOnRequest(false);

    if (error) toast.error(error.message);
    if (response) {
      dispatch(addFavorite(response));
      setIsFavorite(true);

      toast.success(t("success.add_favorite"));
    }
  };

  const onRemoveFavorite = async () => {
    if (onRequest) return;
    setOnRequest(true);

    const favorite = listFavorites.find(
      (favorite) => favorite.mediaId.toString() === media.detail.id.toString(),
    );

    const { response, error } = await favoriteApi.remove({
      favoriteId: favorite.id,
    });

    setOnRequest(false);

    if (error) toast.error(error.message);
    if (response) {
      dispatch(removeFavorite(favorite));
      setIsFavorite(false);
      toast.success(t("success.delete_favorite"));
    }
  };

  if (!tmdbConfigs.mediaType.hasOwnProperty(mediaType) || isNaN(mediaId)) {
    return <PageNotFound />;
  }

  return media ? (
    <>
      <ImageHeader
        imgPath={tmdbConfigs.backdropPath(
          media.detail.backdrop_path || media.detail.poster_path,
        )}
      />
      <Box
        sx={{
          color: "primary.contrastText",
          ...uiConfigs.style.mainContent,
        }}
      >
        {/* media content */}
        <Box
          sx={{
            marginTop: { xs: "-10rem", md: "-15rem", lg: "-20rem" },
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
                width: { xs: "70%", sm: "50%", md: "40%" },
                margin: { xs: "0 auto 2rem", md: "0 2rem 0 0" },
              }}
            >
              <Box
                sx={{
                  borderRadius: "2%",
                  paddingTop: "140%",
                  ...uiConfigs.style.backgroundImage(
                    tmdbConfigs.posterPath(
                      media.detail.poster_path || media.detail.backdrop_path,
                    ),
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
                    {languageMode === languageModes.vi
                      ? `${mediaSource?.item.name || media.detail.title || media.detail.name}`
                      : `${media.detail.title || media.detail.name}`}
                  </Typography>

                  <Typography
                    variant="h4"
                    fontSize={{ xs: "1rem", md: "1rem", lg: "2rem" }}
                    fontWeight="200"
                    sx={{ ...uiConfigs.style.typoLines(1, "left") }}
                  >
                    {`${mediaSource?.item.origin_name || media.detail.original_title || media.detail.original_name}`}
                  </Typography>
                  {/* title */}
                </Stack>

                {/* rate and genres */}
                <Stack direction="row" spacing={1} alignItems="center">
                  {/* rate */}
                  <CircularRate value={media.detail.vote_average} />
                  {/* rate */}
                  <Divider orientation="vertical" />
                  {/* genres */}
                  {genres.map((genre, index) => (
                    <Chip
                      label={genre.name}
                      variant="filled"
                      color="primary"
                      key={index}
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
                      label={
                        mediaType === tmdbConfigs.mediaType.movie
                          ? media?.detail?.release_date?.split("-")[0]
                          : media?.detail?.first_air_date?.split("-")[0]
                      }
                      variant="filled"
                      color="primary"
                    />
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <TimelapseIcon color="primary" />
                    <Chip
                      label={convertMinuteToHour(
                        mediaSource?.item?.time?.split(" ")[0] ||
                          media?.detail?.runtime ||
                          media?.detail?.episode_run_time[0],
                      )}
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
                  {languageMode === languageModes.vi
                    ? `${
                        mediaSource?.item?.content
                          ?.replace(/<\/?[^>]+(>|$)/g, "")
                          ?.replaceAll("&quot;", '"')
                          ?.replaceAll("&amp;", "&")
                          ?.replaceAll("&#039;", "'")
                          ?.replaceAll("&apos;", "'") || media.detail.overview
                      }`
                    : media.detail.overview}
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
                      if (!mediaSourceStatus) return;

                      navigate(routesGen.mediaStream(mediaType, mediaId));
                    }}
                  >
                    {mediaSourceStatus
                      ? t("common.watch_now")
                      : t("common.available_soon")}
                  </Button>
                </Stack>
                {/* buttons */}

                {/* cast */}
                <Container header={t("mediadetail.cast")}>
                  <CastSlide casts={media.credits.cast} />
                </Container>
                {/* cast */}
              </Stack>
            </Box>
            {/* media info */}
          </Box>
        </Box>
        {/* media content */}

        {/* media trailers */}
        <div>
          <Container header={t("mediadetail.videos")}>
            <MediaVideosSlide videos={[...media.videos.results].splice(0, 5)} />
          </Container>
        </div>
        {/* media trailers */}

        {/* media backdrop */}
        {media.images.backdrops.length > 0 && (
          <Container header={t("mediadetail.backdrops")}>
            <BackdropSlide backdrops={media.images.backdrops} />
          </Container>
        )}
        {/* media backdrop */}

        {/* media posters */}
        {media.images.posters.length > 0 && (
          <Container header={t("mediadetail.posters")}>
            <PosterSlide posters={media.images.posters} />
          </Container>
        )}
        {/* media posters */}

        {/* media reviews */}
        <MediaReview
          reviews={media.reviews}
          media={media}
          mediaType={mediaType}
        />
        {/* media reviews */}

        {/* media recommendation */}
        <Container header={t("mediadetail.you_may_like")}>
          {media.recommend.results.length > 0 && (
            <RecommendSlide
              medias={media.recommend.results}
              mediaType={mediaType}
            />
          )}
          {media.recommend.results.length === 0 && (
            <MediaSlide
              mediaType={mediaType}
              mediaCategory={tmdbConfigs.mediaCategory.top_rated}
            />
          )}
        </Container>
        {/* media recommendation */}
      </Box>
    </>
  ) : (
    <PageNotFound />
  );
};

export default MediaDetail;
