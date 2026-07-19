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

      console.log("videoSourceApi.getMediaSearch response:", response);

      return { response };
    } catch (error) {
      console.log("videoSourceApi.getMediaSearch error:", error);
      return { error };
    }
  },

  getMediaVideo: async ({ mediaSlug }) => {
    try {
      const response = await videoSourceClient.get(
        videoSourceEndpoints.getMediaVideo({ mediaSlug }),
      );

      console.log("videoSourceApi.getMediaVideo response:", response);

      return { response };
    } catch (error) {
      console.log("videoSourceApi.getMediaVideo error:", error);
      return { error };
    }
  },
};

export default videoSourceApi;
