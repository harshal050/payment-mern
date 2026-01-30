if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}
const mongoose = require('mongoose');
const url = process.env.MONGOURL;

mongoose.connect(url)
.then(()=>console.log("mongoose connnected.."))
.catch(e => console.log(e))

const schema = mongoose.Schema;

const userSchema = new schema({
    username : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    balance : {
        type : Number,
        default : 500
    }
})


const transactions = new schema(
    {
        from : {
            type : String,
            required : true
        },
        to : {
            type : String,
            required : true
        },
        money : {
            type : Number,
            required : true
        }
    },
    {
        timestamps : true 
    }
);

const blockedip = new schema(
    {
        ip : {
            type : String,
            required : true
        }
    },
    {
        timestamps : true
    }
)

const User = mongoose.model('user',userSchema);
const Transactions = mongoose.model('transactions',transactions);
const Blockedip = mongoose.model('blockedip',blockedip);


module.exports = {
    User,
    Transactions,
    Blockedip,
    mongoose
}

