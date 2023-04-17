const express = require('express');
const {connection} = require ('./config/db');
const {authenticator} = require ('./middleware/authentication')
const {userRouter} = require('./routes/userRoute');
// const jwt = require("jsonwebtoken");
const {blogRouter}= require('./routes/blogRoute');
require ("dotenv").config();

const port = process.env.port ;

const app = express();
app.use(express.json());

app.get ("/", (req,res)=>{
    res.send("Blog Page");
});

app.use("/user", userRouter);
app.use("/Blogs", authenticator ,blogRouter);

app.listen(port, async()=>{
    try {
        await connection
        console.log("Connected to db")
    } catch (error) {
        console.log("Not Connected to db")
    }
});
