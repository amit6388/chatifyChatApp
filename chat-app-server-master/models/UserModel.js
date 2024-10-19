const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
    unique:true
  },
  mobile: {
    type: "number",
    required: true,
  },
  password:{
    type:"string",
    required :true
  }
});
const UserModel = mongoose.model('user',userSchema)

module.exports =  UserModel
