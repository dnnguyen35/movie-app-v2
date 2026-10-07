import HeroSlide from "../components/common/HeroSlide";
import tmdbConfigs from "../api/configs/tmdb.configs";
import { Box } from "@mui/material";
import uiConfigs from "../configs/ui.configs";
import Container from "../components/common/Container";
import MediaSlide from "../components/common/MediaSlide";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeroSlide
        mediaType={tmdbConfigs.mediaListType.phimchieurap}
        page={1}
      />
      <Box marginTop="-4rem" sx={{ ...uiConfigs.style.mainContent }}>
        <Container header={t("homepage.popular_movies")}>
          <MediaSlide
            mediaType={tmdbConfigs.mediaListType.phimle}
            page={1}
          />
        </Container>

        <Container header={t("homepage.high_rate_movies")}>
          <MediaSlide
            mediaType={tmdbConfigs.mediaListType.phimbo}
            page={1}
          />
        </Container>

        <Container header={t("homepage.popular_show")}>
          <MediaSlide
            mediaType={tmdbConfigs.mediaListType.tvshows}
            page={1}
          />
        </Container>

        <Container header={t("homepage.recommended_show")}>
          <MediaSlide
            mediaType={tmdbConfigs.mediaListType.phimhoathinh}
            page={2}
          />
        </Container>
      </Box>
    </>
  );
};

export default HomePage;
