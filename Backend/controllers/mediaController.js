const pool = require("../config/db");

const uploadMedia = async (req, res) => {
    try {
        console.log("FILE:", req.file);
        console.log("BODY:", req.body);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const file = req.file;

        // IMPORTANT
        const filePath = `/uploads/images/${file.filename}`;

        const result = await pool.query(
            `
            INSERT INTO gg2_media
            (
                file_name,
                original_name,
                file_path,
                file_size,
                mime_type,
                alt_text,
                caption,
                description,
                uploaded_by
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING *
            `,
            [
                file.filename,
                file.originalname,
                filePath,
                file.size,
                file.mimetype,
                req.body.alt_text || "",
                req.body.caption || "",
                req.body.description || "",
                req.body.uploaded_by || null,
            ]
        );

        console.log("MEDIA CREATED:", result.rows[0]);

        res.status(201).json({
            success: true,
            message: "Media uploaded successfully",
            media: result.rows[0],
        });

    } catch (error) {
        console.error("MEDIA UPLOAD ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const getMedia = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT *
            FROM gg2_media
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            media: result.rows,
        });

    } catch (error) {
        console.error("GET MEDIA ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const getMediaById = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT *
            FROM gg2_media
            WHERE id = $1
            `,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Media not found",
            });
        }

        res.json({
            success: true,
            media: result.rows[0],
        });

    } catch (error) {
        console.error("GET MEDIA BY ID ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const deleteMedia = async (req, res) => {
    try {
        const result = await pool.query(
            `
            DELETE FROM gg2_media
            WHERE id = $1
            RETURNING *
            `,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Media not found",
            });
        }

        res.json({
            success: true,
            message: "Media deleted successfully",
        });

    } catch (error) {
        console.error("DELETE MEDIA ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = {
    uploadMedia,
    getMedia,
    getMediaById,
    deleteMedia,
};