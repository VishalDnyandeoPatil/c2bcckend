const {Router} = require('express');
const {User} = require('../model/usersModel')
const fs = require ("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userRouter = Router();

userRouter.post("/signup", async(req,res)=>{
    try {
        const {name,email,password,role}= req.body;
        const userPresent = await User.findOne({email});
        if(userPresent){
            return res.send("User alredy present, please login");
        }
        const hash = await bcrypt.hashSync(password,5);
        const newUser = new User({name,email,password:hash,role});
        await newUser.save();
        res.send("Sign Up Successfully")
    } catch (error) {
        res.send(error.message);
    }
});

userRouter.post("/login",async(req,res)=>{
    try {
        const{email,password} = req.body;
        if(!email || !password){
            return res.status(401).send({msg:"Please provide a valid email"})
        }
        const userPresent = await User.findOne({email});
        if(!userPresent){
            return res.send("Please register, User is not present");
        }
        const correctPassword = await bcrypt.compareSync(password, userPresent.password);
        if(!correctPassword){
            return res.send("Invalid Password or Incorrect password")
        }
        const token = await jwt.sign({email,userId:userPresent._id,role:userPresent.role},process.env.secretKey,{expiresIn:"1m"});
        const refreshtoken = await jwt.sign({email,userId:userPresent._id,role:userPresent.role},process.env.refreshsecretKey,{expiresIn:"3m"});
        res.send({msg:"login successful", token, refreshtoken})
    } catch (error) {
        res.send(error.message)
    }
});

userRouter.get('/getnewtoken', (req,res)=>{
    const refreshtoken = req.headers.authorization.split(" ")[1];
    if(!refreshtoken){
        return res.send({msg:"Please login"})
    }
    jwt.verify(refreshtoken,process.env.refreshsecretKey,(err,decode)=>{
        if(err){
            return res.send({msg:"Please login"})
        }
        else{
            const token = jwt.sign({userId:decode.userId,email:decode.email}, process.env.secretKey,{expiresIn:"1m"})
            res.send({msg:"Login Successful",token});
        }
    });
});

userRouter.get('/logout',(req,res)=>{
    try {
        const token = req?.headers?.authorization?.split(" ")[1];
        const blacklistData= JSON.parse(fs.readFileSync('./blacklist.json','utf-8'));
        blacklistData.push(token);
        fs.writeFileSync("./blacklist.json", JSON.stringify(blacklistData));
        res.send("Logout Successful");
    } catch (error) {
        res.send(error.message)
    }
});

module.exports={userRouter};