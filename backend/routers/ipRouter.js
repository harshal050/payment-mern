const express = require('express');
const ipRouter = express.Router();
const {Blockedip} = require('../db/db')

ipRouter.get('/',async(req,res)=>{
    try{
        const data = await Blockedip.find();
        res.status(200).json(data);
    }catch(e){
        res.status(500).json({
            message : "server error.",
            success : false
        })
    }
})


ipRouter.delete('/',async(req,res)=>{
    try{
        await Blockedip.deleteMany();
        res.status(200).json({message:"delete successfully.."});
    }catch(e){
        res.status(500).json({
            message : "server error.",
            success : false
        })
    }
})
module.exports = {
    ipRouter
}