const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.set('strictQuery', true);

const UserSchema = new Schema({
    email:{
        type : String,
        required : true,
    },
    filename: {
        type : String,
        required : true,
        // unique : true,
    },
    filepath: {
        type : String,
        required : true,
    },
    type : {
        type : String,
        required : true,
    },
    date:{
        type:Date,
        default : Date.now 
    }
})

const Photos = mongoose.model('photos',UserSchema);
Photos.createIndexes();
module.exports = Photos;