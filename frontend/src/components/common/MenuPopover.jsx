import { Box, Button, Paper, Popper } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link } from "react-router-dom";

const MenuPopover = ({ label, items, anchorEl, onOpen, onClose, getPath }) => {
  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        onClick={onOpen}
        endIcon={<KeyboardArrowDownIcon />}
        variant={open ? "contained" : "outlined"}
        sx={{
          mr: 2,
          backgroundColor: open ? "primary.dark" : "transparent",
          color: "secondary.contrastText",
          borderColor: "primary.main",

          "&:hover": {
            backgroundColor: open ? "primary.dark" : "action.hover",
          },
          borderRadius: "25px",
        }}
      >
        {label}
      </Button>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        disablePortal
        sx={{ zIndex: 10000 }}
      >
        <Paper
          sx={{
            mt: 1,
            width: 320,
            maxWidth: "calc(100vw - 20px)",
            borderRadius: 2,
            p: 1,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
            }}
          >
            {items.map((item) => (
              <Button
                key={item._id}
                component={Link}
                to={getPath(item.slug)}
                onClick={onClose}
                sx={{
                  justifyContent: "flex-start",
                  color: "text.primary",
                  textTransform: "none",
                  fontSize: "0.8rem",
                  px: 1,
                  py: 0.7,
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: "primary.main",
                  },
                }}
              >
                {item.name}
              </Button>
            ))}
          </Box>
        </Paper>
      </Popper>
    </>
  );
};

export default MenuPopover;
