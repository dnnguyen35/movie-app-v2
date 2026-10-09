import { LoadingButton } from "@mui/lab";
import { Box, Stack, Typography, CircularProgress } from "@mui/material";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import uiConfigs from "../configs/ui.configs";
import MediaGrid from "../components/common/MediaGrid";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice";

const MediaList = ({ title, fetchMedias }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [medias, setMedias] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [slugText, setSlugText] = useState("");

  const requestIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const requestId = ++requestIdRef.current;

    setMedias([]);
    setCurrentPage(1);
    setHasMore(true);
    setSlugText("")
    setMediaLoading(true);
    dispatch(setGlobalLoading(true));

    const getMedias = async () => {
      try {
        const { response, error } = await fetchMedias(1);

        if (cancelled || requestId !== requestIdRef.current) return;

        if (error) {
          toast.error(error.message);
          return;
        }

        const data = response?.data;
        const items = data?.items ?? [];
        const pagination = data?.params?.pagination;

        setMedias(items);
        setCurrentPage(1);
        setSlugText(data?.titlePage)
        setHasMore(
          pagination?.totalPages != null
            ? 1 < pagination.totalPages
            : items.length > 0
        );
      } catch {
        if (!cancelled) {
          toast.error("Get media filed in media list");
        }
      } finally {
        if (!cancelled && requestId === requestIdRef.current) {
          setMediaLoading(false);
          dispatch(setGlobalLoading(false));
        }
      }
    };

    getMedias();

    return () => {
      cancelled = true;
    };
  }, [fetchMedias, dispatch]);

  const onLoadMore = async () => {
    if (mediaLoading || !hasMore) return;

    const nextPage = currentPage + 1;
    const requestId = ++requestIdRef.current;

    setMediaLoading(true);

    try {
      const { response, error } = await fetchMedias(nextPage);

      if (requestId !== requestIdRef.current) return;

      if (error) {
        toast.error(error.message);
        return;
      }

      const data = response?.data;
      const items = data?.items ?? [];
      const pagination = data?.params?.pagination;

      setMedias((prev) => [...prev, ...items]);
      setCurrentPage(nextPage);
      setHasMore(
        pagination?.totalPages != null
          ? nextPage < pagination.totalPages
          : items.length > 0
      );
    } catch {
      if (requestId === requestIdRef.current) {
        toast.error("Không thể tải thêm phim.");
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setMediaLoading(false);
      }
    }
  };

  return (
    <>
      {/* <HeroSlide mediaType={tmdbConfigs.mediaListType.phimchieurap} page={getRandomPage()}/> */}

      <Box sx={{ ...uiConfigs.style.mainContent }}>
        <Stack
          spacing={1}
          direction={{ xs: "row", md: "row" }}
          alignItems="center"
          sx={{ marginBottom: 4, marginTop: 10 }}
        >
          <LocalOfferOutlinedIcon color="primary" />
          <Typography
            variant="h5"
            fontWeight={700}
            textTransform="uppercase"
            sx={{
              ...uiConfigs.style.typoLines(1, "left"),
              fontSize: { xs: "1rem", md: "1.3rem" },
            }}
          >
            {title !== "" ? `${title}: ${slugText}` : slugText.slice(9)}
          </Typography>
        </Stack>

        <MediaGrid medias={medias} />

        {hasMore && (
          <LoadingButton
            sx={{ marginTop: 8 }}
            fullWidth
            loading={mediaLoading}
            disabled={mediaLoading}
            onClick={onLoadMore}
            loadingIndicator={
              <CircularProgress
                size={20}
                sx={{ color: "primary.main" }}
              />
            }
          >
            {t("common.see_more")}
          </LoadingButton>
        )}
      </Box>
    </>
  );
};

export default MediaList;
