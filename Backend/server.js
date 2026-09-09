const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const pool = require("./config/db");

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());

// Static uploads
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const tagRoutes = require("./routes/tagRoutes");
const postRoutes = require("./routes/postRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const pagesRouter = require("./routes/pages");
const commentsRouter = require("./routes/comments");
const themesRouter = require("./routes/themes");
const customizerRouter = require("./routes/customizer");
const menuRoutes = require("./routes/menus");
const authenticateToken = require("./middlewares/authMiddleware");

app.use("/api/pages", authenticateToken, pagesRouter);
app.use("/api/auth", authRoutes);

app.use("/api/users", authenticateToken, userRoutes);

app.use("/api/categories", authenticateToken, categoryRoutes);
app.use("/api/tags", authenticateToken, tagRoutes);
app.use("/api/posts", authenticateToken, postRoutes);
app.use("/api/media", authenticateToken, mediaRoutes);
app.use("/api/comments", authenticateToken, commentsRouter);
app.use("/api/themes", authenticateToken, themesRouter);
app.use("/api/customizer", authenticateToken, customizerRouter);

app.use("/api/menus", authenticateToken, menuRoutes);



app.get("/", (req, res) => {
    res.json({
        message: "GG2 Backend Running",
    });
});

app.get("/db-test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            success: true,
            serverTime: result.rows[0].now,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

app.get("/api/test-auth", authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: "Authentication successful",
        user: req.user,
    });
});

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
    console.log(
        `✅ Server running on port ${PORT}`
    );
});