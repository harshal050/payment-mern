const express = require('express');
const app = express();
const {userRouter} = require('./routers/userRouter');
const {ipRouter} = require('./routers/ipRouter');
const {ipmiddleware} = require('./middleware/ipmiddleware')
const cors = require('cors');
const PORT = 3001;

if (typeof global.RequestCnt === 'undefined') {
  global.RequestCnt = 0;
}

setInterval(()=>{
    global.RequestCnt=0;
},3000)

app.use(cors());
app.use(express.json());

app.use('/user',userRouter);
app.use('/ip', ipRouter);

app.listen(PORT,()=>{
    console.log("server is listen on port "+PORT);
})