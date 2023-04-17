const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title:{type:String, require:true},
    content:{type:String, require:true},
    comments:{type:String, require:true},
    noOfComments:{type:Number, require:true},
})

const Blog =  mongoose.model("blog", blogSchema)
module.exports={Blog};