import { Box } from "@mui/material";
import { Swiper } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

const AutoSwiper = ({ children }) => {
  return (
    <Box
      sx={{
        "& .swiper-slide": {
          width: { xs: "50%", sm: "35%", md: "25%", lg: "20.5%" },
          paddingBottom: "3rem",
        },
        // "& .swiper-pagination-bullet": {
        //   backgroundColor: "primary.main",
        // },
        "& .swiper-button-prev, & .swiper-button-next": {
          opacity: 1,
          color: "primary.main",
          pointerEvents: "auto",
          visibility: "visible",
        },
      }}
    >
      <Swiper
        modules={[Navigation]}
        navigation={true}
        slidesPerView="auto"
        spaceBetween={8}
        grabCursor={true}
        loop={true}
        style={{ width: "100%", height: "max-content" }}
      >
        {children}
      </Swiper>
    </Box>
  );
};
export default AutoSwiper;
