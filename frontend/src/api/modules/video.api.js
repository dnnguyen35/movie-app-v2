import videoSourceClient from "../client/videoSource.client";

const videoSourceEndpoints = {
  getMediaSearch: "/tim-kiem",
  getMediaVideo: ({ mediaSlug }) => `/phim/${mediaSlug}`,
};

const videoSourceApi = {
  getMediaSearch: async ({ keyword, year, category, country }) => {
    try {
      const response = await videoSourceClient.get(
        videoSourceEndpoints.getMediaSearch,
        {
          params: {
            keyword: keyword,
            year: year,
            category: category,
            country: country,
          },
        },
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },

  getMediaVideo: async ({ mediaSlug }) => {
    try {
      const response = await videoSourceClient.get(
        videoSourceEndpoints.getMediaVideo({ mediaSlug }),
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default videoSourceApi;
