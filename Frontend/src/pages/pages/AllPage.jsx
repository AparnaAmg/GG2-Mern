import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import {
  Add,
  Edit,
  Delete,
  MoreVert,
  Search,
  Visibility,
  Article,
} from "@mui/icons-material";

export default function AllPage() {
  const navigate = useNavigate();

  const [pages, setPages] = useState([]);
  const [filteredPages, setFilteredPages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);

  const [deleteDialog, setDeleteDialog] = useState(false);

  // ------------------------------------
  // GET ALL PAGES
  // ------------------------------------

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/pages");

      console.log("Pages response:", res.data);

      setPages(res.data.pages || []);
      setFilteredPages(res.data.pages || []);
    } catch (err) {
      console.error("FETCH PAGES ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load pages"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // ------------------------------------
  // SEARCH
  // ------------------------------------

  useEffect(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      setFilteredPages(pages);
      return;
    }

    const result = pages.filter((item) =>
      (
        item.post_title ||
        item.title ||
        ""
      )
        .toLowerCase()
        .includes(value)
    );

    setFilteredPages(result);
    setPage(0);
  }, [search, pages]);

  // ------------------------------------
  // MENU
  // ------------------------------------

  const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedPage(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // ------------------------------------
  // EDIT
  // ------------------------------------

  const handleEdit = () => {
    if (!selectedPage) return;

    handleMenuClose();

    navigate(`/pages/edit/${selectedPage.id}`);
  };

  // ------------------------------------
  // DELETE
  // ------------------------------------

  const openDeleteDialog = () => {
    handleMenuClose();
    setDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialog(false);
    setSelectedPage(null);
  };

  const handleDelete = async () => {
    if (!selectedPage) return;

    try {
      await api.delete(`/pages/${selectedPage.id}`);

      setPages((prev) =>
        prev.filter(
          (item) => item.id !== selectedPage.id
        )
      );

      setDeleteDialog(false);
      setSelectedPage(null);
    } catch (err) {
      console.error("DELETE PAGE ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete page"
      );

      setDeleteDialog(false);
    }
  };

  // ------------------------------------
  // STATUS
  // ------------------------------------

  const getStatusChip = (status) => {
    const currentStatus =
      status || "draft";

    if (currentStatus === "published") {
      return (
        <Chip
          label="Published"
          size="small"
          color="success"
        />
      );
    }

    if (currentStatus === "draft") {
      return (
        <Chip
          label="Draft"
          size="small"
          color="warning"
        />
      );
    }

    return (
      <Chip
        label={currentStatus}
        size="small"
      />
    );
  };

  // ------------------------------------
  // DATE
  // ------------------------------------

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "-";
    }
  };

  // ------------------------------------
  // PAGINATION
  // ------------------------------------

  const paginatedPages = filteredPages.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // ------------------------------------
  // UI
  // ------------------------------------

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
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
          >
            All Pages
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Manage pages for GG2 CMS
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/pages/add"
          variant="contained"
          startIcon={<Add />}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            py: 1.2,
            fontWeight: 600,
          }}
        >
          Add New Page
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

      {/* MAIN CARD */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        {/* TOOLBAR */}

        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={600}
            >
              Pages
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {filteredPages.length} page
              {filteredPages.length !== 1
                ? "s"
                : ""}
            </Typography>
          </Box>

          <TextField
            size="small"
            placeholder="Search pages..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            InputProps={{
              startAdornment: (
                <Search
                  sx={{
                    mr: 1,
                    color: "text.secondary",
                  }}
                />
              ),
            }}
            sx={{
              width: {
                xs: "100%",
                sm: 300,
              },
            }}
          />
        </Box>

        {/* TABLE */}

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 10,
            }}
          >
            <CircularProgress />
          </Box>
        ) : filteredPages.length === 0 ? (
          <Box
            sx={{
              py: 10,
              textAlign: "center",
            }}
          >
            <Article
              sx={{
                fontSize: 60,
                color: "#cbd5e1",
                mb: 2,
              }}
            />

            <Typography
              variant="h6"
              fontWeight={600}
            >
              No pages found
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1, mb: 3 }}
            >
              Create your first page to get
              started.
            </Typography>

            <Button
              component={Link}
              to="/pages/add"
              variant="contained"
              startIcon={<Add />}
              sx={{
                textTransform: "none",
              }}
            >
              Add New Page
            </Button>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: "#f8fafc",
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight={600}>
                        Title
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography fontWeight={600}>
                        Slug
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography fontWeight={600}>
                        Status
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography fontWeight={600}>
                        Date
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Typography fontWeight={600}>
                        Actions
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedPages.map(
                    (item) => (
                      <TableRow
                        key={item.id}
                        hover
                      >
                        {/* TITLE */}

                        <TableCell>
                          <Typography
                            fontWeight={600}
                          >
                            {item.post_title ||
                              item.title ||
                              "Untitled Page"}
                          </Typography>

                          {item.post_excerpt && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt: 0.5,
                                maxWidth: 400,
                                overflow: "hidden",
                                textOverflow:
                                  "ellipsis",
                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {item.post_excerpt}
                            </Typography>
                          )}
                        </TableCell>

                        {/* SLUG */}

                        <TableCell>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            /{item.post_name ||
                              item.slug ||
                              ""}
                          </Typography>
                        </TableCell>

                        {/* STATUS */}

                        <TableCell>
                          {getStatusChip(
                            item.post_status ||
                              item.status
                          )}
                        </TableCell>

                        {/* DATE */}

                        <TableCell>
                          <Typography
                            variant="body2"
                          >
                            {formatDate(
                              item.created_at ||
                                item.post_date
                            )}
                          </Typography>
                        </TableCell>

                        {/* ACTIONS */}

                        <TableCell align="right">
                          <IconButton
                            onClick={(event) =>
                              handleMenuOpen(
                                event,
                                item
                              )
                            }
                          >
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* PAGINATION */}

            <TablePagination
              component="div"
              count={filteredPages.length}
              page={page}
              onPageChange={(
                event,
                newPage
              ) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(
                  parseInt(
                    event.target.value,
                    10
                  )
                );
                setPage(0);
              }}
              rowsPerPageOptions={[
                5,
                10,
                25,
                50,
              ]}
            />
          </>
        )}
      </Paper>

      {/* ACTION MENU */}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit
            fontSize="small"
            sx={{ mr: 1 }}
          />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleMenuClose();

            if (selectedPage) {
              window.open(
                `/pages/view/${selectedPage.id}`,
                "_blank"
              );
            }
          }}
        >
          <Visibility
            fontSize="small"
            sx={{ mr: 1 }}
          />
          View
        </MenuItem>

        <MenuItem
          onClick={openDeleteDialog}
          sx={{
            color: "error.main",
          }}
        >
          <Delete
            fontSize="small"
            sx={{ mr: 1 }}
          />
          Delete
        </MenuItem>
      </Menu>

      {/* DELETE CONFIRMATION */}

      <Dialog
        open={deleteDialog}
        onClose={closeDeleteDialog}
      >
        <DialogTitle>
          Delete Page?
        </DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>
              {selectedPage?.post_title ||
                selectedPage?.title ||
                "this page"}
            </strong>
            ?
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={closeDeleteDialog}
            sx={{
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            startIcon={<Delete />}
            sx={{
              textTransform: "none",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}