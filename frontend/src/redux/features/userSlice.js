import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "User",
  initialState: {
    user:
      sessionStorage.getItem("user") &&
      sessionStorage.getItem("user") !== "undefined"
        ? JSON.parse(sessionStorage.getItem("user"))
        : null,
    listFavorites: [],
  },
  reducers: {
    setUser: (state, action) => {
      if (action.payload === null) {
        sessionStorage.removeItem("actkn");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("rftkn");
      } else {
        sessionStorage.setItem("user", JSON.stringify(action.payload.user));

        if (action.payload.accessToken)
          sessionStorage.setItem("actkn", action.payload.accessToken);

        if (action.payload.refreshToken)
          sessionStorage.setItem("rftkn", action.payload.refreshToken);
      }

      state.user = action.payload ? action.payload.user : null;
    },
    setListFavorites: (state, action) => {
      state.listFavorites = action.payload;
    },
    removeFavorite: (state, action) => {
      const { mediaId } = action.payload;
      state.listFavorites = [...state.listFavorites].filter(
        (e) => e.mediaId.toString() !== mediaId.toString(),
      );
    },
    addFavorite: (state, action) => {
      state.listFavorites = [action.payload, ...state.listFavorites];
    },
  },
});

export const { setUser, setListFavorites, removeFavorite, addFavorite } =
  userSlice.actions;

export default userSlice.reducer;
