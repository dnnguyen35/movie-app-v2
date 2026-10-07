const mediaType = {
  movie: "movie",
  tv: "tv",
};

const mediaListType = {
  phimchieurap: "phim-chieu-rap",
  phimle: "phim-le",
  phimbo: "phim-bo",
  phimhoathinh: "hoat-hinh",
  tvshows: "tv-shows",
}

const mediaCategory = {
  popular: "popular",
  top_rated: "top_rated",
};

const backdropPath = (imgEndpoint) =>
  `https://image.tmdb.org/t/p/original${imgEndpoint}`;

const posterPath = (imgEndpoint) =>
  `https://image.tmdb.org/t/p/w500${imgEndpoint}`;

const youtubePath = (videoId) =>
  `https://www.youtube.com/embed/${videoId}?controls=0`;

const kkmovieImagePath = (imgEndpoint) =>
  `https://phimimg.com/${imgEndpoint}`;

const tmdbConfigs = {
  mediaType,
  mediaCategory,
  mediaListType,
  backdropPath,
  posterPath,
  youtubePath,
  kkmovieImagePath,
};

export default tmdbConfigs;
