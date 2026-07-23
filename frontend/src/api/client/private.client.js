import axios from "axios";
import queryString from "query-string";
import store from "../../redux/store";

const baseURL = process.env.REACT_APP_API_URL;

let isRefreshingToken = false;
let waitForRefreshTokenQueue = [];

const processQueue = (error, newAccessToken = null) => {
  waitForRefreshTokenQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(newAccessToken);
    }
  });

  waitForRefreshTokenQueue = [];
};

const pushPromiseToQueue = (promise) => {
  waitForRefreshTokenQueue.push(promise);
};

const privateClient = axios.create({
  baseURL,
  withCredentials: true,
  paramsSerializer: {
    encode: (params) => queryString.stringify(params),
  },
});

privateClient.interceptors.request.use((config) => {
  const languageMode = store.getState().languageMode.languageMode || "vi";

  const accessToken = sessionStorage.getItem("actkn");

  return {
    ...config,
    headers: {
      ...(accessToken && {
        Authorization: `Bearer ${accessToken}`,
      }),
      "Accept-Language": languageMode,
    },
  };
});

privateClient.interceptors.response.use(
  (response) => {
    if (response?.data) {
      return response.data.data ? response.data.data : response.data;
    }

    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.errorCode === "EXPIRED_ACCESS_TOKEN" &&
      !originalRequest?._retry
    ) {
      if (!isRefreshingToken) {
        isRefreshingToken = true;
        originalRequest._retry = true;

        try {
          const response = await axios.post(
            `${baseURL}/auth/renew-token`,
            null,
            {
              withCredentials: true,
            },
          );

          const { newAccessToken } = response.data.data;

          sessionStorage.setItem("actkn", newAccessToken);

          processQueue(null, newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return privateClient(originalRequest);
        } catch (error) {
          processQueue(error, null);

          const errorCode = error.response?.data?.errorCode;

          if (
            errorCode === "EXPIRED_REFRESH_TOKEN" ||
            errorCode === "INVALID_REFRESH_TOKEN"
          ) {
            sessionStorage.removeItem("actkn");

            store.dispatch({
              type: "User/setUser",
              payload: null,
            });
          }

          return Promise.reject(error);
        } finally {
          isRefreshingToken = false;
        }
      }

      return new Promise((resolve, reject) => {
        pushPromiseToQueue({
          resolve,
          reject,
        });
      }).then((newAccessToken) => {
        originalRequest._retry = true;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return privateClient(originalRequest);
      });
    }

    return Promise.reject(error.response?.data ?? error);
  },
);

export default privateClient;
