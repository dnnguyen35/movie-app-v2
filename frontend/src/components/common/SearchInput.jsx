import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, InputBase } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import mediaApi from "../../api/modules/media.api";
import SearchDropdown from "./SearchDropdown";

const SearchInput = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");

  const [totalPages, setTotalPages] = useState(1);

  const { t } = useTranslation();

  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++requestIdRef.current;

    const keyword = query.trim();

    if (!keyword) {
      setResults([]);
      setLoading(false);
      return;
    }

    setResults([]);
    setLoading(true);

    const timer = setTimeout(async () => {
      setLoading(true);

      const { response, error } = await mediaApi.search({
        keyword: keyword,
        page: 1,
      });

      if (requestId !== requestIdRef.current) {
        return;
      }

      if (response) {
        setResults(response?.data?.items || []);
        setTotalPages(response?.data?.params?.pagination?.totalPages || 1);
        setKeyword(keyword);
      } else if (error) {
        setKeyword("");
        setResults([]);
      }

      setLoading(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  const handleClear = () => {
    requestIdRef.current++;

    setQuery("");
    setKeyword("");
    setResults([]);
    setLoading(false);
    setTotalPages(1);
  };

  const showDropdown = query.trim().length > 0;

  return (
    <Box
      sx={{
        position: "relative",
        width: {
          xs: "41vw",
          md: 300,
          lg: 320,
        },
        mr: 2,
      }}
    >
      <Box
        sx={{
          height: 38,
          display: "flex",
          alignItems: "center",
          px: 1.5,
          border: "1px solid",
          borderColor: "primary.main",
          borderRadius: "20px",
          backgroundColor: "rgba(0,0,0,0.25)",

          "&:focus-within": {
            borderColor: "primary.main",
          },
        }}
      >
        <SearchIcon
          sx={{
            fontSize: 20,
            color: "primary.main",
            mr: 0.5,
          }}
        />

        <InputBase
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("mediasearch.search_placeholder")}
          sx={{
            flex: 1,
            minWidth: 0,
            fontSize: "0.85rem",
            color: "primary.contrastText",

            "& input::placeholder": {
              color: "",
              opacity: 1,
            },
          }}
        />

        {query && (
          <IconButton
            size="small"
            onClick={handleClear}
            sx={{
              p: 0.3,
              color: "text.secondary",
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Box>

      {showDropdown && (
        <SearchDropdown
          query={keyword}
          results={results}
          loading={loading}
          onClose={handleClear}
          totalPages={totalPages}
        />
      )}
    </Box>
  );
};

export default SearchInput;
