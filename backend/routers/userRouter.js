
const express = require('express');
const {usermiddleware} = require('../middleware/usermiddleware');
const userRouter = express.Router();
const {User,Transactions,mongoose} = require('../db/db');
const jwt = require('jsonwebtoken');
const jwtsecret = process.env.JWTSECRET;

userRouter.post('/signup' , async(req,res)=>{
    let {username , password} = req.body;
    try{
        const data = await User.find({username});
        if(data.length==0) throw new Error();
        else{
            res.status(500).json({
                message : "username already exist...",
                success : false
            })
        }
    }catch(e){
        try{
            await User.create({username , password});
            res.status(200).json({
                message : "signup successfully..",
                success : true
            })
        }catch(e){
            res.status(500).json({
                message : "please enter valid data.",
                success : false
            })
        }
    }
})

userRouter.post('/signin', async(req,res)=>{
    let {username , password} = req.body;
    try{
        // console.log("username "+username)
        const data = await User.findOne({username , password});
        if(data==null) throw new Error();
        else{
            const token = jwt.sign(username,jwtsecret);
            res.status(200).json({
                message : "signin successfully..",
                success : true,
                token
            })
        }
    }catch(e){
        res.status(500).json({
            message : "please enter valid data.",
            success : false
        })
    }
})

userRouter.get('/', usermiddleware , async(req,res)=>{
    try{
        const username = req.username;
        const data = await User.findOne({username});
        res.status(200).json(data);
    }catch(e){
        res.status(500).json({
            message : "server err.",
            success : false
        })
    }
})

userRouter.get('/all', usermiddleware , async(req,res)=>{
    const username = req.username
    try{
        const data = await User.find();
        let users = [];
        data.forEach((u) =>{
            if(u.username!=username) users.push(u?.username);
        })
        res.status(200).json(users);
    }catch(e){
        res.status(500).json({
            message : "server error.",
            success : false
        })
    }
})

userRouter.post('/tranc', usermiddleware , async(req,res)=>{
    const {to,money} = req.body;
    const from = req.username

    const data = await User.find({username:from});

    if(data.balance < money){
        res.status(200).json({
            message : "doesn't have sufficient balance!",
            success : false
        })
    }else{
        const session = await mongoose.startSession();
        try{
            await session.withTransaction(async()=>{
                await User.findOneAndUpdate({username:from},{$inc:{balance : -money}});
                await User.findOneAndUpdate({username:to},{$inc:{balance : money}});
                await Transactions.create({from,to,money});
            })
            res.status(200).json({
                message : "Successfully Tranc...",
                success : true  
            })
        }catch(e){
            res.status(500).json({
                message : "Transaction failed..",
                success : false
            })
        }finally{
            session.endSession();
        }
    }
})

userRouter.get('/tranc/all', usermiddleware , async(req,res)=>{
    const from = req.username
    try{
        const data1 = await Transactions.find({from});
        const data2 = await Transactions.find({to:from});
        let data = [...data1,...data2];
        data.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
        res.status(200).json({data,username:from});
    }catch(e){
        res.status(500).json({
            message : "server error.",
            success : false
        })
    }   
})


userRouter.delete('/' , async(req,res)=>{
    try{
        await User.deleteMany();
        res.status(200).json({
            message:"delete successfully."
        })
    }catch(e){
        res.status(500).json({
            message : "server error.",
            success : false
        })
    }   
})


module.exports = {
    userRouter
}

