import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";

import {
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
} from "@mui/material";

import {
  Dashboard,
  Article,
  Category,
  LocalOffer,
  People,
  PersonAdd,
  AccountCircle,
  Image,
  Settings,
  ExpandLess,
  ExpandMore,
  Add,
  ListAlt,
} from "@mui/icons-material";

export default function Sidebar() {
  const location = useLocation();

  const [openPosts, setOpenPosts] = useState(true);
  const [openUsers, setOpenUsers] = useState(false);
  const [openMedia, setOpenMedia] = useState(false);
  
  const activeStyle = {
    bgcolor: "#2563EB",
    color: "#fff",
    borderRadius: 2,
    mx: 1,
    "& .MuiListItemIcon-root": {
      color: "#fff",
    },
  };

  const menuStyle = {
    borderRadius: 2,
    mx: 1,
    mb: 0.5,
    color: "#CBD5E1",
    "& .MuiListItemIcon-root": {
      color: "#94A3B8",
    },
    "&:hover": {
      bgcolor: "#1E293B",
      color: "#fff",
      "& .MuiListItemIcon-root": {
        color: "#fff",
      },
    },
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 260,
          bgcolor: "#0F172A",
          color: "#fff",
          border: 0,
        },
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "center",
          py: 2,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          color="#fff"
        >
          GG2 CMS
        </Typography>
      </Toolbar>

      <Box sx={{ px: 1 }}>

        <List>

          {/* Dashboard */}

          <ListItemButton
            component={Link}
            to="/dashboard"
            sx={
              location.pathname === "/dashboard"
                ? activeStyle
                : menuStyle
            }
          >
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>

            <ListItemText primary="Dashboard" />
          </ListItemButton>

          {/* POSTS */}

          <ListItemButton
            sx={menuStyle}
            onClick={() => setOpenPosts(!openPosts)}
          >
            <ListItemIcon>
              <Article />
            </ListItemIcon>

            <ListItemText primary="Posts" />

            {openPosts ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={openPosts}>

            <List>

              <ListItemButton
                component={Link}
                to="/posts"
                sx={{
                  pl: 5,
                  ...(location.pathname === "/posts"
                    ? activeStyle
                    : menuStyle),
                }}
              >
                <ListItemIcon>
                  <ListAlt />
                </ListItemIcon>

                <ListItemText primary="All Posts" />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/posts/add"
                sx={{
                  pl: 5,
                  ...(location.pathname === "/posts/add"
                    ? activeStyle
                    : menuStyle),
                }}
              >
                <ListItemIcon>
                  <Add />
                </ListItemIcon>

                <ListItemText primary="Add Post" />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/posts/categories"
                sx={{
                  pl: 5,
                  ...(location.pathname === "/posts/categories"
                    ? activeStyle
                    : menuStyle),
                }}
              >
                <ListItemIcon>
                  <Category />
                </ListItemIcon>

                <ListItemText primary="Categories" />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/posts/tags"
                sx={{
                  pl: 5,
                  ...(location.pathname === "/posts/tags"
                    ? activeStyle
                    : menuStyle),
                }}
              >
                <ListItemIcon>
                  <LocalOffer />
                </ListItemIcon>

                <ListItemText primary="Tags" />
              </ListItemButton>

              {/* <ListItemButton
                component={Link}
                to="/media"
                sx={{
                  pl: 5,
                  ...(location.pathname === "/media"
                    ? activeStyle
                    : menuStyle),
                }}
              >
                <ListItemIcon>
                  <Image />
                </ListItemIcon>

                <ListItemText primary="Media" />
              </ListItemButton> */}
             {/* MEDIA */}

<ListItemButton
  sx={menuStyle}
  onClick={() => setOpenMedia(!openMedia)}
>
  <ListItemIcon>
    <PhotoLibraryIcon />
  </ListItemIcon>

  <ListItemText primary="Media" />

  {openMedia ? <ExpandLess /> : <ExpandMore />}
</ListItemButton>

<Collapse in={openMedia} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>

    <ListItemButton
      component={Link}
      to="/media"
      sx={{
        pl: 5,
        ...(location.pathname === "/media"
          ? activeStyle
          : menuStyle),
      }}
    >
      <ListItemIcon>
        <PhotoLibraryIcon />
      </ListItemIcon>

      <ListItemText primary="Library" />
    </ListItemButton>

    <ListItemButton
      component={Link}
      to="/media/upload"
      sx={{
        pl: 5,
        ...(location.pathname === "/media/upload"
          ? activeStyle
          : menuStyle),
      }}
    >
      <ListItemIcon>
        <Add />
      </ListItemIcon>

      <ListItemText primary="Add Media" />
    </ListItemButton>

  </List>
</Collapse>

            </List>

          </Collapse>

          {/* USERS */}

          <ListItemButton
            sx={menuStyle}
            onClick={() => setOpenUsers(!openUsers)}
          >
            <ListItemIcon>
              <People />
            </ListItemIcon>

            <ListItemText primary="Users" />

            {openUsers ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={openUsers}>

            <List>

              <ListItemButton
                component={Link}
                to="/users"
                sx={{
                  pl: 5,
                  ...(location.pathname === "/users"
                    ? activeStyle
                    : menuStyle),
                }}
              >
                <ListItemIcon>
                  <People />
                </ListItemIcon>

                <ListItemText primary="All Users" />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/users/add"
                sx={{
                  pl: 5,
                  ...(location.pathname === "/users/add"
                    ? activeStyle
                    : menuStyle),
                }}
              >
                <ListItemIcon>
                  <PersonAdd />
                </ListItemIcon>

                <ListItemText primary="Add User" />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/profile"
                sx={{
                  pl: 5,
                  ...(location.pathname === "/profile"
                    ? activeStyle
                    : menuStyle),
                }}
              >
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>

                <ListItemText primary="Profile" />
              </ListItemButton>

            </List>

          </Collapse>

          {/* SETTINGS */}

          <ListItemButton
            component={Link}
            to="/settings"
            sx={
              location.pathname === "/settings"
                ? activeStyle
                : menuStyle
            }
          >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>

            <ListItemText primary="Settings" />
          </ListItemButton>

        </List>

      </Box>
    </Drawer>
  );
}