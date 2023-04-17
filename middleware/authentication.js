const jwt = require('jsonwebtoken');
const fs = require('fs');
const {json} = require('express');

const authenticator = async(req,res,next)=>{
    try {
        const token = req?.headers?.authorization?.split(' ')[1];
        if(!token){
            return res.status(401).send({msg:'Please login again'});
        }
        const blacklistdata = JSON.parse(fs.readFileSync('./blacklist.json','utf-8'));
        const blacklistToken = blacklistdata.find((bToken)=>bToken==token);
        if(!blacklistToken){
            return res.status(403).send({msg:'Please login again'});
        }
        const validToken = await jwt.verify(token, process.env.secretKey);
        if(!validToken){
            return res.status(403).send({msg:'Please login again, authentication failed '});
        }
        req.body.userId= validToken.userId;
        req.body.email= validToken.email;
        req.body.role= validToken.role;
        next();
    } catch (error) {
        res.send({msg:"Please login", error:error.message});
    }
}

module.exports={authenticator}