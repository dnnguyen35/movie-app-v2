const genreMap = {
  28: "hanh-dong",
  12: "phieu-luu",
  16: "hoat-hinh",
  35: "hai-huoc",
  80: "hinh-su",
  99: "tai-lieu",
  18: "chinh-kich",
  10751: "gia-dinh",
  14: "vien-tuong",
  36: "lich-su",
  27: "kinh-di",
  10402: "am-nhac",
  9648: "bi-an",
  10749: "tinh-cam",
  878: "vien-tuong",
  10770: "phim-ca-nhac",
  53: "tam-ly",
  10752: "chien-tranh",
  37: "mien-tay",

  10759: "hanh-dong",
  10762: "tre-em",
  10763: "tin-tuc",
  10764: "truyen-hinh-thuc-te",
  10765: "vien-tuong",
  10766: "phim-truyen",
  10767: "talk-show",
  10768: "chien-tranh",
};

export const convertGenreToSlugString = (tmdbGenres) => {
  if (!tmdbGenres || tmdbGenres.length === 0) return "";

  const slugs = tmdbGenres
    .map((genre) => genreMap[genre.id])
    .filter((slug) => !!slug)
    .slice(0, 4);

  return slugs.join(",");
};
