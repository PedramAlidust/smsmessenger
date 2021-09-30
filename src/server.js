const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const parser = require("xml2json");
//require nodejs cron
const cron = require("node-cron");
//User models
const Users = require("../src/models/User");
const Invoices = require("../src/models/Invoices");
const Cheque = require("../src/models/Cheque");
const Messages = require("../src/models/Messages");
const Customers = require("./models/Customers");
//Get current date
const moment = require("moment");
const PersianDate = require("jalali-moment");
CurrentDate = moment().format("YYYY-MM-DD");

//Import sms config
const {
  NewCustomerMessage,
  CustomerVoiceText,
  NewInvoiceMessagePart1,
  NewInvoiceMessagepart2,
  NewInvoiceMessagepart3,
  NewInvoiceMessagepart4,
  NewInvoiceMessagepart5,
  DuedayMessagepart1,
  DuedayMessagepart2,
  DuedayMessagepart3,
  DuedayMessagepart4,
  DuedayMessagepart5,
} = require("./config/smsconfig");
//App
const app = express();
//Routs
app.use("/", require("./routs/api"));

//Bodyparser
app.use(express.urlencoded({ extended: false }));

//DB config
const db = require("./config/mongoconf").MongoURL;

//connect to Mongo
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB Connected ..."))
  .catch((err) => console.log(err));

//Get Api data
const {
  staffresult,
  CustomerResult,
  InvoicesResult,
  AllCheque,
  TestInvoice,
  CustomerTest
} = require("./sqls/sqlserversql");

//async function to run logic asyncrnuss
async function StoreData() {
  //use Customers record to send sms for new customer
  await Customers.find({ CreationDate: CurrentDate })
    .then((NewCustomer) => {
      NewCustomer.forEach((item) => {
        //escape NameTitle database values
        const NameTitle = escape(item.NameTitle);
        //escape CustomerName database value
        const CustomerName = escape(item.CustomerName);
        //escape CustomerCode database value
        const CustomerCode = escape(item.CustomerCode);
        //check database to mobile number existance
        Messages.find({
          Customer_Mobile: item.Mobile,
          message_type: "مشتری جدید",
        })
          .then((success) => {
            //check if sms sent to MobileNumber before or not
            if (success.length == 0) {
              //make a Get request to send sms
              axios
                .get(
                  `https://api.payamak-panel.com/post/Send.asmx/SendSimpleSMS?username=yourusername&password=yourpassword&to=${item.Mobile}&from=yournumber&text=${NameTitle} ${CustomerName} ${NewCustomerMessage} ${CustomerCode} ${CustomerVoiceText}&isflash=false`
                )
                .then((response) => {
                  //declere message status variable
                  var message_status;
                  //Get axios response / convert to javascript object using Xml2JsonParser
                  const SmsStatus = parser.toJson(response.data, {
                    object: true,
                  });
                  //check if sms sent succcess or not
                  if (
                    SmsStatus.ArrayOfString.string == 11 ||
                    SmsStatus.ArrayOfString.string == 7
                  ) {
                    message_status = "NotOk";
                  } else {
                    message_status = "Ok";
                  }
                  //save all sms data to database
                  const SendedMessage = new Messages({
                    messagetext: `${unescape(NameTitle)} ${unescape(
                      CustomerName
                    )} ${unescape(NewCustomerMessage)} ${unescape(
                      CustomerCode
                    )} ${unescape(CustomerVoiceText)}`,
                    Customer_Mobile: item.Mobile,
                    message_status: message_status,
                    message_response: SmsStatus.ArrayOfString.string,
                    message_type: "مشتری جدید",
                    sentmessage_date: CurrentDate,
                  });
                  //save sent message to database
                  SendedMessage.save()
                    .then((success) => {
                      console.log("new customer saved to database");
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });

  //use invoices records to send sms for new invoice
  await Invoices.find({ CreationDate: CurrentDate })
    .then((TodayInvoice) => {
      TodayInvoice.forEach((item) => {
        //escape NameTitle database values
        const NameTitle = escape(item.NameTitle);
        //escape CustomerName database value
        const CustomerName = escape(item.InvoiceCustomerName);
        //escape CustomerCode database value
        const InvoiceNumber = escape(item.InvoiceNumber);
        //escape Invoice Price
        const InvoicePrice = escape(item.InvoiceNetPrice);
        //escape Invoice Brocker name
        const InvoiceBrokerName = escape(item.InvoiceBrokerName);
        //escape Invoice Creation Date
        const InvoiceCreationDate = escape(
          PersianDate(item.CreationDate)
            .locale("fa")
            .format("YYYY-MM-DD")
        );
        //check database to mobile number existance
        Messages.find({
          Customer_Mobile: item.InvoiceCustomerMobile,
          message_type: "فاکتور جدید",
        })
          .then((success) => {
            //check if sms sent to MobileNumber before or not
            if (success.length == 0) {
              //make a Get request to send sms
              axios
                .get(
                  `https://api.payamak-panel.com/post/Send.asmx/SendSimpleSMS?username=yourusername&password=yourpassword&to=${
                    item.InvoiceCustomerMobile
                  }&from=yournumber&text=${NameTitle ??
                    "if exist"} ${CustomerName} ${NewInvoiceMessagePart1} ${InvoicePrice} ${NewInvoiceMessagepart2} ${InvoiceNumber} ${NewInvoiceMessagepart3} ${InvoiceCreationDate} ${NewInvoiceMessagepart4} ${InvoiceBrokerName} ${NewInvoiceMessagepart5}&isflash=false`
                )
                .then((response) => {
                  //declere message status variable
                  var message_status;
                  //Get axios response / convert to javascript object using Xml2JsonParser
                  const SmsStatus = parser.toJson(response.data, {
                    object: true,
                  });
                  //check if sms sent success or not
                  if (
                    SmsStatus.ArrayOfString.string == 11 ||
                    SmsStatus.ArrayOfString.string == 7
                  ) {
                    message_status = "NotOk";
                  } else {
                    message_status = "Ok";
                  }
                  //save sms data to database
                  const SendedMessage = new Messages({
                    messagetext: `${unescape(
                      NameTitle ?? "if exist"
                    )} ${unescape(CustomerName)} ${unescape(
                      NewInvoiceMessagePart1
                    )} ${unescape(InvoicePrice)} ${unescape(
                      NewInvoiceMessagepart2
                    )} ${unescape(InvoiceNumber)} ${unescape(
                      NewInvoiceMessagepart3
                    )} ${unescape(InvoiceCreationDate)} ${unescape(
                      NewInvoiceMessagepart4
                    )} ${unescape(InvoiceBrokerName)} ${unescape(
                      NewInvoiceMessagepart5
                    )}`,
                    Customer_Mobile: item.InvoiceCustomerMobile,
                    message_status: message_status,
                    message_response: SmsStatus.ArrayOfString.string,
                    message_type: "فاکتور جدید",
                    sentmessage_date: CurrentDate,
                  });
                  //save sent message to database
                  SendedMessage.save()
                    .then((success) => {
                      console.log("new invoice saved to database");
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });

  //use all cheques records to send sms for 3 days before dueday
  await Cheque.find({ dueday: { $ne: null } }) //check if dueday is not null in database
    .then((chequeresult) => {
      chequeresult.forEach((item) => {
        //escape NameTitle database values
        const NameTitle = escape(item.NameTitle);
        //escape CustomerName database value
        const CustomerName = escape(item.FullName);
        //escape CheckSerialNumber database value
        const CheckSerialNumber = escape(item.SerialNumber);
        //escape CheckAmount
        const CheckAmount = escape(item.Amount);
        //escape Invoice Bank name
        const CheckBankName = escape(item.BankName);
        //escape Invoice Creation Date
        const Dueday = escape(
          PersianDate(item.dueday)
            .locale("fa")
            .format("YYYY-MM-DD")
        );
        //find days diffrence
        const DateDiff = moment(item.dueday).diff(CurrentDate, "days");
        //check if days diffrence is equal to 3
        if (DateDiff == 3) {
          //check database to mobile number existance
          Messages.find({
            Customer_Mobile: item.Mobile,
            message_type: "سر رسید چک",
          })
            .then((success) => {
              //check if sms sent to MobileNumber before or not
              if (success.length == 0) {
                //make a Get request to send sms
                axios
                  .get(
                    `https://api.payamak-panel.com/post/Send.asmx/SendSimpleSMS?username=yourusername&password=yourpassword&to=${
                      item.Mobile
                    }&from=yournumber&text=${NameTitle ??
                      "if exist"} ${CustomerName} ${DuedayMessagepart1} ${CheckSerialNumber} ${DuedayMessagepart2} ${CheckBankName} ${DuedayMessagepart3} ${CheckAmount} ${DuedayMessagepart4} ${Dueday} ${DuedayMessagepart5}&isflash=false`
                  )
                  .then((response) => {
                    //declere message status variable
                    var message_status;
                    //Get axios response / convert to javascript object using Xml2JsonParser
                    const SmsStatus = parser.toJson(response.data, {
                      object: true,
                    });
                    //check if sms sent success or not
                    if (
                      SmsStatus.ArrayOfString.string == 11 ||
                      SmsStatus.ArrayOfString.string == 7
                    ) {
                      message_status = "NotOk";
                    } else {
                      message_status = "Ok";
                    }
                    //save all sms data to database
                    const SendedMessage = new Messages({
                      messagetext: `${unescape(
                        NameTitle ?? "if exist"
                      )} ${unescape(CustomerName)} ${unescape(
                        DuedayMessagepart1
                      )} ${unescape(CheckSerialNumber)} ${unescape(
                        DuedayMessagepart2
                      )} ${unescape(CheckBankName)} ${unescape(
                        DuedayMessagepart3
                      )} ${unescape(CheckAmount)} ${unescape(
                        DuedayMessagepart4
                      )} ${unescape(Dueday)} ${unescape(DuedayMessagepart5)}`,
                      Customer_Mobile: item.Mobile,
                      message_status: message_status,
                      message_response: SmsStatus.ArrayOfString.string,
                      message_type: "سر رسید چک",
                      sentmessage_date: CurrentDate,
                    });
                    //save sent message to database
                    SendedMessage.save()
                      .then((success) => {
                        console.log("new dueday message saved to database");
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } //end 3 days check if statment
      });
    })
    .catch((err) => {
      console.log(err);
    });

  //drop invoices collection to update data
  Invoices.collection.drop();
  //stote sms invoices to mongodb
  await TestInvoice.then((result) => {
    result[0].forEach((item) => {
      const newInvoice = new Invoices({
        NameTitle: item.NameTitle,
        InvoiceCustomerName: item.InvoiceCustomerName,
        InvoiceCustomerMobile: item.InvoiceCustomerMobile,
        InvoiceCustomerEmail: item.InvoiceCustomerEmail,
        InvoiceNumber: item.InvoiceNumber,
        invoicedate: item.invoicedate,
        CreationDate: item.CreationDate,
        InvoiceNetPrice: item.InvoiceNetPrice,
        InvoiceBrokerName: item.InvoiceBrokerName,
      });
      //save new invoice to database
      newInvoice
        .save()
        .then((success) => {
          console.log("invoice added");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }).catch((err) => {
    console.log(err);
  });

  //store sms Customers to database
  await CustomerTest.then((result) => {
    //drop Customers collection update data
    Customers.collection.drop();
    result[0].forEach((item) => {
      const NewCustomer = new Customers({
        NameTitle: item.NameTitle,
        CustomerName: item.CustomerName,
        CustomerCode: item.CustomerCode,
        Email: item.Email,
        Mobile: item.Mobile,
        CreationDate: item.CreationDate,
        date: item.date,
      });
      //save NewCustomer to database
      NewCustomer.save()
        .then((success) => {
          console.log("customers added");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }).catch((err) => {
    console.log(err);
  });


  //store Cheque to database
  await AllCheque.then((result) => {
    //drop cheque collection to update data
    Cheque.collection.drop();
    //store new data
    result[0].forEach((item) => {
      const NewCheque = new Cheque({
        NameTitle: item.NameTitle,
        FullName: item.FullName,
        Mobile: item.Mobile,
        Email: item.Email,
        SerialNumber: item.SerialNumber,
        Amount: item.Amount,
        BankName: item.Name,
        dueday: item.dueday,
      });
      //save AllCheque to database
      NewCheque.save()
        .then((success) => {
          console.log("checkes added");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
  

}

//Function to store and update sms database
StoreData();

app.listen(4000);
