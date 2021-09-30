const express = require('express')
const router = express.Router()
//Get Staff data
const {staffresult, CustomerResult, InvoicesResult, AllCheque, TestInvoice, CustomerTest} = require('../sqls/sqlserversql')

//Define test routing 
router.get('/api/TestInvoice', (req, res) => {
    TestInvoice.then(function(result) {
          res.send(result)         
       })
    })

//Define CustomerTest routing    
router.get('/api/CustomerTest', (req, res) => {
    CustomerTest.then(function(result) {
          res.send(result)         
       })
    })

//Define express routing
router.get('/api/staff', (req, res) => {
    staffresult.then(function(result) {
          res.send(result)         
       })
    })

//Define rout for all customers
router.get('/api/customers', (req, res) => {
    CustomerResult.then((result) => {
        res.send(result)
    })
})


//Define rout for all invoices
router.get('/api/invoices', (req, res) => {
    InvoicesResult.then((result) => {
        res.send(result)
    })
}) 

//Define rout for all cheque
router.get('/api/cheque', (req, res) => {
    AllCheque.then((result) => {
        res.send(result)
    })
})


module.exports = router
    