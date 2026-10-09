import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import menuConfigs from "../../configs/menu.configs";
import Logo from "./Logo";
import uiConfigs from "../../configs/ui.configs";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";

import { useTranslation } from "react-i18next";
import { languageModes } from "../../configs/language.config";
import { setLanguageMode } from "../../redux/features/languageModeSlice";

import { themeModes } from "../../configs/theme.configs";
import { setThemeMode } from "../../redux/features/themeModeSlice";
import { useEffect, useState } from "react";
import { Collapse } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";

import mediaApi from "../../api/modules/media.api";
import { routesGen } from "../../routes/routes";

const Sidebar = ({ open, toggleSidebar }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { appState } = useSelector((state) => state.appState);
  const { themeMode } = useSelector((state) => state.themeMode);

  const { languageMode } = useSelector((state) => state.languageMode);
  const { t } = useTranslation();

  const sidebarWidth = uiConfigs.size.sidebarWith;

  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const [expandedMenu, setExpandedMenu] = useState(null);

  const onSwitchTheme = () => {
    const theme =
      themeMode === themeModes.dark ? themeModes.light : themeModes.dark;
    dispatch(setThemeMode(theme));
  };

  const onSwitchLanguage = () => {
    const newLanguage = languageMode === languageModes.en ? "vi" : "en";
    dispatch(setLanguageMode(newLanguage));
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

  const handleExpand = (type) => {
    setExpandedMenu((prev) => (prev === type ? null : type));
  };

  const drawer = (
    <>
      <Toolbar sx={{ paddingY: "20px", color: "text.primary" }}>
        <Stack width="100%" direction="row" justifyContent="center">
          <Logo />
        </Stack>
      </Toolbar>
      <List sx={{ paddingX: "10px" }}>
        <Typography variant="h6" marginBottom="10px" textTransform="uppercase">
          {t("sidebar.options.options")}
        </Typography>
        {/* {menuConfigs.main.map((item, index) => (
          <ListItemButton
            key={index}
            sx={{
              borderRadius: "15px",
              marginY: 1,
              backgroundColor: appState.includes(item.state)
                ? "primary.main"
                : "unset",
            }}
            component={Link}
            to={item.path}
            onClick={() => toggleSidebar(false)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText
              disableTypography
              primary={
                <Typography textTransform="uppercase">
                  {t(`topbar.${item.display}`)}
                </Typography>
              }
            />
          </ListItemButton>
        ))} */}

        {/* Genres */}
        <ListItemButton
          onClick={() => handleExpand("genre")}
          sx={{ borderRadius: "15px", marginY: 1 }}
        >
          <ListItemIcon>
            <LocalOfferOutlinedIcon />
          </ListItemIcon>

          <ListItemText
            primary={t("topbar.genres")}
            sx={{ textTransform: "uppercase" }}
          />

          {expandedMenu === "genre" ? (
            <ExpandLessIcon />
          ) : (
            <ExpandMoreIcon />
          )}
        </ListItemButton>

        <Collapse in={expandedMenu === "genre"} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {genres.map((item) => (
              <ListItemButton
                key={item._id}
                component={Link}
                to={routesGen.mediaListByGenre(item.slug)}
                onClick={() => toggleSidebar(false)}
                sx={{ pl: 5, borderRadius: "12px" }}
              >
                <ListItemText primary={item.name} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

        {/* Countries */}
        <ListItemButton
          onClick={() => handleExpand("country")}
          sx={{ borderRadius: "15px", marginY: 1 }}
        >
          <ListItemIcon>
            <PublicOutlinedIcon />
          </ListItemIcon>

          <ListItemText
            primary={t("topbar.countries")}
            sx={{ textTransform: "uppercase" }}
          />

          {expandedMenu === "country" ? (
            <ExpandLessIcon />
          ) : (
            <ExpandMoreIcon />
          )}
        </ListItemButton>

        <Collapse in={expandedMenu === "country"} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {countries.map((item) => (
              <ListItemButton
                key={item._id}
                component={Link}
                to={routesGen.mediaListByCountry(item.slug)}
                onClick={() => toggleSidebar(false)}
                sx={{ pl: 5, borderRadius: "12px" }}
              >
                <ListItemText primary={item.name} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

        {user && (
          <>
            <Typography
              variant="h6"
              marginBottom="10px"
              textTransform="uppercase"
            >
              {t("sidebar.personal")}
            </Typography>
            {menuConfigs.user.map((item, index) => (
              <ListItemButton
                key={index}
                sx={{
                  borderRadius: "15px",
                  marginY: 2,
                  backgroundColor: appState.includes(item.state)
                    ? "primary.main"
                    : "unset",
                }}
                component={Link}
                to={item.path}
                onClick={() => toggleSidebar(false)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography textTransform="uppercase">
                      {t(`user.${item.display}`)}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))}
          </>
        )}

        <Typography variant="h6" marginBottom="10px" textTransform="uppercase">
          {t("sidebar.theme.theme")}
        </Typography>
        <ListItemButton onClick={onSwitchTheme}>
          <ListItemIcon>
            {themeMode === themeModes.dark ? (
              <WbSunnyOutlinedIcon />
            ) : (
              <DarkModeOutlinedIcon />
            )}
          </ListItemIcon>
          <ListItemText
            disableTypography
            primary={
              <Typography textTransform="uppercase">
                {themeMode === themeModes.dark
                  ? t("sidebar.theme.light")
                  : t("sidebar.theme.dark")}
              </Typography>
            }
          />
        </ListItemButton>

        {/* <Typography variant="h6" marginBottom="20px" textTransform="uppercase">
          {t("sidebar.language.language")}
        </Typography>
        <ListItemButton onClick={onSwitchLanguage}>
          <ListItemIcon>
            <img
              src={
                languageMode === "en"
                  ? "/Flag_of_Vietnam.svg"
                  : "/Flag_of_the_United_Kingdom.svg"
              }
              alt={languageMode === "vi" ? "Vietnam Flag" : "UK Flag"}
              width="24"
              height="24"
              style={{
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </ListItemIcon>
          <ListItemText
            disableTypography
            primary={
              <Typography textTransform="uppercase">
                {languageMode === languageModes.en
                  ? t("sidebar.language.vietnamese")
                  : t("sidebar.language.english")}
              </Typography>
            }
          />
        </ListItemButton> */}
      </List>
    </>
  );
  return (
    <Drawer
      open={open}
      onClose={() => toggleSidebar(false)}
      sx={{
        "& .MuiDrawer-Paper": {
          boxSizing: "border-box",
          width: sidebarWidth,
          borderRight: "0px",
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar;
