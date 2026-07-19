import axios from "axios";
import queryString from "query-string";
import store from "../../redux/store";

const baseURL = process.env.REACT_APP_API_URL;

const publicClient = axios.create({
  baseURL,
  paramsSerializer: {
    encode: (params) => queryString.stringify(params),
  },
});

publicClient.interceptors.request.use((config) => {
  const languageMode = store.getState().languageMode.languageMode || "vi";

  return {
    ...config,
    headers: {
      "Accept-Language": languageMode,
    },
  };
});

publicClient.interceptors.response.use(
  (response) => {
    if (response && response.data)
      return response.data.data ? response.data.data : response.data;
    return response;
  },
  (error) => {
    throw error.response.data;
  },
);

export default publicClient;
