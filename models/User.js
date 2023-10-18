const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.set('strictQuery', true);

const UserSchema = new Schema({
    fname:{
        type:String,
        required : true
    },
    lname:{
        type:String,
        required : true
    },
    email:{
        type : String,
        required : true,
    },
    password:{
        type : String,
        required : true,
    },
    number:{
        type : Number,
        required : true,
    },
    date:{
        type:Date,
        default : Date.now 
    }
})

const User = mongoose.model('users',UserSchema);
User.createIndexes();
module.exports = User;