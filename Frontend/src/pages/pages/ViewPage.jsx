import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import api from "../../services/api";

export default function ViewPage() {
  const { id } = useParams();

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPage();
  }, [id]);

  const fetchPage = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/pages/${id}`);

      setPage(res.data.page);
    } catch (err) {
      console.error("FETCH PAGE ERROR:", err);

      setError(
        err.response?.data?.message || "Failed to load page"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>

        <Button
          component={Link}
          to="/pages"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Pages
        </Button>
      </Box>
    );
  }

  if (!page) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">
          Page not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      {/* Header */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            View Page
          </Typography>

          <Typography color="text.secondary">
            Preview page details
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            component={Link}
            to="/pages"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
          >
            All Pages
          </Button>

          <Button
            component={Link}
            to={`/pages/edit/${id}`}
            variant="contained"
            startIcon={<EditIcon />}
          >
            Edit Page
          </Button>
        </Box>
      </Box>

      {/* Page */}

      <Paper
        elevation={0}
        sx={{
          maxWidth: 1000,
          mx: "auto",
          p: 5,
          borderRadius: 4,
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Title */}

        <Typography
          variant="h3"
          fontWeight={700}
          sx={{ mb: 2 }}
        >
          {page.post_title}
        </Typography>

        {/* Status */}

        <Box sx={{ mb: 3 }}>
          <Chip
            label={page.post_status || "draft"}
            color={
              page.post_status === "published"
                ? "success"
                : "warning"
            }
          />
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Slug */}

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1 }}
        >
          Slug
        </Typography>

        <Typography sx={{ mb: 4 }}>
          /{page.post_name}
        </Typography>

        {/* Excerpt */}

        {page.post_excerpt && (
          <>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ mb: 1 }}
            >
              Excerpt
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              {page.post_excerpt}
            </Typography>
          </>
        )}

        {/* Content */}

        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ mb: 2 }}
        >
          Content
        </Typography>

        <Box
          sx={{
            lineHeight: 1.8,
            "& img": {
              maxWidth: "100%",
            },
            "& a": {
              color: "#2563EB",
            },
          }}
          dangerouslySetInnerHTML={{
            __html: page.post_content || "",
          }}
        />
      </Paper>
    </Box>
  );
}