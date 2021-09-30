const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    NameTitle: {
        type: String
    }, 
    FullName: {
        type: String, 
        required: true
    },
    Mobile: {
        type: String, 
        require: true
    }, 
    Email: {
        type: String
    },
    SerialNumber: {
        type: String, 
        require: true
    },

    Amount: {
        type: String, 
        required: true
    },

    BankName: {
        type: String, 
        require: true
    },

    dueday: {
        type: String, 
        require: true
    },
  
    date: {
        type: Date,
        default: Date.now
    }
})


const Cheque = mongoose.model('Cheque',  UserSchema)
module.exports = Cheque