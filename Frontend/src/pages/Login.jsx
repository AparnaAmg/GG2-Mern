import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();

  setError("");

  const cleanEmail = email.trim().toLowerCase();

  console.log("Login email:", cleanEmail);
  console.log("Login password:", password);

  try {
    const res = await api.post("/auth/login", {
      email: cleanEmail,
      password,
    });

    console.log("LOGIN SUCCESS:", res.data);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    navigate("/dashboard");

  } catch (err) {
    console.log("LOGIN ERROR:", err.response?.data);

    setError(
      err.response?.data?.message ||
      "Invalid email or password"
    );
  }
};
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
      }}
    >
      {/* LEFT */}

      <Box
        sx={{
          flex: 1,
          background:
            "linear-gradient(135deg,#0F172A,#2563EB,#06B6D4)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: 8,
        }}
      >
        <Typography
          variant="h2"
          fontWeight={700}
        >
          GG2 CMS
        </Typography>

        <Typography
          mt={3}
          fontSize={22}
          sx={{ opacity: .9 }}
        >
          Modern Content Management System
        </Typography>

        <Typography
          mt={2}
          fontSize={17}
          sx={{ opacity: .8 }}
        >
          Manage Posts, Categories, Tags,
          Users and Media with one dashboard.
        </Typography>

      </Box>

      {/* RIGHT */}

      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#F5F7FA",
        }}
      >
        <Paper
          elevation={20}
          sx={{
            width: 450,
            p: 5,
            borderRadius: 5,
            backdropFilter: "blur(20px)",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            mb={1}
          >
            Welcome Back 👋
          </Typography>

          <Typography
            color="text.secondary"
            mb={4}
          >
            Login to your GG2 Admin Dashboard
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>

            <TextField
              fullWidth
              label="Email Address"
              margin="normal"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              InputProps={{
                startAdornment:(
                  <InputAdornment position="start">
                    <Email/>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              InputProps={{
                startAdornment:(
                  <InputAdornment position="start">
                    <Lock/>
                  </InputAdornment>
                ),
                endAdornment:(
                  <InputAdornment position="end">
                    <IconButton
                      onClick={()=>
                        setShowPassword(!showPassword)
                      }
                    >
                      {
                        showPassword
                          ? <VisibilityOff/>
                          : <Visibility/>
                      }
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >

              <FormControlLabel
                control={<Checkbox/>}
                label="Remember Me"
              />

              <Typography
                color="primary"
                sx={{
                  cursor:"pointer",
                  fontWeight:600
                }}
              >
                Forgot Password?
              </Typography>

            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                mt:4,
                height:55,
                borderRadius:3,
                fontSize:18,
                textTransform:"none",
                background:
                  "linear-gradient(90deg,#2563EB,#06B6D4)",
              }}
            >
              Login
            </Button>

          </Box>

          <Typography
            align="center"
            mt={5}
            color="text.secondary"
          >
            © 2026 GG2 CMS
          </Typography>

        </Paper>

      </Box>

    </Box>
  );
}