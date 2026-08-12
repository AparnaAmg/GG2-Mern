import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

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
  Settings,
  ExpandLess,
  ExpandMore,
  Add,
  ListAlt,
  Web,
  PhotoLibrary,
} from "@mui/icons-material";


export default function Sidebar() {

  const location = useLocation();

  // ==========================================
  // MENU OPEN STATES
  // ==========================================

  const [openPosts, setOpenPosts] = useState(
    location.pathname.startsWith("/posts")
  );

  const [openPages, setOpenPages] = useState(
    location.pathname.startsWith("/pages")
  );

  const [openUsers, setOpenUsers] = useState(
    location.pathname.startsWith("/users") ||
    location.pathname === "/profile"
  );

  const [openMedia, setOpenMedia] = useState(
    location.pathname.startsWith("/media")
  );


  // ==========================================
  // ACTIVE MENU STYLE
  // ==========================================

  const activeStyle = {
    bgcolor: "#2563EB",
    color: "#fff",
    borderRadius: 2,
    mx: 1,

    "& .MuiListItemIcon-root": {
      color: "#fff",
    },

    "&:hover": {
      bgcolor: "#1D4ED8",
    },
  };


  // ==========================================
  // NORMAL MENU STYLE
  // ==========================================

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


  // ==========================================
  // SUB MENU STYLE
  // ==========================================

  const subMenuStyle = {
    pl: 5,
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

      {/* ========================================== */}
      {/* LOGO */}
      {/* ========================================== */}

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


          {/* ========================================== */}
          {/* DASHBOARD */}
          {/* ========================================== */}

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

            <ListItemText
              primary="Dashboard"
            />

          </ListItemButton>


          {/* ========================================== */}
          {/* POSTS */}
          {/* ========================================== */}

          <ListItemButton
            sx={menuStyle}
            onClick={() =>
              setOpenPosts(!openPosts)
            }
          >

            <ListItemIcon>
              <Article />
            </ListItemIcon>

            <ListItemText
              primary="Posts"
            />

            {openPosts
              ? <ExpandLess />
              : <ExpandMore />
            }

          </ListItemButton>


          <Collapse
            in={openPosts}
            timeout="auto"
            unmountOnExit
          >

            <List
              component="div"
              disablePadding
            >


              {/* ALL POSTS */}

              <ListItemButton
                component={Link}
                to="/posts"
                sx={
                  location.pathname === "/posts"
                    ? {
                        ...subMenuStyle,
                        ...activeStyle,
                      }
                    : subMenuStyle
                }
              >

                <ListItemIcon>
                  <ListAlt />
                </ListItemIcon>

                <ListItemText
                  primary="All Posts"
                />

              </ListItemButton>


              {/* ADD POST */}

              <ListItemButton
                component={Link}
                to="/posts/add"
                sx={
                  location.pathname === "/posts/add"
                    ? {
                        ...subMenuStyle,
                        ...activeStyle,
                      }
                    : subMenuStyle
                }
              >

                <ListItemIcon>
                  <Add />
                </ListItemIcon>

                <ListItemText
                  primary="Add Post"
                />

              </ListItemButton>


              {/* CATEGORIES */}

              <ListItemButton
                component={Link}
                to="/posts/categories"
                sx={
                  location.pathname ===
                  "/posts/categories"
                    ? {
                        ...subMenuStyle,
                        ...activeStyle,
                      }
                    : subMenuStyle
                }
              >

                <ListItemIcon>
                  <Category />
                </ListItemIcon>

                <ListItemText
                  primary="Categories"
                />

              </ListItemButton>


              {/* TAGS */}

              <ListItemButton
                component={Link}
                to="/posts/tags"
                sx={
                  location.pathname === "/posts/tags"
                    ? {
                        ...subMenuStyle,
                        ...activeStyle,
                      }
                    : subMenuStyle
                }
              >

                <ListItemIcon>
                  <LocalOffer />
                </ListItemIcon>

                <ListItemText
                  primary="Tags"
                />

              </ListItemButton>

            </List>

          </Collapse>


          {/* ========================================== */}
          {/* PAGES */}
          {/* ========================================== */}

          <ListItemButton
            sx={
              location.pathname.startsWith("/pages")
                ? {
                    ...menuStyle,
                    color: "#fff",
                  }
                : menuStyle
            }
            onClick={() =>
              setOpenPages(!openPages)
            }
          >

            <ListItemIcon>
              <Web />
            </ListItemIcon>

            <ListItemText
              primary="Pages"
            />

            {openPages
              ? <ExpandLess />
              : <ExpandMore />
            }

          </ListItemButton>


          <Collapse
            in={openPages}
            timeout="auto"
            unmountOnExit
          >

            <List
              component="div"
              disablePadding
            >


              {/* ALL PAGES */}

              <ListItemButton
                component={Link}
                to="/pages"
                sx={
                  location.pathname === "/pages"
                    ? {
                        ...subMenuStyle,
                        ...activeStyle,
                      }
                    : subMenuStyle
                }
              >

                <ListItemIcon>
                  <ListAlt />
                </ListItemIcon>

                <ListItemText
                  primary="All Pages"
                />

              </ListItemButton>


              {/* ADD PAGE */}

              <ListItemButton
                component={Link}
                to="/pages/add"
                sx={
                  location.pathname === "/pages/add"
                    ? {
                        ...subMenuStyle,
                        ...activeStyle,
                      }
                    : subMenuStyle
                }
              >

                <ListItemIcon>
                  <Add />
                </ListItemIcon>

                <ListItemText
                  primary="Add Page"
                />

              </ListItemButton>

            </List>

          </Collapse>


          {/* ========================================== */}
          {/* MEDIA */}
          {/* ========================================== */}

          <ListItemButton
            sx={menuStyle}
            onClick={() =>
              setOpenMedia(!openMedia)
            }
          >

            <ListItemIcon>
              <PhotoLibrary />
            </ListItemIcon>

            <ListItemText
              primary="Media"
            />

            {openMedia
              ? <ExpandLess />
              : <ExpandMore />
            }

          </ListItemButton>


          <Collapse
            in={openMedia}
            timeout="auto"
            unmountOnExit
          >

            <List
              component="div"
              disablePadding
            >


              {/* MEDIA LIBRARY */}

              <ListItemButton
                component={Link}
                to="/media"
                sx={
                  location.pathname === "/media"
                    ? {
                        ...subMenuStyle,
                        ...activeStyle,
                      }
                    : subMenuStyle
                }
              >

                <ListItemIcon>
                  <PhotoLibrary />
                </ListItemIcon>

                <ListItemText
                  primary="Library"
                />

              </ListItemButton>


              {/* ADD MEDIA */}

              <ListItemButton
                component={Link}
                to="/media/upload"
                sx={
                  location.pathname ===
                  "/media/upload"
                    ? {
                        ...subMenuStyle,
                        ...activeStyle,
                      }
                    : subMenuStyle
                }
              >

                <ListItemIcon>
                  <Add />
                </ListItemIcon>

                <ListItemText
                  primary="Add Media"
                />

              </ListItemButton>

            </List>

          </Collapse>


          {/* ========================================== */}
          {/* USERS */}
          {/* ========================================== */}

          <ListItemButton
            sx={menuStyle}
            onClick={() =>
              setOpenUsers(!openUsers)
            }
          >

            <ListItemIcon>
              <People />
            </ListItemIcon>

            <ListItemText
              primary="Users"
            />

            {openUsers
              ? <ExpandLess />
              : <ExpandMore />
            }

          </ListItemButton>


          <Collapse
            in={openUsers}
            timeout="auto"
            unmountOnExit
          >

            <List
              component="div"
              disablePadding
            >


              {/* ALL USERS */}

              <ListItemButton
                component={Link}
                to="/users"
                sx={
                  location.pathname === "/users"
                    ? {
                        ...subMenuStyle,
                        ...activeStyle,
                      }
                    : subMenuStyle
                }
              >

                <ListItemIcon>
                  <People />
                </ListItemIcon>

                <ListItemText
                  primary="All Users"
                />

              </ListItemButton>


              {/* ADD USER */}

              <ListItemButton
                component={Link}
                to="/users/add"
                sx={
                  location.pathname === "/users/add"
                    ? {
                        ...subMenuStyle,
                        ...activeStyle,
                      }
                    : subMenuStyle
                }
              >

                <ListItemIcon>
                  <PersonAdd />
                </ListItemIcon>

                <ListItemText
                  primary="Add User"
                />

              </ListItemButton>


              {/* PROFILE */}

              <ListItemButton
                component={Link}
                to="/profile"
                sx={
                  location.pathname === "/profile"
                    ? {
                        ...subMenuStyle,
                        ...activeStyle,
                      }
                    : subMenuStyle
                }
              >

                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>

                <ListItemText
                  primary="Profile"
                />

              </ListItemButton>

            </List>

          </Collapse>


          {/* ========================================== */}
          {/* SETTINGS */}
          {/* ========================================== */}

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

            <ListItemText
              primary="Settings"
            />

          </ListItemButton>


        </List>

      </Box>

    </Drawer>

  );
}