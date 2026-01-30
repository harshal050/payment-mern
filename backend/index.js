
const express = require('express');
const app = express();
const {userRouter} = require('./routers/userRouter');
const {ipRouter} = require('./routers/ipRouter');
const {ipmiddleware} = require('./middleware/ipmiddleware')
const cors = require('cors');
const PORT = process.env.PORT || 3001;

if (typeof global.RequestCnt === 'undefined') {
  global.RequestCnt = 0;
}

setInterval(()=>{
    global.RequestCnt=0;
},1000)

app.use(cors({origin:"*", credentials:true}));
app.use(express.json());

app.use(ipmiddleware);

app.use('/api/user',userRouter);
app.use('/api/ip', ipRouter);

app.use((req,res,next)=>{
    res.status(400).json({
        message : "404 not found"
    });
})

app.listen(PORT,()=>{
    console.log("server is listen on port "+PORT);
})


module.exports = app;