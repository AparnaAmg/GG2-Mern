import { useEffect, useState } from "react";
import api from "../../services/api";

import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Chip,
    Tooltip,
} from "@mui/material";

import {
    CloudUpload,
    Search,
    Delete,
    ContentCopy,
    Close,
    Image as ImageIcon,
    GridView,
} from "@mui/icons-material";

import { Link } from "react-router-dom";


export default function MediaLibrary() {

    const [media, setMedia] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [selectedMedia, setSelectedMedia] =
        useState(null);

    const [deleteDialog, setDeleteDialog] =
        useState(false);

    const [mediaToDelete, setMediaToDelete] =
        useState(null);

const getMediaUrl = (media) => {
  if (!media.file_path) return "";

  if (media.file_path.startsWith("http")) {
    return media.file_path;
  }

  return `http://localhost:5000${media.file_path}`;
};
<img
  src={getMediaUrl(media)}
  alt={media.alt_text || media.original_name}
  style={{
    width: "100%",
    height: "240px",
    objectFit: "cover",
  }}
  onError={(e) => {
    console.error("IMAGE LOAD FAILED:", e.currentTarget.src);
  }}
/>
    // ====================================
    // FETCH MEDIA
    // ====================================

    const fetchMedia = async () => {

        try {

            setLoading(true);

            const res =
                await api.get("/media");

            setMedia(
                res.data.media || []
            );

        } catch (err) {

            console.log(
                "MEDIA FETCH ERROR:",
                err
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchMedia();

    }, []);


    // ====================================
    // DELETE
    // ====================================

    const confirmDelete = (item) => {

        setMediaToDelete(item);

        setDeleteDialog(true);

    };


    const deleteMedia = async () => {

        if (!mediaToDelete) return;

        try {

            await api.delete(
                `/media/${mediaToDelete.id}`
            );

            setDeleteDialog(false);

            setMediaToDelete(null);

            setSelectedMedia(null);

            fetchMedia();

        } catch (err) {

            console.log(
                "DELETE ERROR:",
                err
            );

        }
    };


    // ====================================
    // COPY URL
    // ====================================

    const copyUrl = async (url) => {

        try {

            await navigator.clipboard.writeText(
                url
            );

            alert("Media URL copied");

        } catch (err) {

            console.log(err);

        }

    };


    // ====================================
    // SEARCH
    // ====================================

    const filteredMedia =
        media.filter((item) =>
            (
                item.original_name ||
                item.file_name ||
                ""
            )
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );


    // ====================================
    // FORMAT SIZE
    // ====================================

    const formatSize = (bytes) => {

        if (!bytes) return "0 KB";

        const mb =
            bytes /
            (1024 * 1024);

        if (mb >= 1) {

            return (
                mb.toFixed(2) +
                " MB"
            );

        }

        return (
            bytes /
            1024
        ).toFixed(1) +
            " KB";
    };


    return (

        <Box
            sx={{
                p: 4,
                bgcolor: "#f5f7fb",
                minHeight: "100vh",
            }}
        >

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems:
                        "center",
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
                        Media Library
                    </Typography>

                    <Typography
                        color="text.secondary"
                        mt={0.5}
                    >
                        Manage images and media
                        files for GG2 CMS
                    </Typography>

                </Box>


                <Button
                    component={Link}
                    to="/media/upload"
                    variant="contained"
                    startIcon={
                        <CloudUpload />
                    }
                    sx={{
                        borderRadius: 3,
                        px: 3,
                        py: 1.3,
                        textTransform:
                            "none",
                        fontWeight: 600,
                    }}
                >
                    Upload Media
                </Button>

            </Box>


            {/* ================================= */}
            {/* STATS */}
            {/* ================================= */}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(3,1fr)",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >

                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        border:
                            "1px solid #e5e7eb",
                    }}
                >

                    <Typography
                        color="text.secondary"
                    >
                        Total Media
                    </Typography>

                    <Typography
                        variant="h4"
                        fontWeight={700}
                        mt={1}
                    >
                        {media.length}
                    </Typography>

                </Paper>


                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        border:
                            "1px solid #e5e7eb",
                    }}
                >

                    <Typography
                        color="text.secondary"
                    >
                        Images
                    </Typography>

                    <Typography
                        variant="h4"
                        fontWeight={700}
                        mt={1}
                    >
                        {
                            media.filter(
                                item =>
                                    item.mime_type
                                    ?.startsWith(
                                        "image/"
                                    )
                            ).length
                        }
                    </Typography>

                </Paper>


                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        border:
                            "1px solid #e5e7eb",
                    }}
                >

                    <Typography
                        color="text.secondary"
                    >
                        Storage
                    </Typography>

                    <Typography
                        variant="h4"
                        fontWeight={700}
                        mt={1}
                    >
                        {
                            formatSize(
                                media.reduce(
                                    (
                                        total,
                                        item
                                    ) =>
                                        total +
                                        Number(
                                            item.file_size ||
                                            0
                                        ),
                                    0
                                )
                            )
                        }
                    </Typography>

                </Paper>

            </Box>


            {/* ================================= */}
            {/* SEARCH */}
            {/* ================================= */}

            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 3,
                    border:
                        "1px solid #e5e7eb",
                }}
            >

                <TextField
                    fullWidth
                    placeholder="Search media..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />

            </Paper>


            {/* ================================= */}
            {/* MEDIA GRID */}
            {/* ================================= */}

            {loading ? (

                <Box
                    sx={{
                        display: "flex",
                        justifyContent:
                            "center",
                        py: 10,
                    }}
                >

                    <CircularProgress />

                </Box>

            ) : filteredMedia.length === 0 ? (

                <Paper
                    elevation={0}
                    sx={{
                        p: 8,
                        textAlign:
                            "center",
                        borderRadius: 4,
                        border:
                            "1px solid #e5e7eb",
                    }}
                >

                    <ImageIcon
                        sx={{
                            fontSize: 70,
                            color: "#cbd5e1",
                        }}
                    />

                    <Typography
                        variant="h6"
                        mt={2}
                    >
                        No media found
                    </Typography>

                    <Typography
                        color="text.secondary"
                        mt={1}
                    >
                        Upload your first
                        image to get started.
                    </Typography>

                </Paper>

            ) : (

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs:
                                "repeat(1, 1fr)",
                            sm:
                                "repeat(2, 1fr)",
                            md:
                                "repeat(3, 1fr)",
                            lg:
                                "repeat(4, 1fr)",
                            xl:
                                "repeat(5, 1fr)",
                        },
                        gap: 3,
                    }}
                >

                    {filteredMedia.map(
                        (item) => (

                            <Paper
                                key={item.id}
                                elevation={0}
                                sx={{
                                    overflow:
                                        "hidden",
                                    borderRadius: 3,
                                    border:
                                        "1px solid #e5e7eb",
                                    transition:
                                        "all .2s",
                                    "&:hover": {
                                        transform:
                                            "translateY(-3px)",
                                        boxShadow:
                                            "0 10px 25px rgba(0,0,0,.08)",
                                    },
                                }}
                            >

                                {/* IMAGE */}

                                <Box
                                    onClick={() =>
                                        setSelectedMedia(
                                            item
                                        )
                                    }
                                    sx={{
                                        height: 190,
                                        bgcolor:
                                            "#f1f5f9",
                                        cursor:
                                            "pointer",
                                        overflow:
                                            "hidden",
                                    }}
                                >

                                    <img
                                        src={
                                            getMediaUrl(item)
                                        }
                                        alt={
                                            item.original_name
                                        }
                                        style={{
                                            width:
                                                "100%",
                                            height:
                                                "100%",
                                            objectFit:
                                                "cover",
                                        }}
                                    />

                                </Box>


                                {/* DETAILS */}

                                <Box sx={{ p: 2 }}>

                                    <Typography
                                        fontWeight={600}
                                        noWrap
                                    >
                                        {
                                            item.original_name
                                        }
                                    </Typography>

                                    <Box
                                        sx={{
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "space-between",
                                            mt: 1,
                                        }}
                                    >

                                        <Chip
                                            label={formatSize(
                                                Number(
                                                    item.file_size
                                                )
                                            )}
                                            size="small"
                                        />

                                        <Box>

                                            <Tooltip title="Copy URL">

                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        copyUrl(
                                                            getMediaUrl(item)
                                                        )
                                                    }
                                                >
                                                    <ContentCopy
                                                        fontSize="small"
                                                    />
                                                </IconButton>

                                            </Tooltip>


                                            <Tooltip title="Delete">

                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() =>
                                                        confirmDelete(
                                                            item
                                                        )
                                                    }
                                                >
                                                    <Delete
                                                        fontSize="small"
                                                    />
                                                </IconButton>

                                            </Tooltip>

                                        </Box>

                                    </Box>

                                </Box>

                            </Paper>

                        )
                    )}

                </Box>

            )}


            {/* ================================= */}
            {/* MEDIA PREVIEW DIALOG */}
            {/* ================================= */}

            <Dialog
                open={
                    Boolean(
                        selectedMedia
                    )
                }
                onClose={() =>
                    setSelectedMedia(
                        null
                    )
                }
                maxWidth="md"
                fullWidth
            >

                <DialogTitle>

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

                        Media Details

                        <IconButton
                            onClick={() =>
                                setSelectedMedia(
                                    null
                                )
                            }
                        >
                            <Close />
                        </IconButton>

                    </Box>

                </DialogTitle>


                {selectedMedia && (

                    <DialogContent>

                        <Box
                            sx={{
                                textAlign:
                                    "center",
                            }}
                        >

                            <img
    src={getMediaUrl(selectedMedia)}
    alt={selectedMedia.alt_text || selectedMedia.original_name}
                                alt=""
                                style={{
                                    maxWidth:
                                        "100%",
                                    maxHeight:
                                        "500px",
                                    borderRadius:
                                        "12px",
                                }}
                                onError={(e) => {
        console.error(
            "PREVIEW IMAGE FAILED:",
            e.currentTarget.src
        );
    }}
                            />

                            <Typography
                                mt={3}
                                fontWeight={600}
                            >
                                {
                                    selectedMedia.original_name
                                }
                            </Typography>

                            <Typography
                                color="text.secondary"
                                mt={1}
                                sx={{
                                    wordBreak:
                                        "break-all",
                                }}
                            >
                                {
                                    selectedMedia.file_url
                                }
                            </Typography>

                        </Box>

                    </DialogContent>

                )}


                {selectedMedia && (

                    <DialogActions
                        sx={{
                            p: 3,
                        }}
                    >

                        <Button
                            startIcon={
                                <ContentCopy />
                            }
                            onClick={() =>
                                (
                                    copyUrl(getMediaUrl(selectedMedia))
                                )
                            }
                        >
                            Copy URL
                        </Button>

                        <Button
                            color="error"
                            startIcon={
                                <Delete />
                            }
                            onClick={() =>
                                confirmDelete(
                                    selectedMedia
                                )
                            }
                        >
                            Delete
                        </Button>

                    </DialogActions>

                )}

            </Dialog>


            {/* ================================= */}
            {/* DELETE DIALOG */}
            {/* ================================= */}

            <Dialog
                open={deleteDialog}
                onClose={() =>
                    setDeleteDialog(false)
                }
            >

                <DialogTitle>
                    Delete Media?
                </DialogTitle>

                <DialogContent>

                    <Typography>
                        Are you sure you want
                        to permanently delete
                        this image?
                    </Typography>

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() =>
                            setDeleteDialog(false)
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={
                            deleteMedia
                        }
                    >
                        Delete
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>
    );
}