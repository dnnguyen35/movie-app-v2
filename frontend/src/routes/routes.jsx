import HomePage from "../pages/HomePage";
import PersonDetail from "../pages/PersonDetail";
import FavoriteList from "../pages/FavoriteList";
import MediaDetail from "../pages/MediaDetail";
import MediaList from "../pages/MediaList";
import MediaSearch from "../pages/MediaSearch";
import PasswordUpdate from "../pages/PasswordUpdate";
import ReviewList from "../pages/ReviewList";
import ProtectedPage from "../components/common/ProtectedPage";
import MediaStream from "../pages/MediaStream";
import Testpage from "../pages/Testpage";
import NotificationPost from "../pages/NotificationPost";
import MediaListBySearch from "../pages/MediaListBySearch";
import MediaListByCountry from "../pages/MediaListByCountry";
import MediaListByGenre from "../pages/MediaListByGenre";

export const routesGen = {
  home: "/",
  mediaSearch: "/search",
  favoriteList: "/favorites",
  reviewList: "/reviews",
  passwordUpdate: "/password-update",
  notificationPost: "/notification-post",
  person: (id) => `/person/${id}`,
  mediaList: (listType) => `/list/${listType}`,
  mediaDetail: (mediaSlug, mediaGenre, mediaId) => `/detail/${mediaSlug}?mediaGenre=${mediaGenre}&mediaId=${mediaId}`,
  mediaStream: (mediaSlug, mediaGenre, mediaId) => `/stream/${mediaSlug}?mediaGenre=${mediaGenre}&mediaId=${mediaId}`,
  mediaListByGenre: (genreSlug) => `/list/genres/${genreSlug}`,
  mediaListByCountry: (countrySlug) => `/list/country/${countrySlug}`,
  mediaSearch: (keyword) => `/list/search/${keyword}`
};

const routes = [
  {
    index: true,
    element: <HomePage />,
    state: "home",
  },
  {
    path: "/person/:personId",
    element: <PersonDetail />,
    state: "person.detail",
  },
  {
    path: "/search",
    element: <MediaSearch />,
    state: "search",
  },
  {
    path: "/password-update",
    element: (
      <ProtectedPage>
        <PasswordUpdate />
      </ProtectedPage>
    ),
    state: "password.update",
  },
  {
    path: "/favorites",
    element: (
      <ProtectedPage>
        <FavoriteList />
      </ProtectedPage>
    ),
    state: "favorites",
  },
  {
    path: "/reviews",
    element: (
      <ProtectedPage>
        <ReviewList />
      </ProtectedPage>
    ),
    state: "reviews",
  },
  {
    path: "/list/genres/:genreSlug",
    element: <MediaListByGenre />,
  },
  {
    path: "/list/country/:countrySlug",
    element: <MediaListByCountry />,
  },
  {
    path: "/list/search/:keyword",
    element: <MediaListBySearch/>
  },
  {
    path: "/detail/:mediaSlug",
    element: <MediaDetail />,
  },
  {
    path: "/stream/:mediaSlug",
    element: <MediaStream />,
    state: "media.stream",
  },
  {
    path: "/notification-post",
    element: (
      <ProtectedPage>
        <NotificationPost />
      </ProtectedPage>
    ),
    state: "notification.post",
  },
];

export default routes;
