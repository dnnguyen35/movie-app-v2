import privateClient from "../client/private.client.js";
import publicClient from "../client/public.client.js";

const mediaEndpoints = {
  list: ({ page }) =>
    `/medias/list?page=${page}`,

  listByType: ({ type, page }) =>
    `/medias/list/${type}?page=${page}`,

  detail: ({ mediaSlug, mediaGenre, mediaId }) =>
    `/medias/detail/${mediaSlug}?mediaGenre=${mediaGenre}&mediaId=${mediaId}`,

  images: ({ mediaSlug }) =>
    `/medias/images/${mediaSlug}`,

  genres: () =>
    `/medias/genres`,

  listByGenre: ({ genreSlug, page }) =>
    `/medias/genres/${genreSlug}?page=${page}`,

  countries: () =>
    `/medias/countries`,

  listByCountry: ({ countrySlug, page }) =>
    `/medias/country/${countrySlug}?page=${page}`,

  search: ({ query, page }) =>
    `/medias/search?query=${query}&page=${page}`,
};

const mediaApi = {
  getList: async ({ page }) => {
    try {
      const response = await publicClient.get(
        mediaEndpoints.list({ page }),
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },

  getListByType: async ({ type, page }) => {
    try {
      const response = await publicClient.get(
        mediaEndpoints.listByType({ type, page }),
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },

  getDetail: async ({ mediaSlug, mediaGenre, mediaId }) => {
    try {
      const response = await privateClient.get(
        mediaEndpoints.detail({
          mediaSlug,
          mediaGenre,
          mediaId,
        }),
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },

  getImages: async ({ mediaSlug }) => {
    try {
      const response = await publicClient.get(
        mediaEndpoints.images({ mediaSlug }),
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },

  getGenres: async () => {
    try {
      const response = await publicClient.get(
        mediaEndpoints.genres(),
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },

  getListByGenre: async ({ genreSlug, page }) => {
    try {
      const response = await publicClient.get(
        mediaEndpoints.listByGenre({
          genreSlug,
          page,
        }),
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },

  getCountries: async () => {
    try {
      const response = await publicClient.get(
        mediaEndpoints.countries(),
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },

  getListByCountry: async ({ countrySlug, page }) => {
    try {
      const response = await publicClient.get(
        mediaEndpoints.listByCountry({
          countrySlug,
          page,
        }),
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },

  search: async ({ query, page }) => {
    try {
      const response = await publicClient.get(
        mediaEndpoints.search({
          query,
          page,
        }),
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default mediaApi;
