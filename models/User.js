const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.set('strictQuery', true);

const UserSchema = new Schema({
    name:{
        type:String,
        required : true
    },
    email:{
        type : String,
        required : true,
        unique : true,
    },
    password:{
        type : String,
        required : true,
    },
    date:{
        type:Date,
        default : Date.now 
    }
})

const User = mongoose.model('users',UserSchema);
User.createIndexes({email : 1});
module.exports = User;