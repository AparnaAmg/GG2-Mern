import { useEffect, useState } from "react";
import api from "../../services/api";

import { Editor } from "@tinymce/tinymce-react";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Box,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";

export default function AddPost() {

  const { id } = useParams();
const navigate = useNavigate();

const isEdit = !!id;

  const [title, setTitle] = useState("");

  const [slug, setSlug] = useState("");

  const [content, setContent] = useState("");

  const [excerpt, setExcerpt] = useState("");

  const [status, setStatus] = useState("draft");

  const [categories, setCategories] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);

  const [tags, setTags] = useState([]);

  const [selectedTags, setSelectedTags] = useState([]);

  const [image, setImage] = useState(null);

  useEffect(() => {
    if (isEdit) {
      getPost();

      

    }

    fetchCategories();

    fetchTags();

  }, [id]);

 const getPost = async () => {

    try {

        const res = await api.get(`/posts/${id}`);

        const post = res.data.post;

        setTitle(post.post_title || "");
        setSlug(post.post_name || "");
        setContent(post.post_content || "");
        setExcerpt(post.post_excerpt || "");
        setStatus(post.post_status || "draft");

    } catch (err) {

        console.log(err);

    }

};
  const fetchCategories = async () => {

    const res = await api.get("/categories");

    setCategories(res.data.categories);

  };

  const fetchTags = async () => {

    const res = await api.get("/tags");

    setTags(res.data.tags);

  };

  const savePost = async () => {

    const formData = new FormData();

    formData.append("title", title);
formData.append("slug", slug);
formData.append("content", content);
formData.append("excerpt", excerpt);
formData.append("status", status);

// Temporary
formData.append("author", 1);

   if (image) {
    formData.append("featuredImage", image);
}

    if (isEdit) {

        await api.put(`/posts/${id}`, formData);

        alert("Post Updated");

    } else {

        await api.post("/posts", formData);

        alert("Post Created");

    }

    navigate("/posts");

};

 return (
  <Box
    sx={{
      p: 4,
      bgcolor: "#f5f7fb",
      minHeight: "100vh",
    }}
  >
    {/* Header */}

    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
      }}
    >
      <Box>
        <Typography variant="h4" fontWeight={700}>
          {isEdit ? "Edit Post" : "Add New Post"}
        </Typography>

        <Typography color="text.secondary">
          Create and manage articles for GG2 CMS
        </Typography>
      </Box>

      <Button
        component={Link}
        to="/posts"
        variant="outlined"
        startIcon={<AddIcon />}
      >
        All Posts
      </Button>
    </Box>

    <Grid container spacing={3}>

      {/* LEFT SIDE */}

      <Grid item xs={12} md={8}>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: "1px solid #e5e7eb",
          }}
        >
          <TextField
            fullWidth
            label="Post Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);

              setSlug(
                e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, "-")
              );
            }}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Editor
            apiKey="YOUR_TINYMCE_API_KEY"
            value={content}
            init={{
              height: 500,
              menubar: true,
              plugins:
                "advlist autolink lists link image media table code fullscreen preview",
              toolbar:
                "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | image media table | code",
            }}
            onEditorChange={(value) => setContent(value)}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            sx={{ mt: 3 }}
          />
        </Paper>

      </Grid>


      {/* RIGHT */}

      <Grid item xs={12} md={4}>

        {/* Publish */}

        <Paper
  elevation={0}
  sx={{
    p: 3,
    mb: 3,
    borderRadius: 4,
    border: "1px solid #e5e7eb",
  }}
>

          <Typography variant="h6">

            {isEdit ? "Update Post" : "Publish"}

          </Typography>

          <Divider sx={{my:2}}/>

          <Select

            fullWidth

            value={status}

            onChange={(e)=>setStatus(e.target.value)}

          >

            <MenuItem value="draft">

              Draft

            </MenuItem>

            <MenuItem value="published">

              Published

            </MenuItem>

          </Select>

          <Button
  fullWidth
  variant="contained"
  startIcon={<SaveIcon />}
  sx={{
    mt: 2,
    py: 1.4,
    borderRadius: 3,
    textTransform: "none",
    fontWeight: 600,
  }}
  onClick={savePost}
>
  {isEdit ? "Update Post" : "Publish Post"}
</Button>

        </Paper>

        {/* Categories */}

        <Paper sx={{p:3,mb:2}}>

          <Typography variant="h6">

            Categories

          </Typography>

          {

            categories.map(cat=>(

              <FormControlLabel

                key={cat.id}

                control={

                  <Checkbox

                    onChange={(e)=>{

                      if(e.target.checked){

                        setSelectedCategories([

                          ...selectedCategories,

                          cat.id

                        ]);

                      }

                      else{

                        setSelectedCategories(

                          selectedCategories.filter(

                            id=>id!==cat.id

                          )

                        );

                      }

                    }}

                  />

                }

                label={cat.category_name}

              />

            ))

          }

        </Paper>

        {/* Tags */}

        <Paper sx={{p:3,mb:2}}>

          <Typography variant="h6">

            Tags

          </Typography>

          {

            tags.map(tag=>(

              <FormControlLabel

                key={tag.id}

                control={

                  <Checkbox

                    onChange={(e)=>{

                      if(e.target.checked){

                        setSelectedTags([

                          ...selectedTags,

                          tag.id

                        ]);

                      }

                      else{

                        setSelectedTags(

                          selectedTags.filter(

                            id=>id!==tag.id

                          )

                        );

                      }

                    }}

                  />

                }

                label={tag.tag_name}

              />

            ))

          }

        </Paper>

        {/* Featured Image */}

       <Paper
  elevation={0}
  sx={{
    p: 3,
    borderRadius: 4,
    border: "1px solid #e5e7eb",
  }}
>
  <Typography variant="h6" mb={2}>
    Featured Image
  </Typography>

  <Button
    component="label"
    variant="outlined"
    fullWidth
    startIcon={<CloudUploadIcon />}
    sx={{
      py: 2,
      borderRadius: 3,
      textTransform: "none",
    }}
  >
    Upload Image

    <input
      hidden
      type="file"
      onChange={(e) => setImage(e.target.files[0])}
    />
  </Button>

  {image && (
    <Box mt={3} textAlign="center">
      <img
        src={URL.createObjectURL(image)}
        alt=""
        style={{
          width: "100%",
          borderRadius: 12,
          maxHeight: 220,
          objectFit: "cover",
        }}
      />

      <Typography mt={1}>
        {image.name}
      </Typography>
    </Box>
  )}

  {!image && (
    <Box
      sx={{
        mt: 3,
        p: 4,
        bgcolor: "#fafafa",
        borderRadius: 3,
        textAlign: "center",
      }}
    >
      <ImageIcon
        sx={{
          fontSize: 60,
          color: "#bdbdbd",
        }}
      />

      <Typography color="text.secondary">
        No Featured Image
      </Typography>
    </Box>
  )}
</Paper>
      </Grid>

    </Grid>
 </Box>
  );

}