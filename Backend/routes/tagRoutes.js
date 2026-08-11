const express=require("express");

const router=express.Router();

const{

    getTags,
    addTag,
    updateTag,
    deleteTag

}=require("../controllers/tagController");

router.get("/",getTags);

router.post("/",addTag);

router.put("/:id",updateTag);

router.delete("/:id",deleteTag);

module.exports=router;