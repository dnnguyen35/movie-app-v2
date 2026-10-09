import HeroSlide from "../components/common/HeroSlide";
import tmdbConfigs from "../api/configs/tmdb.configs";
import { Box } from "@mui/material";
import uiConfigs from "../configs/ui.configs";
import Container from "../components/common/Container";
import MediaSlide from "../components/common/MediaSlide";
import { useTranslation } from "react-i18next";
import { getRandomPage } from "../utils/calculateRemainingTime.utils";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeroSlide
        mediaType={tmdbConfigs.mediaListType.phimchieurap}
        page={getRandomPage()}
      />
      <Box marginTop="-4rem" sx={{ ...uiConfigs.style.mainContent }}>
        <Container header={t("homepage.popular_movies")}>
          <MediaSlide
            mediaType={tmdbConfigs.mediaListType.phimchieurap}
            page={getRandomPage()}
          />
        </Container>

        <Container header={t("homepage.high_rate_movies")}>
          <MediaSlide
            mediaType={tmdbConfigs.mediaListType.phimbo}
            page={getRandomPage()}
          />
        </Container>

        <Container header={t("homepage.popular_show")}>
          <MediaSlide
            mediaType={tmdbConfigs.mediaListType.tvshows}
            page={getRandomPage()}
          />
        </Container>

        <Container header={t("homepage.recommended_show")}>
          <MediaSlide
            mediaType={tmdbConfigs.mediaListType.phimle}
            page={getRandomPage()}
          />
        </Container>
      </Box>
    </>
  );
};

export default HomePage;
