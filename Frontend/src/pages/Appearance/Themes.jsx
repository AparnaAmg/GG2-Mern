import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import {
  Add,
  Palette,
  CheckCircle,
  Delete,
  Visibility,
} from "@mui/icons-material";

export default function Themes() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedTheme, setSelectedTheme] =
    useState(null);

  const [viewOpen, setViewOpen] =
    useState(false);

  /*
  =====================================================
  FETCH THEMES
  =====================================================
  */

  const fetchThemes = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/themes");

      setThemes(res.data?.themes || []);
    } catch (err) {
      console.error("FETCH THEMES ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load themes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  /*
  =====================================================
  ACTIVATE
  =====================================================
  */

  const activateTheme = async (id) => {
    try {
      await api.put(`/themes/${id}/activate`);

      await fetchThemes();
    } catch (err) {
      console.error(
        "ACTIVATE THEME ERROR:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to activate theme"
      );
    }
  };

  /*
  =====================================================
  DELETE
  =====================================================
  */

  const deleteTheme = async (theme) => {
    if (theme.status === "active") {
      alert(
        "The active theme cannot be deleted."
      );

      return;
    }

    const confirmed = window.confirm(
      `Delete "${theme.theme_name}"?`
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/themes/${theme.id}`
      );

      await fetchThemes();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete theme"
      );
    }
  };

  /*
  =====================================================
  LOADING
  =====================================================
  */

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  /*
  =====================================================
  UI
  =====================================================
  */

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
          >
            Themes
          </Typography>

          <Typography
            color="text.secondary"
          >
            Manage the appearance and active
            theme of your GG2 website.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() =>
            alert(
              "Theme upload will be added next."
            )
          }
        >
          Add New Theme
        </Button>
      </Box>

      {/* ERROR */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* THEMES */}

      {themes.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 8,
            textAlign: "center",
            borderRadius: 3,
          }}
        >
          <Palette
            sx={{
              fontSize: 60,
              color: "text.secondary",
            }}
          />

          <Typography
            variant="h6"
            sx={{ mt: 2 }}
          >
            No themes found
          </Typography>
        </Paper>
      ) : (
        <Grid
          container
          spacing={3}
        >
          {themes.map((theme) => (
            <Grid
              key={theme.id}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border:
                    "1px solid #e5e7eb",
                  overflow: "hidden",
                  height: "100%",
                }}
              >
                {/* PREVIEW */}

                {theme.theme_image ? (
                  <CardMedia
                    component="img"
                    height="220"
                    image={
                      theme.theme_image
                    }
                    alt={
                      theme.theme_name
                    }
                  />
                ) : (
                  <Box
                    sx={{
                      height: 220,
                      bgcolor: "#1f2937",
                      display: "flex",
                      justifyContent:
                        "center",
                      alignItems: "center",
                    }}
                  >
                    <Palette
                      sx={{
                        fontSize: 70,
                        color: "white",
                      }}
                    />
                  </Box>
                )}

                <CardContent>
                  {/* NAME */}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={700}
                    >
                      {theme.theme_name}
                    </Typography>

                    {theme.status ===
                      "active" && (
                      <Chip
                        icon={
                          <CheckCircle />
                        }
                        label="Active"
                        color="success"
                        size="small"
                      />
                    )}
                  </Box>

                  {/* DESCRIPTION */}

                  <Typography
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {theme.description ||
                      "No description available."}
                  </Typography>

                  {/* DETAILS */}

                  <Typography
                    variant="body2"
                    sx={{ mt: 2 }}
                  >
                    Version:{" "}
                    {theme.version ||
                      "-"}
                  </Typography>

                  <Typography
                    variant="body2"
                  >
                    Author:{" "}
                    {theme.author ||
                      "-"}
                  </Typography>

                  {/* ACTIONS */}

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mt: 3,
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={
                        <Visibility />
                      }
                      onClick={() => {
                        setSelectedTheme(
                          theme
                        );
                        setViewOpen(true);
                      }}
                    >
                      Details
                    </Button>

                    {theme.status !==
                      "active" && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() =>
                          activateTheme(
                            theme.id
                          )
                        }
                      >
                        Activate
                      </Button>
                    )}

                    {theme.status !==
                      "active" && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() =>
                          deleteTheme(
                            theme
                          )
                        }
                      >
                        <Delete />
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* DETAILS DIALOG */}

      <Dialog
        open={viewOpen}
        onClose={() =>
          setViewOpen(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Theme Details
        </DialogTitle>

        <DialogContent dividers>
          {selectedTheme && (
            <Box>
              <Typography
                variant="h5"
                fontWeight={700}
              >
                {
                  selectedTheme.theme_name
                }
              </Typography>

              <Typography
                sx={{ mt: 2 }}
              >
                {
                  selectedTheme.description
                }
              </Typography>

              <Typography
                sx={{ mt: 2 }}
              >
                <b>Version:</b>{" "}
                {
                  selectedTheme.version ||
                  "-"
                }
              </Typography>

              <Typography>
                <b>Author:</b>{" "}
                {
                  selectedTheme.author ||
                  "-"
                }
              </Typography>

              <Typography>
                <b>Slug:</b>{" "}
                {
                  selectedTheme.theme_slug
                }
              </Typography>

              <Box sx={{ mt: 2 }}>
                {themeStatus(
                  selectedTheme.status
                )}
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setViewOpen(false)
            }
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/*
=====================================================
STATUS
=====================================================
*/

function themeStatus(status) {
  if (status === "active") {
    return (
      <Chip
        icon={<CheckCircle />}
        label="Active Theme"
        color="success"
      />
    );
  }

  return (
    <Chip
      label="Inactive"
      color="default"
    />
  );
}