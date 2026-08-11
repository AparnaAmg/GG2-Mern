const express=require("express");

const router=express.Router();

const {

getUsers,

addUser,
getUserById,
  updateUser,
  deleteUser

}=require("../controllers/userController");

router.get("/",getUsers);

router.post("/",addUser);

router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports=router;