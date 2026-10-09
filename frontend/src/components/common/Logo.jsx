import { Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { routesGen } from "../../routes/routes";

const Logo = () => {
  const theme = useTheme();

  return (
    <Link to={routesGen.home}>
      <Typography
        fontWeight="700"
        fontSize="1.7rem"
        sx={{
          background: "linear-gradient(90deg, #4ADE80, #14B8A6, #3B82F6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          display: "inline-block",
        }}
      >
        phimCủaTôi
      </Typography>
    </Link>
  );
};

export default Logo;
