import { useEffect, useState } from "react";
import { SwiperSlide } from "swiper/react";
import mediaApi from "../../api/modules/media.api";
import AutoSwiper from "./AutoSwiper";
import { toast } from "react-toastify";
import MediaItem from "./MediaItem";
import { useSelector } from "react-redux";
import MediaItemSkeleton from "./Skeletons/MediaItemSkeleton";

const MediaSlide = ({ mediaType, page }) => {
  const [medias, setMedias] = useState([]);
  const { languageMode } = useSelector((state) => state.languageMode);

  useEffect(() => {
    const getMedias = async () => {
      const { response, error } = await mediaApi.getListByType({
        type: mediaType,
        page: page,
      });

      if (response) setMedias(response?.data?.items);
      if (error) toast.error(error.message);
    };

    getMedias();
  }, [mediaType, page, languageMode]);

  return (
    <AutoSwiper>
      {medias && medias.length > 0
        ? medias.map((media, index) => (
            <SwiperSlide key={media._id}>
              <MediaItem media={media} mediaType={mediaType} />
            </SwiperSlide>
          ))
        : Array.from({ length: 10 }).map((_, index) => (
            <SwiperSlide key={index}>
              <MediaItemSkeleton mediaType={mediaType} />
            </SwiperSlide>
          ))}
    </AutoSwiper>
  );
};

export default MediaSlide;
