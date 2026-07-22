import axios from "axios";
import queryString from "query-string";
import store from "../../redux/store";

const baseURL = process.env.REACT_APP_API_URL;

const publicClient = axios.create({
  baseURL,
  withCredentials: true,
  paramsSerializer: {
    encode: (params) => queryString.stringify(params),
  },
});

publicClient.interceptors.request.use((config) => {
  const languageMode = store.getState().languageMode.languageMode || "vi";

  return {
    ...config,
    headers: {
      ...config.headers,
      "Accept-Language": languageMode,
    },
  };
});

publicClient.interceptors.response.use(
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

export default publicClient;
