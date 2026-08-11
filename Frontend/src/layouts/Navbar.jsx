import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Badge,
  Box,
  Menu,
  MenuItem,
  Divider,
  IconButton,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate("/users/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "#fff",
          color: "#222",
          borderBottom: "1px solid #E5E7EB",
          zIndex: 1201,
        }}
      >
        <Toolbar>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              flexGrow: 1,
            }}
          >
            GG2 Admin
          </Typography>

          <TextField
            size="small"
            placeholder="Search..."
            sx={{
              width: 300,
              mr: 4,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#F5F5F5",
                borderRadius: 2,
              },
            }}
          />

          <IconButton>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Box
            onClick={handleMenu}
            sx={{
              ml: 3,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              px: 2,
              py: 1,
              borderRadius: 2,
              "&:hover": {
                bgcolor: "#F3F4F6",
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                mr: 1,
              }}
            >
               {user?.display_name || user?.user_login || "Admin"}
            </Typography>

            <KeyboardArrowDownIcon />
          </Box>

        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 220,
            borderRadius: 2,
            mt: 1,
          },
        }}
      >
        <MenuItem disabled>
          <Typography fontWeight={600}>
            {user?.user_email}
          </Typography>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleProfile}>
          <AccountCircleIcon
            sx={{
              mr: 1,
              fontSize: 20,
            }}
          />
          Edit Profile
        </MenuItem>

        <MenuItem
          onClick={handleLogout}
          sx={{ color: "red" }}
        >
          <LogoutIcon
            sx={{
              mr: 1,
              fontSize: 20,
            }}
          />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}