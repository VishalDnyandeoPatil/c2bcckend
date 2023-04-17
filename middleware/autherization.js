const autherization = (roleArr)=> async(req,res,next)=>{
    const userRole = req.body.role;
    if(roleArr.includes(userRole)){
        next();
    }
    else{
        res.status(403).send({msg:"Not authorized"})
    }
};

module.exports= {autherization};