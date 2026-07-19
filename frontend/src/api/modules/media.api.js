import privateClient from "../client/private.client.js";
import publicClient from "../client/public.client.js";

const mediaEndpoints = {
  list: ({ mediaType, mediaCategory, page }) =>
    `/medias/${mediaType}/list/${mediaCategory}?page=${page}`,
  detail: ({ mediaType, mediaId }) => `/medias/${mediaType}/detail/${mediaId}`,
  search: ({ mediaType, query, page }) =>
    `/medias/${mediaType}/search?query=${query}&page=${page}`,
};

const mediaApi = {
  getList: async ({ mediaType, mediaCategory, page }) => {
    try {
      const response = await publicClient.get(
        mediaEndpoints.list({ mediaType, mediaCategory, page }),
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },

  getDetail: async ({ mediaType, mediaId }) => {
    try {
      const response = await privateClient.get(
        mediaEndpoints.detail({ mediaType, mediaId }),
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
  search: async ({ mediaType, query, page }) => {
    try {
      const response = await publicClient.get(
        mediaEndpoints.search({ mediaType, query, page }),
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default mediaApi;
