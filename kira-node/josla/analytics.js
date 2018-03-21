'use strict';

const ibmdb = require('ibm_db');
const moment = require('moment');

require('dotenv').config({
  silent: true
});

const cn = "DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-lon02-01.services.eu-gb.bluemix.net;UID="+process.env.DASHDB_UID+";PWD="+process.env.DASHDB_PWD+";PORT=50000;PROTOCOL=TCPIP";

const merge = require('merge');


const sortByKey = function(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0)) * -1;
    });
}

const getTransactions = function(array1, array2){
  var arrayJoin = []

  for(var p=0;p<array1.length;p++){
    var keys1 = Object.keys(array1[0])
    var keys2 = Object.keys(array2[0])
    var keys = keys1.concat(keys2).filter(function(elem, pos) {
      return keys1.concat(keys2).indexOf(elem) == pos;
    })
    var doNotMatch1 = [];

    for(var i=0;i<keys.length;i++){
      if(keys1.indexOf(keys[i])==-1){doNotMatch1.push(keys[i]);}
    }

    for(var m=0;m<doNotMatch1.length;m++){
      array1[p][doNotMatch1[m]] = 'NA'
    }

    arrayJoin.push(array1[p])
  }

  for(var q=0;q<array2.length;q++){
    var keys1 = Object.keys(array1[0])
    var keys2 = Object.keys(array2[0])
    var keys = keys1.concat(keys2).filter(function(elem, pos) {
      return keys1.concat(keys2).indexOf(elem) == pos;
    })
    var doNotMatch2 = [];

    for(var j=0;j<keys.length;j++){
      if(keys2.indexOf(keys[j])==-1){doNotMatch2.push(keys[j]);}
    }

    for(var n=0;n<doNotMatch2.length;n++){
      array2[q][doNotMatch2[n]] = 'NA'
    }

    arrayJoin.push(array2[q])
  }

  return arrayJoin;
}



const analytics = {

  getTransactionBVN: function(userBVN, callback) {
    let transactions = [];
    let transfers = [];
    let topups = [];
    let payments = [];
    ibmdb.open(cn, function(err, conn){
      // blocks until the query is completed and all data has been acquired
      transfers = conn.querySync('SELECT * FROM FUND_TRANSFER WHERE FUND_TRANSFER.BVN = '+userBVN);
      topups = conn.querySync('SELECT * FROM AIRTIME_TOPUP WHERE AIRTIME_TOPUP.BVN = '+userBVN);
      payments = conn.querySync('SELECT * FROM BILL_PAYMENT WHERE BILL_PAYMENT.BVN = '+userBVN);



      if(transfers.length > 0){
        transactions = transfers
        if(topups.length > 0){
          transactions = getTransactions(transfers, topups)
          if(payments.length > 0){
            transactions = getTransactions(transactions, payments)
            transactions = sortByKey(transactions, 'TOC');
          }
        }
      }
      //add categories
      for(var i=0; i<transactions.length; i++) {
          if ("BILLER_NAME" in transactions[i]) {
          transactions[i].CATEGORY = 'Paid'
          }
          else if ("TELCO_NAME" in transactions[i]){
            transactions[i].CATEGORY = 'Recharged'
          }
          else if ("RECIPIENT_NO" in transactions[i]){
            transactions[i].CATEGORY = 'Transferred';
          }
        }

        console.log('=-=-=-=-=-=ANALYTICS-=-=-=-=-==-=-=');
        console.log(transactions);
      callback(null, transactions);
    });
  },

  getTransactionNo: function(accountNo, callback) {
    let transactions = [];
    let transfers = [];
    let topups = [];
    let payments = [];
    ibmdb.open(cn, function(err, conn){
      // blocks until the query is completed and all data has been acquired
      transfers = conn.querySync('SELECT * FROM FUND_TRANSFER WHERE FUND_TRANSFER.BVN = '+accountNo);
      topups = conn.querySync('SELECT * FROM AIRTIME_TOPUP WHERE AIRTIME_TOPUP.BVN = '+accountNo);
      payments = conn.querySync('SELECT * FROM BILL_PAYMENT WHERE BILL_PAYMENT.BVN = '+accountNo);


      if(transfers.length > 0){
        transactions = transfers
        if(topups.length > 0){
          transactions = getTransactions(transfers, topups)
          if(payments.length > 0){
            transactions = getTransactions(transactions, payments)
            transactions = sortByKey(transactions, 'TOC');
          }
        }
      }
      //add categories
      for(var i=0; i<transactions.length; i++) {
          if ("BILLER_NAME" in transactions[i]) {
          transactions[i].CATEGORY = 'Paid'
          }
          else if ("TELCO_NAME" in transactions[i]){
            transactions[i].CATEGORY = 'Recharged'
          }
          else if ("RECIPIENT_NO" in transactions[i]){
            transactions[i].CATEGORY = 'Transferred';
          }
        }

      callback(null, transactions);
    });
  },

  getTimeString: function(transactions, duration, interval, format) {
  var time = [];
  // this variable holds the date user wants to start analysis from
  var startDate = moment().subtract(duration, interval);

  //Formats
  //Day of week = 'Do'
  //Month = 'MMM'

  for(var i=0; i<transactions.length; i++) {
      if (startDate < transactions[i].TOC) {
        time.push(moment(Number(transactions[i].TOC)).format(format))
      }
    }
    return time;
  },

  getAmount: function(transactions, duration, interval){
  var amount = [];
  //this variable holds the date user wants to start analysis from
  var startDate = moment().subtract(duration, interval);

  for(var i=0; i<transactions.length; i++) {
      if (startDate < transactions[i].TOC) {
        amount.push(Number(transactions[i].AMOUNT))
      }
    }
    return amount;
  },

  getClassified: function(transactions){
    var bills = [];
    var airtime = [];
    var transfer = [];

    function add(array) {
      var sum = 0;
      for (var i = 0; i < array.length; i++) {
        sum += array[i]
      }
      return sum;
  }

    for(var i=0; i<transactions.length; i++) {
        if ("BILLER_NAME" in transactions[i]) {
          bills.push(Number(transactions[i].AMOUNT))
        }
        else if ("TELCO_NAME" in transactions[i]){
          airtime.push(Number(transactions[i].AMOUNT))
        }
        else if ("RECIPIENT_NO" in transactions[i]){
          transfer.push(Number(transactions[i].AMOUNT))
        }
      }
      bills = add(bills);
      airtime = add(airtime);
      transfer = add(transfer);

      return {
       bills: bills,
       airtime: airtime,
       transfer: transfer
      };
  }


};

module.exports = analytics;
