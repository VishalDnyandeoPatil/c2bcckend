const {Router} = require("express");
const {autherization}= require("../middleware/autherization");
const {Blog} = require("../model/blogModel");
const blogRouter = Router();

blogRouter.get('/all', async(req,res)=>{
    try {
        const blog = await Blog.find()
        res.send({blog});
    } catch (error) {
        return res.status(500).send({msg:error.message});
    }
})

blogRouter.post('/create', autherization(["User"]), async(req,res)=>{
    try {
        const blog = new Blog(req.body);
        await blog.save();
        res.send({msg:"Blog created"})
    } catch (error) {
        return res.status(500).send({msg:error.message});
    }
})

blogRouter.post("/blog/:id", autherization(["User"]),async(req,res)=>{
    try {
        const {blogId} = req.params;
        const blog = await Blog.find({blogId});
        if(blog.id===req.body.blogId){
            await Blog.findByIdAndUpdate({blogId});
            res.send({msg:"Blog is updated successfully"})
        }
        else{
            res.status(403).send({msg:"User is not autherized"})
        }
    } catch (error) {
        return res.status(500).send({msg:error.message});
    }
});

blogRouter.post('/blogdelete/:id', autherization(["User"]), async(req,res)=>{
    try {
        const {blogId}= req.params;
        const blog = await Blog.find({blogId});
        if(blog.id===req.body.blogId){
            await Blog.deleteOne({blogId});
            res.send({msg:"Blog is deleted successfully"})
        }
        else{
            res.status(403).send({msg:"User is not autherized"})
        }
    } catch (error) {
        return res.status(500).send({msg:error.message});
    }
})

module.exports = {blogRouter};