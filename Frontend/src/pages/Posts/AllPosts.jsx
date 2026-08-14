import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";

import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  TableContainer,
  Button,
  Checkbox,
  Box,
  TextField,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Card,
  CardContent,
  Grid,
  Stack,
  IconButton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ArticleIcon from "@mui/icons-material/Article";
import CommentIcon from "@mui/icons-material/Comment";

export default function AllPosts() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  // =====================================================
  // FETCH POSTS
  // =====================================================

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");

      console.log("POSTS:", res.data);

      setPosts(res.data?.posts || []);
    } catch (error) {
      console.error("FETCH POSTS ERROR:", error);
    }
  };

  // =====================================================
  // DELETE POST
  // =====================================================

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await api.delete(`/posts/${id}`);

      fetchPosts();
    } catch (error) {
      console.error("DELETE POST ERROR:", error);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredPosts = posts.filter((post) =>
    (post.post_title || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // =====================================================
  // UI
  // =====================================================

  return (
    <Box>

      {/* =================================================
          HEADER
      ================================================= */}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography
          variant="h4"
          fontWeight={700}
        >
          Posts
        </Typography>

        <Button
          component={Link}
          to="/posts/add"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 3,
            textTransform: "none",
          }}
        >
          Add New Post
        </Button>
      </Box>

      {/* =================================================
          STATS
      ================================================= */}

      <Grid container spacing={3} mb={4}>

  <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>

              <Stack
                direction="row"
                spacing={2}
              >

                <Avatar
                  sx={{
                    bgcolor: "#1976d2",
                  }}
                >
                  <ArticleIcon />
                </Avatar>

                <Box>

                  <Typography
                    color="text.secondary"
                  >
                    Total Posts
                  </Typography>

                  <Typography
                    variant="h5"
                  >
                    {posts.length}
                  </Typography>

                </Box>

              </Stack>

            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* =================================================
          SEARCH
      ================================================= */}

      <Paper
        sx={{
          p: 3,
          mb: 3,
        }}
      >

        <Box
          display="flex"
          gap={2}
        >

          <Select
            defaultValue=""
            sx={{
              width: 180,
            }}
          >

            <MenuItem value="">
              Bulk Actions
            </MenuItem>

            <MenuItem value="delete">
              Delete
            </MenuItem>

          </Select>

          <TextField
            fullWidth
            placeholder="Search posts..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            InputProps={{
              startAdornment: (
                <SearchIcon />
              ),
            }}
          />

        </Box>

      </Paper>

      {/* =================================================
          TABLE
      ================================================= */}

      <Paper>

        <TableContainer>

          <Table>

            <TableHead
              sx={{
                bgcolor: "#f5f5f5",
              }}
            >

              <TableRow>

                <TableCell>
                  <Checkbox />
                </TableCell>

                <TableCell>
                  Post
                </TableCell>

                <TableCell>
                  Author
                </TableCell>

                <TableCell>
                  Status
                </TableCell>

                <TableCell>
                  Date
                </TableCell>

                <TableCell align="center">
                  Actions
                </TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {filteredPosts.map(
                (post) => (

                  <TableRow
                    hover
                    key={post.id}
                  >

                    {/* CHECKBOX */}

                    <TableCell>
                      <Checkbox />
                    </TableCell>

                    {/* POST */}

                    <TableCell>

                      <Box
                        display="flex"
                        gap={2}
                      >

                        <Avatar
                          variant="rounded"
                          src={
                            post.guid
                              ? `http://localhost:5000/uploads/images/${post.guid}`
                              : "/no-image.png"
                          }
                          sx={{
                            width: 70,
                            height: 50,
                            borderRadius: 2,
                          }}
                        />

                        <Box>

                          <Typography
                            fontWeight={600}
                          >
                            {post.post_title}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {post.post_name}
                          </Typography>

                        </Box>

                      </Box>

                    </TableCell>

                    {/* AUTHOR */}

                    <TableCell>

                      <Box
                        display="flex"
                        gap={1}
                      >

                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                          }}
                        >
                          {post.author?.charAt(0)}
                        </Avatar>

                        <Typography>
                          {post.author}
                        </Typography>

                      </Box>

                    </TableCell>

                    {/* STATUS */}

                    <TableCell>

                      <Chip
                        label={post.post_status}
                        color={
                          post.post_status ===
                          "published"
                            ? "success"
                            : "warning"
                        }
                        size="small"
                      />

                    </TableCell>

                    {/* DATE */}

                    <TableCell>

                      {post.post_date
                        ? new Date(
                            post.post_date
                          ).toLocaleDateString()
                        : "-"}

                    </TableCell>

                    {/* ACTIONS */}

                    <TableCell align="center">

                      {/* EDIT */}

                      <IconButton
                        color="primary"
                        component={Link}
                        to={`/posts/edit/${post.id}`}
                        title="Edit Post"
                      >
                        <EditIcon />
                      </IconButton>

                      {/* COMMENTS */}

                      <IconButton
                        color="secondary"
                        onClick={() =>
                          navigate(
                            `/comments/post/${post.id}`
                          )
                        }
                        title="View Comments"
                      >
                        <CommentIcon />
                      </IconButton>

                      {/* DELETE */}

                      <IconButton
                        color="error"
                        onClick={() =>
                          deletePost(post.id)
                        }
                        title="Delete Post"
                      >
                        <DeleteIcon />
                      </IconButton>

                    </TableCell>

                  </TableRow>

                )
              )}

            </TableBody>

          </Table>

        </TableContainer>

      </Paper>

    </Box>
  );
}