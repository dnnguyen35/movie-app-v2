import axios from "axios";
import store from "../../redux/store";

const baseURL = process.env.REACT_APP_VIDEOSOURCE_API_URL;

const videoSourceClient = axios.create({
  baseURL,
});

videoSourceClient.interceptors.request.use((config) => {
  const languageMode = store.getState().languageMode.languageMode || "vi";

  const cleanParams = config.params
    ? Object.fromEntries(
        Object.entries(config.params).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined,
        ),
      )
    : {};

  return {
    ...config,
    headers: {
      ...config.headers,
      "Accept-Language": languageMode,
    },
    params: cleanParams,
  };
});

videoSourceClient.interceptors.response.use(
  (response) => {
    if (response?.data) {
      return response.data.data ? response.data.data : response.data;
    }

    return response;
  },

  (error) => {
    return Promise.reject(error.response?.data ?? error);
  },
);

export default videoSourceClient;
