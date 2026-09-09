const express = require("express");

const router = express.Router();

const {
  getMenus,
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
} = require("../controllers/menuController");


// GET all menus
router.get("/", getMenus);


// GET single menu
router.get("/:id", getMenu);


// CREATE menu
router.post("/", createMenu);


// UPDATE menu
router.put("/:id", updateMenu);


// DELETE menu
router.delete("/:id", deleteMenu);


module.exports = router;