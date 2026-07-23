import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import menuConfigs from "../../configs/menu.configs";
import { setUser } from "../../redux/features/userSlice";
import { useTranslation } from "react-i18next";
import userApi from "../../api/modules/user.api";

const UserMenu = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState(null);

  const [isLogoutRequest, setIsLogoutRequest] = useState(false);

  const toggleMenu = (e) => setAnchorEl(e.currentTarget);

  const handleLogout = async () => {
    if (isLogoutRequest) return;

    setIsLogoutRequest(true);

    const { response, error } = await userApi.logout();

    setIsLogoutRequest(false);

    if (response) {
      sessionStorage.removeItem("actkn");
      dispatch(setUser(null));
      setAnchorEl(null);
    }

    if (error) {
    }
  };
  return (
    <>
      {user && (
        <>
          <Typography
            variant="h6"
            sx={{ cursor: "pointer", userSelect: "none" }}
            onClick={toggleMenu}
          >
            {user?.name?.length > 5
              ? `${user?.name?.slice(0, 5)}...`
              : user?.name}
          </Typography>

          <Menu
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ sx: { padding: 0 } }}
          >
            {menuConfigs.user.map((item, index) => (
              <ListItemButton
                component={Link}
                to={item.path}
                key={index}
                onClick={() => setAnchorEl(null)}
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
            <ListItemButton
              sx={{ borderRadius: "10px" }}
              onClick={() => handleLogout()}
            >
              <ListItemIcon>
                <LogoutOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                disableTypography
                primary={
                  <Typography textTransform="uppercase">
                    {t("user.sign_out")}
                  </Typography>
                }
              />
            </ListItemButton>
          </Menu>
        </>
      )}
    </>
  );
};

export default UserMenu;
