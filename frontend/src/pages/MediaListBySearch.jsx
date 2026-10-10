import { useCallback } from "react";
import { useParams } from "react-router-dom";

import mediaApi from "../api/modules/media.api";
import MediaList from "./MediaList";
import PageNotFound from "./PageNotFound";

const MediaListBySearch = () => {
  const { keyword } = useParams();
  const sanitizedKeyword = keyword.trim() ?? "";

  const fetchMedias = useCallback(
    (page) => mediaApi.search({ keyword: sanitizedKeyword, page }),
    [sanitizedKeyword],
  );

  if (!sanitizedKeyword) return <PageNotFound />;

  return (
    <MediaList key={sanitizedKeyword} title={""} fetchMedias={fetchMedias} />
  );
};

export default MediaListBySearch;
