const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    NameTitle: {
        type: String
    }, 
    CustomerName: {
        type: String, 
        required: true
    },
    CustomerCode: {
        type: String, 
        require: true
    }, 
    Email: {
        type: String
    },
    Mobile: {
        type: String, 
        require: true
    },

    CreationDate: {
        type: String, 
        required: true
    },
  
    date: {
        type: Date,
        default: Date.now
    }
})


const Customers = mongoose.model('Customers',  UserSchema)
module.exports = Customers