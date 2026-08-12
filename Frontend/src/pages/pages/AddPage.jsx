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
    Box,
    Divider,
} from "@mui/material";

import {
    useParams,
    useNavigate,
    Link,
} from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";


export default function AddPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const isEdit = Boolean(id);

    // ===============================
    // STATES
    // ===============================

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [status, setStatus] = useState("draft");

    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState("");

    const [saving, setSaving] = useState(false);


    // ===============================
    // LOAD PAGE FOR EDIT
    // ===============================

    useEffect(() => {

        if (isEdit) {
            getPage();
        }

    }, [id]);


    const getPage = async () => {

        try {

            const res = await api.get(`/pages/${id}`);

            const page = res.data.page;

            setTitle(page.page_title || "");
            setSlug(page.page_name || "");
            setContent(page.page_content || "");
            setExcerpt(page.page_excerpt || "");
            setStatus(page.page_status || "draft");
            setExistingImage(
                page.featured_image || ""
            );

        } catch (error) {

            console.error(
                "GET PAGE ERROR:",
                error
            );

            alert("Failed to load page.");

        }
    };


    // ===============================
    // GENERATE SLUG
    // ===============================

    const generateSlug = (value) => {

        return value
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .replace(/-+/g, "-");

    };


    // ===============================
    // TITLE CHANGE
    // ===============================

    const handleTitleChange = (e) => {

        const value = e.target.value;

        setTitle(value);

        // Only automatically update slug
        // while creating a new page

        if (!isEdit) {

            setSlug(
                generateSlug(value)
            );

        }

    };


    // ===============================
    // IMAGE SELECT
    // ===============================

    const handleImageChange = (e) => {

        const selectedFile =
            e.target.files?.[0];

        if (!selectedFile) return;

        if (
            !selectedFile.type.startsWith(
                "image/"
            )
        ) {

            alert(
                "Please select an image file."
            );

            return;
        }

        if (
            selectedFile.size >
            10 * 1024 * 1024
        ) {

            alert(
                "Image size must be less than 10 MB."
            );

            return;
        }

        setImage(selectedFile);

    };


    // ===============================
    // REMOVE NEW IMAGE
    // ===============================

    const removeImage = () => {

        setImage(null);

    };


    // ===============================
    // SAVE PAGE
    // ===============================

    const savePage = async () => {

        if (!title.trim()) {

            alert(
                "Please enter a page title."
            );

            return;
        }

        try {

            setSaving(true);

            const formData =
                new FormData();

            formData.append(
                "title",
                title
            );

            formData.append(
                "slug",
                slug
            );

            formData.append(
                "content",
                content
            );

            formData.append(
                "excerpt",
                excerpt
            );

            formData.append(
                "status",
                status
            );

            // Temporary author
            formData.append(
                "author",
                1
            );

            // Featured image
            if (image) {

                formData.append(
                    "featuredImage",
                    image
                );

            }


            if (isEdit) {

                await api.put(
                    `/pages/${id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                );

                alert(
                    "Page updated successfully."
                );

            } else {

                await api.post(
                    "/pages",
                    formData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                );

                alert(
                    "Page created successfully."
                );

            }

            navigate("/pages");

        } catch (error) {

            console.error(
                "SAVE PAGE ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to save page."
            );

        } finally {

            setSaving(false);

        }

    };


    // ===============================
    // IMAGE PREVIEW
    // ===============================

    const imagePreview = image
        ? URL.createObjectURL(image)
        : existingImage
            ? (
                existingImage.startsWith("http")
                    ? existingImage
                    : `http://localhost:5000${existingImage}`
            )
            : "";


    // ===============================
    // UI
    // ===============================

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
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    mb: 4,
                }}
            >

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        {isEdit
                            ? "Edit Page"
                            : "Add New Page"}
                    </Typography>

                    <Typography
                        color="text.secondary"
                        mt={0.5}
                    >
                        Create and manage pages
                        for GG2 CMS
                    </Typography>

                </Box>


                <Button
                    component={Link}
                    to="/pages"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    sx={{
                        borderRadius: 3,
                        textTransform: "none",
                    }}
                >
                    All Pages
                </Button>

            </Box>


            <Grid
                container
                spacing={3}
            >

                {/* ================================= */}
                {/* LEFT SIDE */}
                {/* ================================= */}

                <Grid
                    item
                    xs={12}
                    md={8}
                >

                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            border:
                                "1px solid #e5e7eb",
                        }}
                    >

                        {/* TITLE */}

                        <TextField
                            fullWidth
                            label="Page Title"
                            value={title}
                            onChange={
                                handleTitleChange
                            }
                            sx={{
                                mb: 3,
                            }}
                        />


                        {/* SLUG */}

                        <TextField
                            fullWidth
                            label="Slug"
                            value={slug}
                            onChange={(e) =>
                                setSlug(
                                    generateSlug(
                                        e.target.value
                                    )
                                )
                            }
                            helperText={
                                "URL: /" + slug
                            }
                            sx={{
                                mb: 3,
                            }}
                        />


                        {/* CONTENT EDITOR */}

                        <Editor
  tinymceScriptSrc="/tinymce/tinymce.min.js"
  value={content}
  init={{
    height: 500,
    menubar: true,

    plugins:
      "advlist autolink lists link image media table code fullscreen preview",

    toolbar:
      "undo redo | blocks | bold italic underline | " +
      "alignleft aligncenter alignright | " +
      "bullist numlist | link image media table | " +
      "code fullscreen preview",

    branding: false,
    promotion: false,

    content_style:
      "body { font-family:Arial,sans-serif; font-size:14px; }",
  }}
  onEditorChange={(value) => setContent(value)}
/>

                        {/* EXCERPT */}

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Excerpt"
                            value={excerpt}
                            onChange={(e) =>
                                setExcerpt(
                                    e.target.value
                                )
                            }
                            sx={{
                                mt: 3,
                            }}
                            helperText="Short description of the page"
                        />

                    </Paper>

                </Grid>


                {/* ================================= */}
                {/* RIGHT SIDE */}
                {/* ================================= */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    {/* ================================= */}
                    {/* PUBLISH */}
                    {/* ================================= */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            borderRadius: 4,
                            border:
                                "1px solid #e5e7eb",
                        }}
                    >

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            {isEdit
                                ? "Update Page"
                                : "Publish"}
                        </Typography>


                        <Divider
                            sx={{
                                my: 2,
                            }}
                        />


                        <Typography
                            variant="body2"
                            color="text.secondary"
                            mb={1}
                        >
                            Status
                        </Typography>


                        <Select
                            fullWidth
                            value={status}
                            onChange={(e) =>
                                setStatus(
                                    e.target.value
                                )
                            }
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
                            startIcon={
                                <SaveIcon />
                            }
                            disabled={saving}
                            onClick={savePage}
                            sx={{
                                mt: 2,
                                py: 1.4,
                                borderRadius: 3,
                                textTransform:
                                    "none",
                                fontWeight: 600,
                            }}
                        >

                            {saving
                                ? "Saving..."
                                : isEdit
                                    ? "Update Page"
                                    : "Publish Page"}

                        </Button>

                    </Paper>


                    {/* ================================= */}
                    {/* FEATURED IMAGE */}
                    {/* ================================= */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            border:
                                "1px solid #e5e7eb",
                        }}
                    >

                        <Typography
                            variant="h6"
                            fontWeight={600}
                            mb={2}
                        >
                            Featured Image
                        </Typography>


                        <Button
                            component="label"
                            variant="outlined"
                            fullWidth
                            startIcon={
                                <CloudUploadIcon />
                            }
                            sx={{
                                py: 1.5,
                                borderRadius: 3,
                                textTransform:
                                    "none",
                            }}
                        >

                            Upload Image

                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleImageChange
                                }
                            />

                        </Button>


                        {/* IMAGE PREVIEW */}

                        {imagePreview && (

                            <Box
                                mt={3}
                                textAlign="center"
                            >

                                <img
                                    src={
                                        imagePreview
                                    }
                                    alt={
                                        title ||
                                        "Featured image"
                                    }
                                    style={{
                                        width:
                                            "100%",
                                        borderRadius:
                                            "12px",
                                        maxHeight:
                                            "220px",
                                        objectFit:
                                            "cover",
                                    }}
                                />


                                {image && (

                                    <Button
                                        color="error"
                                        size="small"
                                        onClick={
                                            removeImage
                                        }
                                        sx={{
                                            mt: 1,
                                            textTransform:
                                                "none",
                                        }}
                                    >
                                        Remove Image
                                    </Button>

                                )}

                            </Box>

                        )}


                        {/* NO IMAGE */}

                        {!imagePreview && (

                            <Box
                                sx={{
                                    mt: 3,
                                    p: 4,
                                    bgcolor:
                                        "#fafafa",
                                    borderRadius: 3,
                                    textAlign:
                                        "center",
                                }}
                            >

                                <ImageIcon
                                    sx={{
                                        fontSize: 60,
                                        color:
                                            "#bdbdbd",
                                    }}
                                />

                                <Typography
                                    color="text.secondary"
                                >
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