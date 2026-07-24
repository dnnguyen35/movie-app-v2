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

export const routesGen = {
  home: "/",
  mediaSearch: "/search",
  favoriteList: "/favorites",
  reviewList: "/reviews",
  passwordUpdate: "/password-update",
  notificationPost: "/notification-post",
  person: (id) => `/person/${id}`,
  mediaList: (type) => `/${type}`,
  mediaDetail: (type, id) => `/${type}/${id}`,
  mediaStream: (mediaType, mediaId) => `/${mediaType}/${mediaId}/stream`,
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
    path: "/:mediaType",
    element: <MediaList />,
  },
  {
    path: "/:mediaType/:mediaId",
    element: <MediaDetail />,
  },
  {
    path: "/:mediaType/:mediaId/stream",
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
