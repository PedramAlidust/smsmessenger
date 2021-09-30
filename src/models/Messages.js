const mongoose = require('mongoose')
const message = new mongoose.Schema({
    messagetext: {
        type: String, 
        required: true
    }, 
    message_status: {
        type: String, 
        required: true
    },
    message_response: {
        type: String, 
        require: true
    }, 
    message_type: {
        type: String, 
        required: true
    },
    sentmessage_date: {
        type: String, 
        require: true
    },
    Customer_Mobile: {
        type: String, 
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Message = mongoose.model('Message',  message)
module.exports = Message