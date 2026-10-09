import {
  Box,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import { routesGen } from "../../routes/routes";

const SearchDropdown = ({
  query,
  results,
  loading,
  onClose,
  totalPages
}) => {
  const { t } = useTranslation();

  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleScroll = (event) => {
    const element = event.currentTarget;

    const atBottom =
      element.scrollTop + element.clientHeight >=
      element.scrollHeight - 5;

    setIsAtBottom(atBottom);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        position: "absolute",
        top: "calc(100% + 10px)",
        left: 0,

        width: {
          xs: "170%",
          md: "100%",
        },

        overflow: "hidden",

        borderRadius: 3,

        border: "1px solid",
        borderColor: "divider",

        backgroundColor: "background.paper",

        boxShadow:
          "0 12px 40px rgba(0, 0, 0, 0.18)",

        zIndex: 10000,

        animation:
          "searchDropdownEnter 180ms cubic-bezier(0.16, 1, 0.3, 1)",

        "@keyframes searchDropdownEnter": {
          from: {
            opacity: 0,
            transform: "translateY(-6px) scale(0.985)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0) scale(1)",
          },
        },
      }}
    >
      {/* Loading */}
      {loading && (
        <Box
          sx={{
            height: 58,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            size={19}
            thickness={4}
            sx={{
              color: "primary.main",
            }}
          />
        </Box>
      )}

      {/* Empty */}
      {!loading && results.length === 0 && (
        <Box
          sx={{
            px: 2,
            py: 3,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: "0.8rem",
            }}
          >
            {t("mediasearch.not_found")}
          </Typography>
        </Box>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <>
          <Box
            onScroll={handleScroll}
            sx={(theme) => ({
              maxHeight: 420,
              overflowY: "auto",
              overscrollBehavior: "contain",

              scrollbarWidth: "thin",
              scrollbarColor: `${theme.palette.primary.main} transparent`,

              "&::-webkit-scrollbar": {
                width: "5px",
              },

              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },

              "&::-webkit-scrollbar-thumb": {
                backgroundColor: theme.palette.primary.main,
                borderRadius: "999px",
                boxShadow: `inset 0 0 0 1px ${theme.palette.background.paper}`,
              },

              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: theme.palette.primary.light,
              },
            })}
          >
            {results.map((movie) => (
              <Box
                key={movie._id}
                component={Link}
                to={routesGen.mediaDetail(
                  movie.slug,
                  movie.category?.[0]?.slug,
                  movie._id,
                )}
                onClick={onClose}
                sx={{
                  position: "relative",

                  display: "flex",
                  alignItems: "center",

                  gap: 1.5,

                  px: 1.25,
                  py: 1.05,

                  textDecoration: "none",
                  color: "inherit",

                  transition:
                    "background-color 160ms ease",

                  "&:hover": {
                    backgroundColor:
                      "action.hover",
                  },

                  "&:not(:last-child)::after": {
                    content: '""',

                    position: "absolute",

                    left: 76,
                    right: 12,
                    bottom: 0,

                    height: "1px",

                    backgroundColor:
                      "divider",

                    opacity: 0.5,
                  },
                }}
              >
                {/* Poster */}
                <Box
                  sx={{
                    width: 48,
                    height: 68,

                    flexShrink: 0,

                    overflow: "hidden",

                    borderRadius: 1.5,

                    backgroundColor:
                      "action.hover",
                  }}
                >
                  <Box
                    component="img"
                    src={movie.poster_url || movie.thumb_url}
                    alt={movie.name}
                    sx={{
                      width: "100%",
                      height: "100%",

                      display: "block",

                      objectFit: "cover",

                      transition:
                        "transform 220ms ease",

                      "&:hover": {
                        transform: "scale(1.04)",
                      },
                    }}
                  />
                </Box>

                {/* Movie information */}
                <Box
                  sx={{
                    minWidth: 0,
                    flex: 1,

                    display: "flex",
                    flexDirection: "column",

                    justifyContent: "center",

                    py: 0.15,
                  }}
                >
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{
                      fontSize: "0.84rem",
                      fontWeight: 600,

                      lineHeight: 1.35,

                      color: "text.primary",
                    }}
                  >
                    {movie.name}
                  </Typography>

                  <Typography
                    variant="caption"
                    noWrap
                    sx={{
                      mt: 0.35,

                      fontSize: "0.71rem",

                      lineHeight: 1.3,

                      color: "text.secondary",

                      opacity: 0.9,
                    }}
                  >
                    {movie.origin_name}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",

                      gap: 0.7,

                      mt: 0.45,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.68rem",

                        color: "text.secondary",
                      }}
                    >
                      {movie.year}
                    </Typography>

                    <Box
                      sx={{
                        width: 3,
                        height: 3,

                        borderRadius: "50%",

                        backgroundColor:
                          "text.disabled",
                      }}
                    />

                    <Typography
                      variant="caption"
                      noWrap
                      sx={{
                        fontSize: "0.68rem",

                        color: "text.secondary",
                      }}
                    >
                      {movie.episode_current}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          {/* See all */}
          {(isAtBottom && totalPages > 1) && (
            <Box
              component={Link}
              to={routesGen.mediaSearch(query)}
              onClick={onClose}
              sx={{
                height: 36,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                borderTop: "1px solid",
                borderColor: "divider",

                textDecoration: "none",

                color: "primary.main",

                fontSize: "0.78rem",
                fontWeight: 600,

                backgroundColor:
                  "background.paper",

                transition:
                  "background-color 160ms ease, color 160ms ease",

                animation:
                  "seeAllEnter 180ms ease-out",

                "@keyframes seeAllEnter": {
                  from: {
                    opacity: 0,
                    transform:
                      "translateY(4px)",
                  },
                  to: {
                    opacity: 1,
                    transform:
                      "translateY(0)",
                  },
                },

                "&:hover": {
                  backgroundColor:
                    "action.hover",
                  color: "primary.dark",
                },
              }}
            >
              {t("mediasearch.see_all")}
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default SearchDropdown;
