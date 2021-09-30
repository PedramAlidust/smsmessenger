const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    NameTitle: {
        type: String
    }, 
    InvoiceCustomerName: {
        type: String, 
        required: true
    },
    InvoiceCustomerMobile: {
        type: String, 
        require: true
    }, 
    InvoiceCustomerEmail: {
        type: String
    },
    InvoiceNumber: {
        type: String
    },

    CreationDate: {
        type: String, 
        required: true
    },

    invoicedate: {
        type: String, 
        required: true
    },

    InvoiceNetPrice: {
        type: String, 
        required: true
    },

    InvoiceBrokerName: {
        type: String, 
        required: true
    },
  
    date: {
        type: Date,
        default: Date.now
    }
})


const Invoices = mongoose.model('Invoices',  UserSchema)
module.exports = Invoices