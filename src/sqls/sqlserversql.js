const sql = require('mssql')
//require nodejs cron
const cron =  require('node-cron')
//Get Sql config
const config = require('../config/sqlserverconf')

sql.on('error', err => {
      // error handler 
      console.log(err)
  })

    //Get all staff information 
     staffresult = sql
     .connect(config)
     .then(pool => {return pool.request()
     .query('SELECT * FROM your tabele name')}).then(result => {   
           return result.recordsets
       }).catch(err => {
           console.log(err)
       })
       
     //Get all customers information   
        CustomerResult = sql
       .connect(config)
       .then(pool => {return pool.request()
       .query('select * from your tabele name')}).then(result => {   
             return result.recordsets
         }).catch(err => {
             console.log(err)
         })

     //Get all invoices information
        InvoicesResult = sql
       .connect(config)
       .then(pool => {return pool.request()
       .query("select * from your tabele name")}).then(result => {   
           return result.recordsets
       }).catch(err => {
           console.log(err)
       })
       
     //Get all checkes information  
        AllCheque = sql
       .connect(config)
       .then(pool => {return pool.request()
       .query("select * from your tabele name")}).then(result => {   
           return result.recordsets
       }).catch(err => {
           console.log(err)
       })
   

  module.exports = { 
    staffresult:  staffresult,
    CustomerResult: CustomerResult, 
    InvoicesResult: InvoicesResult, 
    AllCheque: AllCheque, 
    TestInvoice: TestInvoice, 
    CustomerTest: CustomerTest
    }











