'use strict';

const util = require('../util')
const ibmdb = require('ibm_db');
require('dotenv').config({
  silent: true
});

const cn = "DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-lon02-01.services.eu-gb.bluemix.net;UID="+process.env.DASHDB_UID+";PWD="+process.env.DASHDB_PWD+";PORT=50000;PROTOCOL=TCPIP";

const transaction = {
  findBVN: function (data, callback) {
    let transactions = [];
    let transfers = [];
    let topups = [];
    let payments = [];

    ibmdb.open(cn, function(err, conn){
      // blocks until the query is completed and all data has been acquired
      transfers = conn.querySync('SELECT * FROM FUND_TRANSFER WHERE BVN = '+data.bvn);
      topups = conn.querySync('SELECT * FROM AIRTIME_TOPUP WHERE BVN = '+data.bvn);
      payments = conn.querySync('SELECT * FROM BILL_PAYMENT WHERE BVN = '+data.bvn);



      if(transfers.length > 0){
        transactions = transfers
        if(topups.length > 0){
          transactions = util.getTransactions(transfers, topups)
          if(payments.length > 0){
            transactions = util.getTransactions(transactions, payments)
            transactions = util.sortByKey(transactions, 'TOC');
            if (transactions.length > 5) {
              transactions = transactions.slice(0, 5);
            }
            // add categories
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
          }
        }
      }
    });
  },

  findAccount: function (data, callback) {
    let transactions = [];
    let transfers = [];
    let topups = [];
    let payments = [];

    ibmdb.open(cn, function(err, conn){
      // blocks until the query is completed and all data has been acquired
      transfers = conn.querySync('SELECT * FROM FUND_TRANSFER WHERE ACCOUNT_NO = '+data.accountNo);
      topups = conn.querySync('SELECT * FROM AIRTIME_TOPUP WHERE ACCOUNT_NO = '+data.accountNo);
      payments = conn.querySync('SELECT * FROM BILL_PAYMENT WHERE ACCOUNT_NO = '+data.accountNo);



      if(transfers.length > 0){
        transactions = transfers
        if(topups.length > 0){
          transactions = util.getTransactions(transfers, topups)
          if(payments.length > 0){
            transactions = util.getTransactions(transactions, payments)
            transactions = util.sortByKey(transactions, 'TOC');
            transactions = transactions.slice(0, 5);
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

  findCard: function (data, callback) {
    let transactions = [];
    let transfers = [];
    let topups = [];
    let payments = [];

    ibmdb.open(cn, function(err, conn){
      // blocks until the query is completed and all data has been acquired
      transfers = conn.querySync('SELECT * FROM FUND_TRANSFER WHERE CARD_NO = '+data.cardNo);
      topups = conn.querySync('SELECT * FROM AIRTIME_TOPUP WHERE CARD_NO = '+data.cardNo);
      payments = conn.querySync('SELECT * FROM BILL_PAYMENT WHERE CARD_NO = '+data.cardNo);



      if(transfers.length > 0){
        transactions = transfers
        if(topups.length > 0){
          transactions = util.getTransactions(transfers, topups)
          if(payments.length > 0){
            transactions = util.getTransactions(transactions, payments)
            transactions = util.sortByKey(transactions, 'TOC');
            transactions = transactions.slice(0, 5);
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
  }

}

module.exports = transaction;
