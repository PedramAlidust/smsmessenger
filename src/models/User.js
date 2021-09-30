const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    user_code: {
        type: String, 
        required: true
    }, 
    user_firstname: {
        type: String, 
        required: true
    },
    user_lastname: {
        type: String, 
        require: true
    }, 
    user_pass: {
        type: String,
        required: true
    },
    user_email: {
        type: String
    },

    employment_way: {
        type: String, 
        required: true
    },

    birthday: {
        type: String, 
        required: true
    },

    employment_date: {
        type: String, 
        required: true
    },

    department: {
        type: String, 
        required: true
    },

    user_active: {
        type: String,
        default: 'yes'
    },
  
    date: {
        type: Date,
        default: Date.now
    }
})


const Users = mongoose.model('users',  UserSchema)
module.exports = Users