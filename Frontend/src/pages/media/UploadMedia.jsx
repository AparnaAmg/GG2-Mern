import { useState } from "react";
import api from "../../services/api";

import {
    Box,
    Paper,
    Typography,
    Button,
    LinearProgress,
    Alert,
    IconButton,
} from "@mui/material";

import {
    CloudUpload,
    ArrowBack,
    Image as ImageIcon,
    Delete,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";


export default function UploadMedia() {

    const navigate = useNavigate();

    const [file, setFile] =
        useState(null);

    const [preview, setPreview] =
        useState("");

    const [uploading, setUploading] =
        useState(false);

    const [error, setError] =
        useState("");


    // ===============================
    // FILE SELECT
    // ===============================

    const handleFile = (selectedFile) => {

        if (!selectedFile) return;

        setError("");

        if (
            !selectedFile.type.startsWith(
                "image/"
            )
        ) {

            setError(
                "Please select an image file."
            );

            return;
        }

        if (
            selectedFile.size >
            10 * 1024 * 1024
        ) {

            setError(
                "Image size must be less than 10 MB."
            );

            return;
        }

        setFile(selectedFile);

        setPreview(
            URL.createObjectURL(
                selectedFile
            )
        );
    };


    const handleInputChange = (e) => {

        handleFile(
            e.target.files[0]
        );

    };


    // ===============================
    // UPLOAD
    // ===============================

    const upload = async () => {

        if (!file) {

            setError(
                "Please select an image."
            );

            return;
        }

        try {

            setUploading(true);

            setError("");

            const formData =
                new FormData();

            formData.append(
                "file",
                file
            );

            const user =
                JSON.parse(
                    localStorage.getItem(
                        "user"
                    ) || "{}"
                );

            if (user.id) {

                formData.append(
                    "uploaded_by",
                    user.id
                );

            }

            await api.post(
                "/media/upload",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            alert(
                "Media uploaded successfully"
            );

            navigate("/media");

        } catch (err) {

            console.log(
                "UPLOAD ERROR:",
                err
            );

            setError(
                err.response?.data
                    ?.message ||
                "Upload failed."
            );

        } finally {

            setUploading(false);

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
                    display:
                        "flex",
                    alignItems:
                        "center",
                    gap: 2,
                    mb: 4,
                }}
            >

                <IconButton
                    onClick={() =>
                        navigate(
                            "/media"
                        )
                    }
                >
                    <ArrowBack />
                </IconButton>

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        Upload Media
                    </Typography>

                    <Typography
                        color="text.secondary"
                    >
                        Add an image to your
                        GG2 Media Library
                    </Typography>

                </Box>

            </Box>


            {/* CARD */}

            <Paper
                elevation={0}
                sx={{
                    maxWidth: 850,
                    mx: "auto",
                    p: 5,
                    borderRadius: 4,
                    border:
                        "1px solid #e5e7eb",
                }}
            >

                {error && (

                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>

                )}


                {!file ? (

                    <Box
                        component="label"
                        sx={{
                            minHeight:
                                350,
                            border:
                                "2px dashed #cbd5e1",
                            borderRadius: 4,
                            display:
                                "flex",
                            flexDirection:
                                "column",
                            justifyContent:
                                "center",
                            alignItems:
                                "center",
                            cursor:
                                "pointer",
                            bgcolor:
                                "#f8fafc",
                            transition:
                                "all .2s",
                            "&:hover": {
                                borderColor:
                                    "#2563eb",
                                bgcolor:
                                    "#eff6ff",
                            },
                        }}
                    >

                        <CloudUpload
                            sx={{
                                fontSize: 70,
                                color:
                                    "#2563eb",
                                mb: 2,
                            }}
                        />

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            Upload an image
                        </Typography>

                        <Typography
                            color="text.secondary"
                            mt={1}
                        >
                            PNG, JPG, JPEG,
                            WEBP, GIF or SVG
                        </Typography>

                        <Typography
                            color="text.secondary"
                            fontSize={14}
                            mt={1}
                        >
                            Maximum file size:
                            10 MB
                        </Typography>

                        <Button
                            variant="contained"
                            component="span"
                            startIcon={
                                <CloudUpload />
                            }
                            sx={{
                                mt: 3,
                                borderRadius: 3,
                                textTransform:
                                    "none",
                            }}
                        >
                            Choose Image
                        </Button>

                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={
                                handleInputChange
                            }
                        />

                    </Box>

                ) : (

                    <Box>

                        {/* PREVIEW */}

                        <Box
                            sx={{
                                textAlign:
                                    "center",
                            }}
                        >

                           <img
  src={preview}
  alt={file?.name || "Selected image"}
  style={{
    width: "100%",
    maxHeight: "400px",
    objectFit: "contain",
    borderRadius: "12px",
  }}
/>

                        </Box>


                        {/* FILE DETAILS */}

                        <Box
                            sx={{
                                mt: 4,
                                p: 3,
                                bgcolor:
                                    "#f8fafc",
                                borderRadius: 3,
                            }}
                        >

                            <Box
                                sx={{
                                    display:
                                        "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "center",
                                }}
                            >

                                <Box>

                                    <Typography
                                        fontWeight={600}
                                    >
                                        {
                                            file.name
                                        }
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                        fontSize={14}
                                        mt={0.5}
                                    >
                                        {
                                            (
                                                file.size /
                                                1024 /
                                                1024
                                            ).toFixed(
                                                2
                                            )
                                        }{" "}
                                        MB
                                    </Typography>

                                </Box>

                                <IconButton
                                    color="error"
                                    onClick={() => {

                                        setFile(
                                            null
                                        );

                                        setPreview(
                                            ""
                                        );

                                    }}
                                >
                                    <Delete />
                                </IconButton>

                            </Box>

                        </Box>


                        {uploading && (

                            <Box sx={{ mt: 3 }}>

                                <LinearProgress />

                                <Typography
                                    align="center"
                                    color="text.secondary"
                                    mt={1}
                                >
                                    Uploading...
                                </Typography>

                            </Box>

                        )}


                        {/* ACTIONS */}

                        <Box
                            sx={{
                                display:
                                    "flex",
                                justifyContent:
                                    "flex-end",
                                gap: 2,
                                mt: 4,
                            }}
                        >

                            <Button
                                variant="outlined"
                                onClick={() =>
                                    navigate(
                                        "/media"
                                    )
                                }
                                sx={{
                                    borderRadius:
                                        3,
                                    textTransform:
                                        "none",
                                }}
                            >
                                Cancel
                            </Button>


                            <Button
                                variant="contained"
                                startIcon={
                                    <CloudUpload />
                                }
                                onClick={
                                    upload
                                }
                                disabled={
                                    uploading
                                }
                                sx={{
                                    borderRadius:
                                        3,
                                    px: 4,
                                    textTransform:
                                        "none",
                                }}
                            >
                                Upload Media
                            </Button>

                        </Box>

                    </Box>

                )}

            </Paper>

        </Box>
    );
}