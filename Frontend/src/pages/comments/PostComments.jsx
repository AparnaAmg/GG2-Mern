import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../../services/api";

import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
} from "@mui/material";

import {
  ArrowBack,
  AddComment,
  CheckCircle,
  Block,
  Delete,
} from "@mui/icons-material";

export default function PostComments() {
  const navigate = useNavigate();
  const { postId } = useParams();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH
  // =====================================================

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(
        `/comments/post/${postId}`
      );

      console.log(
        "POST COMMENTS:",
        res.data
      );

      setComments(
        res.data?.comments || []
      );
    } catch (err) {
      console.error(
        "FETCH POST COMMENTS ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load post comments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  // =====================================================
  // STATUS
  // =====================================================

  const statusChip = (status) => {
    if (status === "approved") {
      return (
        <Chip
          icon={<CheckCircle />}
          label="Approved"
          color="success"
          size="small"
        />
      );
    }

    if (status === "spam") {
      return (
        <Chip
          icon={<Block />}
          label="Spam"
          color="error"
          size="small"
        />
      );
    }

    if (status === "trash") {
      return (
        <Chip
          label="Trash"
          color="default"
          size="small"
        />
      );
    }

    return (
      <Chip
        label="Pending"
        color="warning"
        size="small"
      />
    );
  };

  // =====================================================
  // UPDATE
  // =====================================================

  const updateStatus = async (
    commentId,
    status
  ) => {
    try {
      await api.put(
        `/comments/${commentId}/status`,
        {
          status,
        }
      );

      await fetchComments();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update comment"
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const deleteComment = async (
    commentId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/comments/${commentId}`
      );

      await fetchComments();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete comment"
      );
    }
  };

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
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Button
            startIcon={<ArrowBack />}
            onClick={() =>
              navigate("/comments")
            }
            sx={{ mb: 1 }}
          >
            Back to Comments
          </Button>

          <Typography
            variant="h4"
            fontWeight={700}
          >
            Post Comments
          </Typography>

          <Typography color="text.secondary">
            Comments for Post #{postId}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddComment />}
          onClick={() =>
            navigate(
              `/comments/add/${postId}`
            )
          }
        >
          Add Comment
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

      {/* CONTENT */}

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            p: 8,
          }}
        >
          <CircularProgress />
        </Box>
      ) : comments.length === 0 ? (
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
            No comments for this post
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddComment />}
            sx={{ mt: 3 }}
            onClick={() =>
              navigate(
                `/comments/add/${postId}`
              )
            }
          >
            Add Comment
          </Button>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {comments.map((comment) => (
            <Paper
              key={comment.id}
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border:
                  "1px solid #e5e7eb",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    fontWeight={700}
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
                </Box>

                {statusChip(
                  comment.comment_status
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography
                sx={{
                  whiteSpace: "pre-wrap",
                }}
              >
                {comment.comment_content}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  mt: 3,
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {comment.created_at
                    ? new Date(
                        comment.created_at
                      ).toLocaleString()
                    : "-"}
                </Typography>

                <Box>
                  {comment.comment_status !==
                    "approved" && (
                    <Button
                      size="small"
                      startIcon={
                        <CheckCircle />
                      }
                      onClick={() =>
                        updateStatus(
                          comment.id,
                          "approved"
                        )
                      }
                    >
                      Approve
                    </Button>
                  )}

                  {comment.comment_status !==
                    "spam" && (
                    <Button
                      size="small"
                      startIcon={<Block />}
                      onClick={() =>
                        updateStatus(
                          comment.id,
                          "spam"
                        )
                      }
                    >
                      Spam
                    </Button>
                  )}

                  <IconButton
                    color="error"
                    onClick={() =>
                      deleteComment(
                        comment.id
                      )
                    }
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}