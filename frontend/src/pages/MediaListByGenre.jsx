import { useCallback } from "react";
import { useParams } from "react-router-dom";

import MediaList from "./MediaList";
import mediaApi from "../api/modules/media.api";
import { useTranslation } from "react-i18next";

const MediaListByGenre = () => {
  const { genreSlug } = useParams();
  const {t} = useTranslation();

  const fetchMedias = useCallback(
    (page) => mediaApi.getListByGenre({ genreSlug, page }),
    [genreSlug]
  );

  return (
    <MediaList
      key={genreSlug}
      title={t("topbar.genres")}
      fetchMedias={fetchMedias}
    />
  );
};

export default MediaListByGenre;
