import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  MenuItem,
} from "@mui/material";

import {
  ArrowBack,
  Save,
} from "@mui/icons-material";

export default function AddComment() {
  const navigate = useNavigate();
  const { postId: routePostId } = useParams();

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const [form, setForm] = useState({
    post_id: routePostId || "",
    author_name: "",
    author_email: "",
    comment_content: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // LOAD POSTS
  // =====================================================

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setPostsLoading(true);

      const res = await api.get("/posts");

      console.log("POSTS:", res.data);

      /*
       * Depending on your post API response,
       * posts may be directly in res.data.posts
       */
      const data = res.data?.posts || [];

      setPosts(data);
    } catch (err) {
      console.error("FETCH POSTS ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load posts"
      );
    } finally {
      setPostsLoading(false);
    }
  };

  // =====================================================
  // SET POST ID FROM URL
  // =====================================================

  useEffect(() => {
    if (routePostId) {
      setForm((prev) => ({
        ...prev,
        post_id: routePostId,
      }));
    }
  }, [routePostId]);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.post_id) {
      setError("Please select a post.");
      return;
    }

    if (!form.author_name.trim()) {
      setError("Please enter author name.");
      return;
    }

    if (!form.comment_content.trim()) {
      setError("Please enter comment.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        post_id: Number(form.post_id),
        author_name: form.author_name.trim(),
        author_email:
          form.author_email.trim() || null,
        comment_content:
          form.comment_content.trim(),
      };

      console.log(
        "ADDING COMMENT:",
        payload
      );

      const res = await api.post(
        "/comments",
        payload
      );

      console.log(
        "ADD COMMENT RESPONSE:",
        res.data
      );

      setSuccess(
        "Comment added successfully."
      );

      setTimeout(() => {
        navigate("/comments");
      }, 800);

    } catch (err) {
      console.error(
        "ADD COMMENT ERROR:",
        err
      );

      console.log(
        "STATUS:",
        err.response?.status
      );

      console.log(
        "RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          "Failed to add comment"
      );

    } finally {
      setLoading(false);
    }
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
          alignItems: "center",
          gap: 2,
          mb: 4,
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() =>
            navigate("/comments")
          }
        >
          Back
        </Button>

        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
          >
            Add Comment
          </Typography>

          <Typography color="text.secondary">
            Add a new comment to a GG2 post
          </Typography>
        </Box>
      </Box>

      {/* ALERT */}

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

      {/* FORM */}

      <Paper
        elevation={0}
        sx={{
          maxWidth: 900,
          p: 4,
          borderRadius: 3,
          border: "1px solid #e5e7eb",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
        >

          {/* POST */}

          <TextField
            fullWidth
            required
            select
            label="Post"
            name="post_id"
            value={form.post_id}
            onChange={handleChange}
            disabled={
              postsLoading ||
              Boolean(routePostId)
            }
            sx={{ mb: 3 }}
          >
            {postsLoading ? (
              <MenuItem disabled>
                Loading posts...
              </MenuItem>
            ) : posts.length === 0 ? (
              <MenuItem disabled>
                No posts found
              </MenuItem>
            ) : (
              posts.map((post) => (
                <MenuItem
                  key={post.id}
                  value={post.id}
                >
                  #{post.id} -{" "}
                  {post.post_title ||
                    post.title ||
                    "Untitled Post"}
                </MenuItem>
              ))
            )}
          </TextField>

          {/* AUTHOR */}

          <TextField
            fullWidth
            required
            label="Author Name"
            name="author_name"
            value={form.author_name}
            onChange={handleChange}
            placeholder="Enter author name"
            sx={{ mb: 3 }}
          />

          {/* EMAIL */}

          <TextField
            fullWidth
            type="email"
            label="Author Email"
            name="author_email"
            value={form.author_email}
            onChange={handleChange}
            placeholder="Enter author email"
            sx={{ mb: 3 }}
          />

          {/* COMMENT */}

          <TextField
            fullWidth
            required
            multiline
            minRows={6}
            label="Comment"
            name="comment_content"
            value={form.comment_content}
            onChange={handleChange}
            placeholder="Enter comment"
            sx={{ mb: 4 }}
          />

          {/* BUTTONS */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={() =>
                navigate("/comments")
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              startIcon={
                loading ? (
                  <CircularProgress
                    size={18}
                    color="inherit"
                  />
                ) : (
                  <Save />
                )
              }
              disabled={
                loading ||
                postsLoading ||
                posts.length === 0
              }
            >
              {loading
                ? "Saving..."
                : "Add Comment"}
            </Button>
          </Box>

        </Box>
      </Paper>
    </Box>
  );
}