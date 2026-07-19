import axios from "axios";
import queryString from "query-string";
import store from "../../redux/store";

const baseURL = process.env.REACT_APP_VIDEOSOURCE_API_URL;

console.log("baseURL", baseURL);

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
      "Accept-Language": languageMode,
    },
    params: cleanParams,
  };
});

videoSourceClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data.data ? response.data.data : response.data;
    }

    return response;
  },

  (error) => {
    throw error.response.data;
  },
);

export default videoSourceClient;
