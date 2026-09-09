import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Checkbox,
  FormControlLabel,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import {
  Add,
  Delete,
  Save,
  DragIndicator,
  Edit,
  Link as LinkIcon,
  Article,
  Description,
  Category,
} from "@mui/icons-material";

export default function Menus() {
  // =====================================================
  // STATE
  // =====================================================

  const [menus, setMenus] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState("");

  const [menu, setMenu] = useState(null);
  const [items, setItems] = useState([]);

  const [pages, setPages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create menu dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [newMenuName, setNewMenuName] = useState("");
  const [newMenuLocation, setNewMenuLocation] =
    useState("primary");

  // Edit menu dialog
  const [editOpen, setEditOpen] = useState(false);

  // Custom link
  const [customLinkOpen, setCustomLinkOpen] =
    useState(false);

  const [customLink, setCustomLink] = useState({
    title: "",
    url: "",
    target: "_self",
  });

  // =====================================================
  // FETCH MENUS
  // =====================================================

  const fetchMenus = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/menus");

      const data = res.data?.menus || [];

      setMenus(data);

      if (data.length > 0) {
        setSelectedMenuId(String(data[0].id));
      }
    } catch (err) {
      console.error("FETCH MENUS ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load menus"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH MENU
  // =====================================================

  const fetchMenu = async (id) => {
    if (!id) {
      setMenu(null);
      setItems([]);
      return;
    }

    try {
      setMenuLoading(true);
      setError("");

      const res = await api.get(`/menus/${id}`);

      setMenu(res.data?.menu || null);
      setItems(res.data?.items || []);
    } catch (err) {
      console.error("FETCH MENU ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load menu"
      );
    } finally {
      setMenuLoading(false);
    }
  };

  // =====================================================
  // FETCH PAGES
  // =====================================================

  const fetchPages = async () => {
    try {
      const res = await api.get("/pages");

      setPages(res.data?.pages || []);
    } catch (err) {
      console.error("FETCH PAGES ERROR:", err);
    }
  };

  // =====================================================
  // FETCH POSTS
  // =====================================================

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");

      setPosts(res.data?.posts || []);
    } catch (err) {
      console.error("FETCH POSTS ERROR:", err);
    }
  };

  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");

      setCategories(
        res.data?.categories || []
      );
    } catch (err) {
      console.error(
        "FETCH CATEGORIES ERROR:",
        err
      );
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchMenus();
    fetchPages();
    fetchPosts();
    fetchCategories();
  }, []);

  // =====================================================
  // LOAD SELECTED MENU
  // =====================================================

  useEffect(() => {
    if (selectedMenuId) {
      fetchMenu(selectedMenuId);
    }
  }, [selectedMenuId]);

  // =====================================================
  // CREATE MENU
  // =====================================================

  const createMenu = async () => {
    if (!newMenuName.trim()) {
      setError("Please enter menu name.");
      return;
    }

    try {
      setError("");

      const res = await api.post("/menus", {
        name: newMenuName.trim(),
        location: newMenuLocation,
      });

      const createdMenu = res.data.menu;

      setSuccess(
        "Menu created successfully."
      );

      setCreateOpen(false);
      setNewMenuName("");
      setNewMenuLocation("primary");

      await fetchMenus();

      if (createdMenu?.id) {
        setSelectedMenuId(
          String(createdMenu.id)
        );
      }
    } catch (err) {
      console.error(
        "CREATE MENU ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to create menu"
      );
    }
  };

  // =====================================================
  // UPDATE MENU
  // =====================================================

  const updateMenu = async () => {
    if (!menu?.name?.trim()) {
      setError("Menu name is required.");
      return;
    }

    try {
      setError("");

      await api.put(`/menus/${menu.id}`, {
        name: menu.name.trim(),
        location: menu.location,
      });

      setSuccess(
        "Menu updated successfully."
      );

      setEditOpen(false);

      await fetchMenus();
      await fetchMenu(menu.id);
    } catch (err) {
      console.error(
        "UPDATE MENU ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update menu"
      );
    }
  };

  // =====================================================
  // DELETE MENU
  // =====================================================

  const deleteMenu = async () => {
    if (!menu) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${menu.name}"?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/menus/${menu.id}`);

      setSuccess(
        "Menu deleted successfully."
      );

      setMenu(null);
      setItems([]);

      await fetchMenus();
    } catch (err) {
      console.error(
        "DELETE MENU ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete menu"
      );
    }
  };

  // =====================================================
  // ADD ITEM
  // =====================================================

  const addItem = ({
    title,
    url,
    objectType,
    objectId,
  }) => {
    if (!menu) {
      setError(
        "Please create or select a menu first."
      );
      return;
    }

    const newItem = {
      id: `temp-${Date.now()}-${Math.random()}`,
      menu_id: menu.id,
      title,
      url,
      object_type: objectType,
      object_id: objectId || null,
      parent_id: null,
      position: items.length,
      target: "_self",
      isNew: true,
    };

    setItems((prev) => [
      ...prev,
      newItem,
    ]);
  };

  // =====================================================
  // ADD CUSTOM LINK
  // =====================================================

  const addCustomLink = () => {
    if (!customLink.title.trim()) {
      setError("Enter link title.");
      return;
    }

    if (!customLink.url.trim()) {
      setError("Enter link URL.");
      return;
    }

    addItem({
      title: customLink.title.trim(),
      url: customLink.url.trim(),
      objectType: "custom",
      objectId: null,
    });

    setCustomLink({
      title: "",
      url: "",
      target: "_self",
    });

    setCustomLinkOpen(false);
  };

  // =====================================================
  // REMOVE ITEM
  // =====================================================

  const removeItem = (index) => {
    setItems((prev) =>
      prev.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  };

  // =====================================================
  // MOVE ITEM UP
  // =====================================================

  const moveItemUp = (index) => {
    if (index === 0) return;

    const updated = [...items];

    [
      updated[index - 1],
      updated[index],
    ] = [
      updated[index],
      updated[index - 1],
    ];

    setItems(updated);
  };

  // =====================================================
  // MOVE ITEM DOWN
  // =====================================================

  const moveItemDown = (index) => {
    if (index === items.length - 1) return;

    const updated = [...items];

    [
      updated[index],
      updated[index + 1],
    ] = [
      updated[index + 1],
      updated[index],
    ];

    setItems(updated);
  };

  // =====================================================
  // CHANGE PARENT
  // =====================================================

  const changeParent = (
    index,
    parentId
  ) => {
    setItems((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              parent_id:
                parentId === ""
                  ? null
                  : Number(parentId),
            }
          : item
      )
    );
  };

  // =====================================================
  // SAVE MENU ITEMS
  // =====================================================

  const saveMenu = async () => {
    if (!menu) {
      setError("Please select a menu.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      /*
       * IMPORTANT:
       *
       * The backend currently only has menu CRUD.
       *
       * Once the menu-items API is added,
       * this section will send the items.
       */

      const formattedItems = items.map(
        (item, index) => ({
          title: item.title,
          url: item.url,
          object_type:
            item.object_type || null,
          object_id:
            item.object_id || null,
          parent_id:
            item.parent_id || null,
          position: index,
          target:
            item.target || "_self",
        })
      );

      console.log(
        "MENU ITEMS TO SAVE:",
        formattedItems
      );

      /*
       * Temporary:
       * backend menu-item API needs to be
       * added before this can be persisted.
       */

      setSuccess(
        "Menu structure prepared successfully."
      );
    } catch (err) {
      console.error(
        "SAVE MENU ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to save menu"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // OBJECT ICON
  // =====================================================

  const itemIcon = (type) => {
    if (type === "page") {
      return <Description fontSize="small" />;
    }

    if (type === "post") {
      return <Article fontSize="small" />;
    }

    if (type === "category") {
      return <Category fontSize="small" />;
    }

    return <LinkIcon fontSize="small" />;
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          p: 5,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // =====================================================
  // UI
  // =====================================================

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
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
          >
            Menus
          </Typography>

          <Typography
            color="text.secondary"
          >
            Manage your website navigation menus
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() =>
            setCreateOpen(true)
          }
        >
          Create New Menu
        </Button>
      </Box>

      {/* ALERTS */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      )}

      {/* MENU SELECTOR */}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: "1px solid #e5e7eb",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <FormControl
            sx={{
              minWidth: 300,
            }}
          >
            <InputLabel>
              Select Menu
            </InputLabel>

            <Select
              value={selectedMenuId}
              label="Select Menu"
              onChange={(e) =>
                setSelectedMenuId(
                  e.target.value
                )
              }
            >
              {menus.map((item) => (
                <MenuItem
                  key={item.id}
                  value={String(item.id)}
                >
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {menu && (
            <>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() =>
                  setEditOpen(true)
                }
              >
                Edit Menu
              </Button>

              <Button
                color="error"
                variant="outlined"
                startIcon={<Delete />}
                onClick={deleteMenu}
              >
                Delete Menu
              </Button>
            </>
          )}
        </Box>
      </Paper>

      {!menu ? (
        <Paper
          elevation={0}
          sx={{
            p: 8,
            textAlign: "center",
            borderRadius: 3,
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography
            variant="h6"
            color="text.secondary"
          >
            No menu selected
          </Typography>

          <Button
            variant="contained"
            sx={{ mt: 3 }}
            startIcon={<Add />}
            onClick={() =>
              setCreateOpen(true)
            }
          >
            Create Your First Menu
          </Button>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "350px 1fr",
            },
            gap: 3,
          }}
        >
          {/* ADD ITEMS */}

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e5e7eb",
              height: "fit-content",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 3 }}
            >
              Add Menu Items
            </Typography>

            {/* PAGES */}

            <Typography
              fontWeight={600}
              sx={{ mb: 1 }}
            >
              Pages
            </Typography>

            <Box
              sx={{
                maxHeight: 200,
                overflowY: "auto",
                mb: 3,
              }}
            >
              {pages.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  No pages found
                </Typography>
              ) : (
                pages.map((page) => (
                  <FormControlLabel
                    key={page.id}
                    control={
                      <Checkbox
                        onChange={(e) => {
                          if (
                            e.target.checked
                          ) {
                            addItem({
                              title:
                                page.post_title ||
                                page.page_title ||
                                page.title,
                              url:
                                `/pages/view/${page.id}`,
                              objectType:
                                "page",
                              objectId:
                                page.id,
                            });
                          }
                        }}
                      />
                    }
                    label={
                      page.post_title ||
                      page.page_title ||
                      page.title ||
                      `Page #${page.id}`
                    }
                  />
                ))
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* POSTS */}

            <Typography
              fontWeight={600}
              sx={{ mb: 1 }}
            >
              Posts
            </Typography>

            <Box
              sx={{
                maxHeight: 200,
                overflowY: "auto",
                mb: 3,
              }}
            >
              {posts.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  No posts found
                </Typography>
              ) : (
                posts.map((post) => (
                  <FormControlLabel
                    key={post.id}
                    control={
                      <Checkbox
                        onChange={(e) => {
                          if (
                            e.target.checked
                          ) {
                            addItem({
                              title:
                                post.post_title,
                              url:
                                `/posts/${post.id}`,
                              objectType:
                                "post",
                              objectId:
                                post.id,
                            });
                          }
                        }}
                      />
                    }
                    label={
                      post.post_title ||
                      `Post #${post.id}`
                    }
                  />
                ))
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* CATEGORIES */}

            <Typography
              fontWeight={600}
              sx={{ mb: 1 }}
            >
              Categories
            </Typography>

            <Box
              sx={{
                maxHeight: 200,
                overflowY: "auto",
                mb: 3,
              }}
            >
              {categories.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  No categories found
                </Typography>
              ) : (
                categories.map(
                  (category) => (
                    <FormControlLabel
                      key={category.id}
                      control={
                        <Checkbox
                          onChange={(e) => {
                            if (
                              e.target.checked
                            ) {
                              addItem({
                                title:
                                  category.name ||
                                  category.category_name,
                                url:
                                  `/category/${category.slug}`,
                                objectType:
                                  "category",
                                objectId:
                                  category.id,
                              });
                            }
                          }}
                        />
                      }
                      label={
                        category.name ||
                        category.category_name ||
                        `Category #${category.id}`
                      }
                    />
                  )
                )
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* CUSTOM LINK */}

            <Button
              fullWidth
              variant="outlined"
              startIcon={<LinkIcon />}
              onClick={() =>
                setCustomLinkOpen(true)
              }
            >
              Add Custom Link
            </Button>
          </Paper>

          {/* MENU STRUCTURE */}

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e5e7eb",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Menu Structure
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {menu.name}
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={saveMenu}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Menu"}
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {menuLoading ? (
              <Box
                sx={{
                  p: 6,
                  display: "flex",
                  justifyContent:
                    "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : items.length === 0 ? (
              <Box
                sx={{
                  p: 6,
                  textAlign: "center",
                  border:
                    "2px dashed #d1d5db",
                  borderRadius: 2,
                }}
              >
                <Typography
                  color="text.secondary"
                >
                  No menu items yet.
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Select pages, posts,
                  categories or custom links
                  from the left.
                </Typography>
              </Box>
            ) : (
              <Box>
                {items.map(
                  (item, index) => (
                    <Paper
                      key={item.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        mb: 1.5,
                        ml:
                          item.parent_id
                            ? 4
                            : 0,
                        backgroundColor:
                          item.parent_id
                            ? "#fafafa"
                            : "#fff",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: 1,
                        }}
                      >
                        <DragIndicator
                          color="disabled"
                        />

                        <Box
                          sx={{
                            flex: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: 1,
                            }}
                          >
                            {itemIcon(
                              item.object_type
                            )}

                            <Typography
                              fontWeight={
                                600
                              }
                            >
                              {item.title}
                            </Typography>

                            {item.isNew && (
                              <Chip
                                label="New"
                                size="small"
                                color="primary"
                              />
                            )}
                          </Box>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {item.url}
                          </Typography>
                        </Box>

                        <Button
                          size="small"
                          onClick={() =>
                            moveItemUp(
                              index
                            )
                          }
                          disabled={
                            index === 0
                          }
                        >
                          ↑
                        </Button>

                        <Button
                          size="small"
                          onClick={() =>
                            moveItemDown(
                              index
                            )
                          }
                          disabled={
                            index ===
                            items.length - 1
                          }
                        >
                          ↓
                        </Button>

                        <IconButton
                          color="error"
                          onClick={() =>
                            removeItem(
                              index
                            )
                          }
                        >
                          <Delete />
                        </IconButton>
                      </Box>

                      {/* PARENT */}

                      <Box
                        sx={{
                          mt: 2,
                          ml: 4,
                        }}
                      >
                        <FormControl
                          size="small"
                          sx={{
                            minWidth: 220,
                          }}
                        >
                          <InputLabel>
                            Parent Item
                          </InputLabel>

                          <Select
                            value={
                              item.parent_id ||
                              ""
                            }
                            label="Parent Item"
                            onChange={(e) =>
                              changeParent(
                                index,
                                e.target.value
                              )
                            }
                          >
                            <MenuItem value="">
                              No Parent
                            </MenuItem>

                            {items
                              .filter(
                                (
                                  parent
                                ) =>
                                  parent.id !==
                                  item.id
                              )
                              .map(
                                (
                                  parent
                                ) => (
                                  <MenuItem
                                    key={
                                      parent.id
                                    }
                                    value={
                                      parent.id
                                    }
                                  >
                                    {
                                      parent.title
                                    }
                                  </MenuItem>
                                )
                              )}
                          </Select>
                        </FormControl>
                      </Box>
                    </Paper>
                  )
                )}
              </Box>
            )}
          </Paper>
        </Box>
      )}

      {/* =================================================
          CREATE MENU DIALOG
      ================================================= */}

      <Dialog
        open={createOpen}
        onClose={() =>
          setCreateOpen(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Create New Menu
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Menu Name"
            value={newMenuName}
            onChange={(e) =>
              setNewMenuName(
                e.target.value
              )
            }
            sx={{ mt: 1, mb: 3 }}
          />

          <FormControl fullWidth>
            <InputLabel>
              Menu Location
            </InputLabel>

            <Select
              value={newMenuLocation}
              label="Menu Location"
              onChange={(e) =>
                setNewMenuLocation(
                  e.target.value
                )
              }
            >
              <MenuItem value="primary">
                Primary Navigation
              </MenuItem>

              <MenuItem value="header">
                Header Menu
              </MenuItem>

              <MenuItem value="footer">
                Footer Menu
              </MenuItem>

              <MenuItem value="mobile">
                Mobile Menu
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setCreateOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={createMenu}
          >
            Create Menu
          </Button>
        </DialogActions>
      </Dialog>

      {/* =================================================
          EDIT MENU DIALOG
      ================================================= */}

      <Dialog
        open={editOpen}
        onClose={() =>
          setEditOpen(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Edit Menu
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Menu Name"
            value={menu?.name || ""}
            onChange={(e) =>
              setMenu((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            sx={{ mt: 1, mb: 3 }}
          />

          <FormControl fullWidth>
            <InputLabel>
              Menu Location
            </InputLabel>

            <Select
              value={
                menu?.location || "primary"
              }
              label="Menu Location"
              onChange={(e) =>
                setMenu((prev) => ({
                  ...prev,
                  location:
                    e.target.value,
                }))
              }
            >
              <MenuItem value="primary">
                Primary Navigation
              </MenuItem>

              <MenuItem value="header">
                Header Menu
              </MenuItem>

              <MenuItem value="footer">
                Footer Menu
              </MenuItem>

              <MenuItem value="mobile">
                Mobile Menu
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setEditOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={updateMenu}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* =================================================
          CUSTOM LINK DIALOG
      ================================================= */}

      <Dialog
        open={customLinkOpen}
        onClose={() =>
          setCustomLinkOpen(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Add Custom Link
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Link Text"
            value={customLink.title}
            onChange={(e) =>
              setCustomLink((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            sx={{ mt: 1, mb: 3 }}
          />

          <TextField
            fullWidth
            label="URL"
            placeholder="https://example.com"
            value={customLink.url}
            onChange={(e) =>
              setCustomLink((prev) => ({
                ...prev,
                url: e.target.value,
              }))
            }
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setCustomLinkOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={addCustomLink}
          >
            Add Link
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}