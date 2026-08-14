import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
} from "@mui/material";

import {
  Save,
  ArrowBack,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

export default function Customize() {
  const navigate = useNavigate();

  const [settings, setSettings] =
    useState({
      site_title: "",
      tagline: "",
      logo: "",
      primary_color: "#1976d2",
      secondary_color: "#111827",
      background_color: "#ffffff",
      header_text: "",
      show_search: "true",
      footer_text: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  /*
  =====================================================
  FETCH SETTINGS
  =====================================================
  */

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const res =
        await api.get("/customizer");

      setSettings((prev) => ({
        ...prev,
        ...(res.data?.settings || {}),
      }));
    } catch (err) {
      console.error(
        "FETCH CUSTOMIZER ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load settings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  /*
  =====================================================
  INPUT
  =====================================================
  */

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess("");
  };

  /*
  =====================================================
  SEARCH TOGGLE
  =====================================================
  */

  const handleSearchToggle = (
    event
  ) => {
    setSettings((prev) => ({
      ...prev,
      show_search:
        event.target.checked
          ? "true"
          : "false",
    }));
  };

  /*
  =====================================================
  SAVE
  =====================================================
  */

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.put(
        "/customizer",
        settings
      );

      setSuccess(
        "Customizer settings saved successfully."
      );
    } catch (err) {
      console.error(
        "SAVE CUSTOMIZER ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to save settings"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
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
          <Button
            startIcon={<ArrowBack />}
            onClick={() =>
              navigate(
                "/appearance/themes"
              )
            }
            sx={{ mb: 1 }}
          >
            Back to Themes
          </Button>

          <Typography
            variant="h4"
            fontWeight={700}
          >
            Customize
          </Typography>

          <Typography color="text.secondary">
            Manage your GG2 website
            appearance and site settings.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </Button>
      </Box>

      {/* ALERTS */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
        >
          {success}
        </Alert>
      )}

      {/* SITE IDENTITY */}

      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 3,
          borderRadius: 3,
          border:
            "1px solid #e5e7eb",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
        >
          Site Identity
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Configure your website title,
          tagline and logo.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <TextField
          fullWidth
          label="Site Title"
          name="site_title"
          value={settings.site_title}
          onChange={handleChange}
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          label="Tagline"
          name="tagline"
          value={settings.tagline}
          onChange={handleChange}
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          label="Logo URL"
          name="logo"
          value={settings.logo}
          onChange={handleChange}
          placeholder="/uploads/logo.png"
          helperText="Enter the uploaded logo path."
        />
      </Paper>

      {/* COLORS */}

      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 3,
          borderRadius: 3,
          border:
            "1px solid #e5e7eb",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
        >
          Colors
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Configure the main colors used
          throughout the website.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 3,
          }}
        >
          <TextField
            label="Primary Color"
            name="primary_color"
            type="color"
            value={
              settings.primary_color
            }
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Secondary Color"
            name="secondary_color"
            type="color"
            value={
              settings.secondary_color
            }
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Background Color"
            name="background_color"
            type="color"
            value={
              settings.background_color
            }
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </Paper>

      {/* HEADER */}

      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 3,
          borderRadius: 3,
          border:
            "1px solid #e5e7eb",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
        >
          Header
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Configure the website header.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <TextField
          fullWidth
          label="Header Text"
          name="header_text"
          value={settings.header_text}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={
                settings.show_search ===
                "true"
              }
              onChange={
                handleSearchToggle
              }
            />
          }
          label="Show Search"
        />
      </Paper>

      {/* FOOTER */}

      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          border:
            "1px solid #e5e7eb",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
        >
          Footer
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Configure your website footer.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Footer Text"
          name="footer_text"
          value={settings.footer_text}
          onChange={handleChange}
        />
      </Paper>

      {/* BOTTOM SAVE */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          size="large"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
}