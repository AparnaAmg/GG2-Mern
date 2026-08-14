const pool = require("../config/db");

// =====================================================
// GET ALL COMMENTS
// =====================================================

const getAllComments = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                post_id,
                author_name,
                author_email,
                comment_content,
                comment_status,
                created_at,
                updated_at
            FROM comments
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            comments: result.rows
        });

    } catch (error) {
        console.error("GET COMMENTS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch comments"
        });
    }
};


// =====================================================
// GET COMMENTS BY POST
// =====================================================

const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const result = await pool.query(
            `
            SELECT
                id,
                post_id,
                author_name,
                author_email,
                comment_content,
                comment_status,
                created_at,
                updated_at
            FROM comments
            WHERE post_id = $1
            ORDER BY created_at DESC
            `,
            [postId]
        );

        res.json({
            success: true,
            comments: result.rows
        });

    } catch (error) {
        console.error("GET POST COMMENTS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch post comments"
        });
    }
};


// =====================================================
// ADD COMMENT
// =====================================================

const addComment = async (req, res) => {
    try {
        console.log("ADD COMMENT BODY:", req.body);

        const {
            post_id,
            author_name,
            author_email,
            comment_content,
            comment_status
        } = req.body;

        // -----------------------------------------------
        // VALIDATION
        // -----------------------------------------------

        if (!post_id) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required"
            });
        }

        if (!author_name || !author_name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Author name is required"
            });
        }

        if (!comment_content || !comment_content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Comment content is required"
            });
        }

        // -----------------------------------------------
        // INSERT
        // -----------------------------------------------

        const result = await pool.query(
            `
            INSERT INTO comments (
                post_id,
                author_name,
                author_email,
                comment_content,
                comment_status
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [
                post_id,
                author_name.trim(),
                author_email || null,
                comment_content.trim(),
                comment_status || "pending"
            ]
        );

        console.log("COMMENT CREATED:", result.rows[0]);

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment: result.rows[0]
        });

    } catch (error) {
        console.error("ADD COMMENT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add comment",
            error: error.message
        });
    }
};


// =====================================================
// UPDATE COMMENT STATUS
// =====================================================

const updateCommentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "approved",
            "spam",
            "trash"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid comment status"
            });
        }

        const result = await pool.query(
            `
            UPDATE comments
            SET
                comment_status = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
            `,
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        res.json({
            success: true,
            message: "Comment status updated",
            comment: result.rows[0]
        });

    } catch (error) {
        console.error("UPDATE COMMENT STATUS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update comment"
        });
    }
};


// =====================================================
// DELETE COMMENT
// =====================================================

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM comments
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        res.json({
            success: true,
            message: "Comment deleted successfully"
        });

    } catch (error) {
        console.error("DELETE COMMENT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete comment"
        });
    }
};


module.exports = {
    getAllComments,
    getCommentsByPost,
    addComment,
    updateCommentStatus,
    deleteComment
};