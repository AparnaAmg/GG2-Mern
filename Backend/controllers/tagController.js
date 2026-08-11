const pool = require("../config/db");

// Get Tags
const getTags = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT *
            FROM gg2_tags
            WHERE is_active=true
            ORDER BY tag_name
        `);

        res.json({
            success: true,
            tags: result.rows
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};


// Add Tag

const addTag = async (req,res)=>{

    try{

        const{
            tag_name,
            slug,
            description
        }=req.body;

        await pool.query(
            `
            INSERT INTO gg2_tags
            (tag_name,slug,description)

            VALUES($1,$2,$3)
            `,
            [
                tag_name,
                slug,
                description
            ]
        );

        res.json({
            success:true,
            message:"Tag Added"
        });

    }
    catch(err){

        console.log(err);

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

};


// Update

const updateTag=async(req,res)=>{

    try{

        const{
            tag_name,
            slug,
            description
        }=req.body;

        await pool.query(
            `
            UPDATE gg2_tags

            SET
            tag_name=$1,
            slug=$2,
            description=$3,
            updated_at=NOW()

            WHERE id=$4
            `,
            [
                tag_name,
                slug,
                description,
                req.params.id
            ]
        );

        res.json({
            success:true,
            message:"Updated"
        });

    }
    catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

};


// Delete

const deleteTag=async(req,res)=>{

    try{

        await pool.query(
            `
            UPDATE gg2_tags

            SET is_active=false

            WHERE id=$1
            `,
            [req.params.id]
        );

        res.json({
            success:true,
            message:"Deleted"
        });

    }
    catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

};

module.exports={
    getTags,
    addTag,
    updateTag,
    deleteTag
};