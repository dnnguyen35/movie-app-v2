import { useSelector, useDispatch } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Toolbar,
  useScrollTrigger,
} from "@mui/material";
import { cloneElement, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import menuConfigs from "../../configs/menu.configs";
import { themeModes } from "../../configs/theme.configs";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import { setThemeMode } from "../../redux/features/themeModeSlice";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import Sidebar from "./Sidebar";
import LanguageToggle from "./LanguageToggle";
import { useTranslation } from "react-i18next";
import mediaApi from "../../api/modules/media.api";
import MenuPopover from "./MenuPopover";
import { routesGen } from "../../routes/routes";
import { ClickAwayListener } from "@mui/material";
import SearchInput from "./SearchInput";
import { Search } from "lucide-react";

const ScrollAppBar = ({ children, window }) => {
  const { themeMode } = useSelector((state) => state.themeMode);

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
    target: window ? window() : undefined,
  });

  return cloneElement(children, {
    sx: {
      color: trigger
        ? "text.primary"
        : themeMode === themeModes.dark
          ? "primary.contrastText"
          : "text.primary",
      backgroundColor: trigger ? "background.paper" : "transparent",
    },
  });
};

const Topbar = () => {
  const { user } = useSelector((state) => state.user);
  const { appState } = useSelector((state) => state.appState);
  const { themeMode } = useSelector((state) => state.themeMode);
  const { t } = useTranslation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuType, setMenuType] = useState(null);

  const dispatch = useDispatch();

  const onSwitchTheme = () => {
    const theme =
      themeMode === themeModes.dark ? themeModes.light : themeModes.dark;
    dispatch(setThemeMode(theme));
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleMenuOpen = (event, type) => {
    if (menuType === type) {
      setMenuAnchorEl(null);
      setMenuType(null);
      return;
    }

    setMenuAnchorEl(event.currentTarget);
    setMenuType(type);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuType(null);
  };

  useEffect(() => {
    const getGenresAndCountries = async () => {
      const [genreResult, countryResult] = await Promise.all([
        mediaApi.getGenres(),
        mediaApi.getCountries(),
      ]);

      if (genreResult.response) {
        setGenres(genreResult.response?.data?.items || []);
      }

      if (countryResult.response) {
        setCountries(countryResult.response?.data?.items || []);
      }
    };

    getGenresAndCountries();
  }, []);

  return (
    <>
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
      <ScrollAppBar>
        <AppBar elevation={0} sx={{ zIndex: 9999 }}>
          <Toolbar
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                color="inherit"
                sx={{ mr: 2, display: { md: "none" } }}
                onClick={toggleSidebar}
              >
                <MenuIcon />
              </IconButton>

              <Box sx={{ display: { xs: "inline-block", md: "none" } }}>
                <SearchInput />
              </Box>
            </Stack>

            {/* display main menu */}
            <Box
              flexGrow={1}
              alignItems="center"
              display={{ xs: "none", md: "flex" }}
            >
              <Box sx={{ marginRight: "30px" }}>
                <Logo />
              </Box>

              <SearchInput />

              <ClickAwayListener onClickAway={handleMenuClose}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <MenuPopover
                    label={t("topbar.genres")}
                    items={genres}
                    anchorEl={menuType === "genre" ? menuAnchorEl : null}
                    onOpen={(event) => handleMenuOpen(event, "genre")}
                    onClose={handleMenuClose}
                    getPath={(slug) => routesGen.mediaListByGenre(slug)}
                  />

                  <MenuPopover
                    label={t("topbar.countries")}
                    items={countries}
                    anchorEl={menuType === "country" ? menuAnchorEl : null}
                    onOpen={(event) => handleMenuOpen(event, "country")}
                    onClose={handleMenuClose}
                    getPath={(slug) => routesGen.mediaListByCountry(slug)}
                  />
                </Box>
              </ClickAwayListener>

              <IconButton sx={{ color: "inherit" }} onClick={onSwitchTheme}>
                {themeMode === themeModes.dark ? (
                  <WbSunnyOutlinedIcon />
                ) : (
                  <DarkModeOutlinedIcon />
                )}
              </IconButton>
              {/* <LanguageToggle /> */}
            </Box>
            {/* display main menu */}

            {/* user mennu */}
            <Stack spacing={3} direction="row" alignItems="center">
              {!user && (
                <Button
                  variant="contained"
                  onClick={() => dispatch(setAuthModalOpen(true))}
                  sx={{ borderRadius: "20px" }}
                >
                  {t("topbar.sign_in")}
                </Button>
              )}
              {user &&
              Array.isArray(user.roles) &&
              user.roles.includes("ROLE_ADMIN") ? (
                <Link to="/admin" style={{ textDecoration: "none" }}>
                  <IconButton sx={{ color: "primary.main" }}>
                    <SettingsOutlinedIcon />
                  </IconButton>
                </Link>
              ) : null}
              {user && <UserMenu />}
            </Stack>
          </Toolbar>
        </AppBar>
      </ScrollAppBar>
    </>
  );
};

export default Topbar;
