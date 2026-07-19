const countryMap = {
  US: "au-my",

  CA: "canada",
  GB: "anh",
  FR: "phap",
  DE: "duc",
  ES: "tay-ban-nha",
  IT: "y",
  NL: "ha-lan",
  PL: "ba-lan",
  PT: "bo-dao-nha",
  RU: "nga",
  UA: "ukraina",
  CH: "thuy-si",
  SE: "thuy-dien",
  DK: "dan-mach",
  NO: "na-uy",

  VN: "viet-nam",
  CN: "trung-quoc",
  HK: "hong-kong",
  TW: "dai-loan",
  JP: "nhat-ban",
  KR: "han-quoc",
  IN: "an-do",
  TH: "thai-lan",
  MY: "malaysia",
  ID: "indonesia",
  PH: "philippines",

  AU: "uc",
  BR: "brazil",
  MX: "mexico",
  TR: "tho-nhi-ky",
  ZA: "nam-phi",
  AE: "uae",
  SA: "a-rap-xe-ut",
};

export const convertCountryToSlugString = (tmdbCountries) => {
  if (!tmdbCountries || tmdbCountries.length === 0) return "";

  const slugs = tmdbCountries
    .map((country) => countryMap[country.iso_3166_1])
    .filter((slug) => !!slug);

  return slugs.join(",");
};
