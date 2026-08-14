import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import CommentIcon from "@mui/icons-material/Comment";

import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import {
  Search,
  MoreVert,
  CheckCircle,
  Delete,
  Visibility,
  Block,
  AddComment,
} from "@mui/icons-material";

export default function AllComments() {
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);

  // =====================================================
  // FETCH COMMENTS
  // =====================================================

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/comments");

      console.log("COMMENTS:", res.data);

      const data = res.data?.comments || [];

      setComments(data);
      setFilteredComments(data);
    } catch (err) {
      console.error("FETCH COMMENTS ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load comments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // =====================================================
  // FILTER
  // =====================================================

  useEffect(() => {
    let result = [...comments];

    if (statusFilter !== "all") {
      result = result.filter(
        (comment) =>
          comment.comment_status === statusFilter
      );
    }

    if (search.trim()) {
      const value = search.toLowerCase();

      result = result.filter((comment) => {
        const fields = [
          comment.author_name,
          comment.author_email,
          comment.comment_content,
          comment.post_title,
          comment.post_id,
        ];

        return fields
          .filter(Boolean)
          .some((field) =>
            String(field)
              .toLowerCase()
              .includes(value)
          );
      });
    }

    setFilteredComments(result);
  }, [search, statusFilter, comments]);

  // =====================================================
  // MENU
  // =====================================================

  const handleMenuOpen = (event, comment) => {
    setAnchorEl(event.currentTarget);
    setSelectedComment(comment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // =====================================================
  // VIEW
  // =====================================================

  const handleView = () => {
    setViewOpen(true);
    handleMenuClose();
  };

  // =====================================================
  // OPEN POST COMMENTS
  // =====================================================

  const openPostComments = (postId) => {
    if (!postId) return;

    navigate(`/comments/post/${postId}`);
  };

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const updateStatus = async (status) => {
    if (!selectedComment) return;

    try {
      await api.put(
        `/comments/${selectedComment.id}/status`,
        {
          status,
        }
      );

      handleMenuClose();

      setSelectedComment((prev) =>
        prev
          ? {
              ...prev,
              comment_status: status,
            }
          : prev
      );

      await fetchComments();
    } catch (err) {
      console.error(
        "UPDATE COMMENT STATUS ERROR:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to update comment"
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const deleteComment = async () => {
    if (!selectedComment) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/comments/${selectedComment.id}`
      );

      handleMenuClose();
      setViewOpen(false);
      setSelectedComment(null);

      await fetchComments();
    } catch (err) {
      console.error(
        "DELETE COMMENT ERROR:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to delete comment"
      );
    }
  };

  // =====================================================
  // STATUS CHIP
  // =====================================================

  const statusChip = (status) => {
    switch (status) {
      case "approved":
        return (
          <Chip
            icon={<CheckCircle />}
            label="Approved"
            size="small"
            color="success"
          />
        );

      case "spam":
        return (
          <Chip
            icon={<Block />}
            label="Spam"
            size="small"
            color="error"
          />
        );

      case "trash":
        return (
          <Chip
            label="Trash"
            size="small"
            color="default"
          />
        );

      default:
        return (
          <Chip
            label="Pending"
            size="small"
            color="warning"
          />
        );
    }
  };

  // =====================================================
  // DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString();
  };

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
            Comments
          </Typography>

          <Typography color="text.secondary">
            Manage comments submitted on GG2 posts
          </Typography>
        </Box>

        <Box
  sx={{
    display: "flex",
    gap: 2,
    alignItems: "center",
    flexWrap: "wrap",
  }}
>
          <Chip
            label={`${comments.length} Comments`}
            color="primary"
          />

          {/* IMPORTANT:
              No postId here.
          */}

          <Button
    variant="outlined"
    startIcon={<CommentIcon />}
    onClick={() => navigate("/posts")}
  >
    View Post Comments
  </Button>
   <Button
    variant="contained"
    startIcon={<AddComment />}
    onClick={() => navigate("/comments/add")}
  >
    Add Comment
  </Button>
        </Box>
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

      {/* FILTERS */}

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
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <TextField
            placeholder="Search comments..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            sx={{
              minWidth: 300,
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            variant={
              statusFilter === "all"
                ? "contained"
                : "outlined"
            }
            onClick={() =>
              setStatusFilter("all")
            }
          >
            ALL
          </Button>

          <Button
            variant={
              statusFilter === "pending"
                ? "contained"
                : "outlined"
            }
            onClick={() =>
              setStatusFilter("pending")
            }
          >
            PENDING
          </Button>

          <Button
            variant={
              statusFilter === "approved"
                ? "contained"
                : "outlined"
            }
            onClick={() =>
              setStatusFilter("approved")
            }
          >
            APPROVED
          </Button>

          <Button
            variant={
              statusFilter === "spam"
                ? "contained"
                : "outlined"
            }
            onClick={() =>
              setStatusFilter("spam")
            }
          >
            SPAM
          </Button>

          <Button
            variant={
              statusFilter === "trash"
                ? "contained"
                : "outlined"
            }
            onClick={() =>
              setStatusFilter("trash")
            }
          >
            TRASH
          </Button>
        </Box>
      </Paper>

      {/* TABLE */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Box
            sx={{
              p: 8,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : filteredComments.length === 0 ? (
          <Box
            sx={{
              p: 8,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
            >
              No comments found
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Comments submitted by visitors
              will appear here.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: "#f8fafc",
                  }}
                >
                  <TableCell>
                    <b>Author</b>
                  </TableCell>

                  <TableCell>
                    <b>Comment</b>
                  </TableCell>

                  <TableCell>
                    <b>Post</b>
                  </TableCell>

                  <TableCell>
                    <b>Status</b>
                  </TableCell>

                  <TableCell>
                    <b>Date</b>
                  </TableCell>

                  <TableCell align="right">
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredComments.map(
                  (comment) => (
                    <TableRow
                      key={comment.id}
                      hover
                    >
                      <TableCell>
                        <Typography
                          fontWeight={600}
                        >
                          {comment.author_name ||
                            "-"}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {comment.author_email ||
                            "-"}
                        </Typography>
                      </TableCell>

                      <TableCell
                        sx={{
                          maxWidth: 350,
                        }}
                      >
                        <Typography
                          sx={{
                            display:
                              "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient:
                              "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {comment.comment_content ||
                            "-"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Button
                          size="small"
                          variant="text"
                          onClick={() =>
                            openPostComments(
                              comment.post_id
                            )
                          }
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            justifyContent:
                              "flex-start",
                            textAlign: "left",
                          }}
                        >
                          {comment.post_title ||
                            `Post #${comment.post_id}`}
                        </Button>
                      </TableCell>

                      <TableCell>
                        {statusChip(
                          comment.comment_status
                        )}
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(
                            comment.created_at
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Tooltip title="Actions">
                          <IconButton
                            onClick={(event) =>
                              handleMenuOpen(
                                event,
                                comment
                              )
                            }
                          >
                            <MoreVert />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* ACTION MENU */}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <Visibility
            sx={{ mr: 1 }}
            fontSize="small"
          />
          View
        </MenuItem>

        {selectedComment?.comment_status !==
          "approved" && (
          <MenuItem
            onClick={() =>
              updateStatus("approved")
            }
          >
            <CheckCircle
              sx={{ mr: 1 }}
              fontSize="small"
            />
            Approve
          </MenuItem>
        )}

        {selectedComment?.comment_status !==
          "spam" && (
          <MenuItem
            onClick={() =>
              updateStatus("spam")
            }
          >
            <Block
              sx={{ mr: 1 }}
              fontSize="small"
            />
            Mark as Spam
          </MenuItem>
        )}

        {selectedComment?.comment_status !==
          "pending" && (
          <MenuItem
            onClick={() =>
              updateStatus("pending")
            }
          >
            <Visibility
              sx={{ mr: 1 }}
              fontSize="small"
            />
            Mark as Pending
          </MenuItem>
        )}

        <MenuItem
          onClick={deleteComment}
          sx={{
            color: "error.main",
          }}
        >
          <Delete
            sx={{ mr: 1 }}
            fontSize="small"
          />
          Delete
        </MenuItem>
      </Menu>

      {/* VIEW DIALOG */}

      <Dialog
        open={viewOpen}
        onClose={() =>
          setViewOpen(false)
        }
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Comment Details
        </DialogTitle>

        <DialogContent dividers>
          {selectedComment && (
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Author
              </Typography>

              <Typography
                fontWeight={600}
                sx={{ mb: 2 }}
              >
                {selectedComment.author_name ||
                  "-"}
              </Typography>

              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Email
              </Typography>

              <Typography sx={{ mb: 2 }}>
                {selectedComment.author_email ||
                  "-"}
              </Typography>

              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Post
              </Typography>

              <Button
                sx={{
                  p: 0,
                  mb: 2,
                  textTransform: "none",
                }}
                onClick={() => {
                  setViewOpen(false);

                  navigate(
                    `/comments/post/${selectedComment.post_id}`
                  );
                }}
              >
                {selectedComment.post_title ||
                  `Post #${selectedComment.post_id}`}
              </Button>

              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Comment
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mt: 1,
                  mb: 2,
                }}
              >
                <Typography>
                  {
                    selectedComment.comment_content
                  }
                </Typography>
              </Paper>

              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Status
              </Typography>

              <Box sx={{ mt: 1 }}>
                {statusChip(
                  selectedComment.comment_status
                )}
              </Box>

              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Date
              </Typography>

              <Typography>
                {formatDate(
                  selectedComment.created_at
                )}
              </Typography>
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

          {selectedComment?.comment_status !==
            "approved" && (
            <Button
              variant="contained"
              startIcon={<CheckCircle />}
              onClick={async () => {
                await updateStatus("approved");
                setViewOpen(false);
              }}
            >
              Approve
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}