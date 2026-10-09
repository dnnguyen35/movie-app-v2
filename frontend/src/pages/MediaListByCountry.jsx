import { useCallback } from "react";
import { useParams } from "react-router-dom";

import MediaList from "./MediaList";
import mediaApi from "../api/modules/media.api";
import { useTranslation } from "react-i18next";

const MediaListByCountry = () => {
  const { countrySlug } = useParams();
  const {t} = useTranslation();

  const fetchMedias = useCallback(
    (page) => mediaApi.getListByCountry({ countrySlug, page }),
    [countrySlug]
  );

  return (
    <MediaList
      key={countrySlug}
      title={t("topbar.countries")}
      fetchMedias={fetchMedias}
    />
  );
};

export default MediaListByCountry;
