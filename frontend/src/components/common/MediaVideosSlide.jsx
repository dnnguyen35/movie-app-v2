import { SwiperSlide } from "swiper/react";
import NavigationSwiper from "./NavigationSwiper";
import MediaVideo from "./MediaVideo";

const MediaVideosSlide = ({ videos }) => {
  return (
    <NavigationSwiper>
      {videos.map((video, index) => (
        <SwiperSlide key={index}>
          <MediaVideo video={video} />
        </SwiperSlide>
      ))}
    </NavigationSwiper>
  );
};

export default MediaVideosSlide;
