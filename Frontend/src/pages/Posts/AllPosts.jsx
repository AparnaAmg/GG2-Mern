import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

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

export default function AllPosts() {

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await api.get("/posts");
    setPosts(res.data.posts);
  };

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;

    await api.delete(`/posts/${id}`);
    fetchPosts();
  };

  const filteredPosts = posts.filter((post) =>
    post.post_title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>

      {/* Header */}

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

      {/* Stats */}

      <Grid container spacing={3} mb={4}>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2}>
                <Avatar sx={{ bgcolor: "#1976d2" }}>
                  <ArticleIcon />
                </Avatar>

                <Box>
                  <Typography color="text.secondary">
                    Total Posts
                  </Typography>

                  <Typography variant="h5">
                    {posts.length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* Search */}

      <Paper sx={{ p: 3, mb: 3 }}>

        <Box
          display="flex"
          gap={2}
        >

          <Select
            defaultValue=""
            sx={{ width: 180 }}
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
              startAdornment: <SearchIcon />,
            }}
          />

        </Box>

      </Paper>

      {/* Table */}

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

              {filteredPosts.map((post) => (

                <TableRow
                  hover
                  key={post.id}
                >

                  <TableCell>
                    <Checkbox />
                  </TableCell>

                  <TableCell>

                    <Box display="flex" gap={2}>

                     <Avatar
    variant="rounded"
    src={
        post.guid
            ? `http://localhost:5000/uploads/images/${post.guid}`
            : "/no-image.png"
    }
    sx={{
        width:70,
        height:50,
        borderRadius:2
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

                  <TableCell>

                    <Box display="flex" gap={1}>

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

                  <TableCell>

                   <Chip
    label={post.post_status}
    color={
        post.post_status==="published"
            ? "success"
            : "warning"
    }
    size="small"
/>
                  </TableCell>

                  <TableCell>

                    {new Date(
                      post.post_date
                    ).toLocaleDateString()}

                  </TableCell>

                  <TableCell align="center">

                   <IconButton
color="primary"
component={Link}
to={`/posts/edit/${post.id}`}
>
    <EditIcon/>
</IconButton>

<IconButton
color="error"
onClick={()=>deletePost(post.id)}
>
    <DeleteIcon/>
</IconButton>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </TableContainer>

      </Paper>

    </Box>
  );
}