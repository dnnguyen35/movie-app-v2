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
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
  const { mediaSlug } = useParams();
  const [searchParams] = useSearchParams();
  const mediaGenre = searchParams.get("mediaGenre");
  const mediaId = searchParams.get("mediaId");

  const { user, listFavorites } = useSelector((state) => state.user);
  const { languageMode } = useSelector((state) => state.languageMode);

  const [media, setMedia] = useState();
  const [genres, setGenres] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [onRequest, setOnRequest] = useState(false);
  const [getMediaError, setGetMediaError] = useState(false);
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const getMedia = async () => {
      dispatch(setGlobalLoading(true));
      const { response, error } = await mediaApi.getDetail({
        mediaSlug: mediaSlug,
        mediaGenre: mediaGenre,
        mediaId: mediaId,
      });

      if (response) {
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

    return () => {
      setMedia(null);
      setGenres([]);
      setIsFavorite(false);
      setOnRequest(false);
      setGetMediaError(false);
    };
  }, [mediaSlug, mediaGenre, mediaId, dispatch, languageMode]);

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

      toast.success(t("success.add_favorite"));
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
      toast.success(t("success.delete_favorite"));
    }
  };

  if (!mediaSlug || !mediaGenre || !mediaId) {
    return <PageNotFound />;
  }

  if (!media && !getMediaError) return null;

  if (!media && getMediaError) return <PageNotFound />;

  return (
    media && (
      <>
        <ImageHeader
          imgPath={media.detail.item.thumb_url || media.detail.item.poster_url}
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
                        key={genre.id}
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
                      ?.replaceAll("&apos;", "'")}
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
                        if (media.detail.item.episodes.length === 0) return;

                        navigate(
                          routesGen.mediaStream(mediaSlug, mediaGenre, mediaId),
                        );
                      }}
                    >
                      {media.detail.item.episodes.length > 0
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

          {/* media trailers */}
          <div>
            {media.detail.item.trailer_url && (
              <Container header={t("mediadetail.videos")}>
                <MediaVideosSlide videos={[media.detail.item.trailer_url]} />
              </Container>
            )}
          </div>
          {/* media trailers */}

          {/* media backdrop */}
          {media.images.images.length > 0 && (
            <Container header={t("mediadetail.backdrops")}>
              <BackdropSlide
                backdrops={[...media.images.images].filter(
                  (image) => image.type === "backdrop",
                )}
              />
            </Container>
          )}
          {/* media backdrop */}

          {/* media posters */}
          {media.images.images.length > 0 && (
            <Container header={t("mediadetail.posters")}>
              <PosterSlide
                posters={[...media.images.images].filter(
                  (image) => image.type === "poster",
                )}
              />
            </Container>
          )}
          {/* media posters */}

          {/* media reviews */}
          <MediaReview reviews={media.reviews} media={media} />
          {/* media reviews */}

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

export default MediaDetail;
