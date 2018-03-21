'use strict';

const util = require('../util')
const ibmdb = require('ibm_db');
require('dotenv').config({
  silent: true
});

const cn = "DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-lon02-01.services.eu-gb.bluemix.net;UID="+process.env.DASHDB_UID+";PWD="+process.env.DASHDB_PWD+";PORT=50000;PROTOCOL=TCPIP";

const payment = {
  find: function (data, callback) {
    let payments = []

    ibmdb.open(cn, function(err, conn){
      // blocks until the query is completed and all data has been acquired
      payments = conn.querySync('SELECT * FROM BILL_PAYMENT WHERE SESSION = ' + data.session);

      callback(null, payments);
    });
  },

  findBVN: function (data, callback) {
    let payments = []

    ibmdb.open(cn, function(err, conn){
      // blocks until the query is completed and all data has been acquired
      payments = conn.querySync('SELECT * FROM BILL_PAYMENT WHERE BVN = ' + data.bvn);

      callback(null, payments);
    });
  },

  findAccount: function (data, callback) {
    let payments = []

    ibmdb.open(cn, function(err, conn){
      // blocks until the query is completed and all data has been acquired
      payments = conn.querySync('SELECT * FROM BILL_PAYMENT WHERE ACCOUNT_NO = ' + data.accountNo);

      callback(null, payments);
    });
  },

  findCard: function (data, callback) {
    let payments = []

    ibmdb.open(cn, function(err, conn){
      // blocks until the query is completed and all data has been acquired
      payments = conn.querySync('SELECT * FROM BILL_PAYMENT WHERE WHERE CARD_NO = ' + data.cardNo);

      callback(null, payments);
    });
  },

  create: function (data, callback) {
    let payments = [];
    ibmdb.open(cn,function(err,conn){
      conn.prepare("INSERT INTO BILL_PAYMENT (ID, BVN, ACCOUNT_NO, BILLER_NAME, PACKAGE_NAME, AMOUNT, SESSION, REFERENCE, ESACODE, PASSCODE, BANKIT, SWITCHIT, TOC) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }
        console.log(data)
        //Bind and Execute the statment asynchronously
        stmt.execute([Number((Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)), Number(data.bvn), Number(data.accountNo), data.billerName, data.packageName, data.amount, Number(data.session), Number(data.reference), Number(data.esacode), 123456, data.bankIT, data.switchIT, Date.now()], function (err, result) {
          if ( err ) {
            console.log(err);
            payments[0] = {status:"Error"}
            callback(null, payments);
            return conn.closeSync();
          }
          else {
            payments[0] = {status:"Success"}
            callback(null, payments);
            result.closeSync();
          }

          //Close the connection
          conn.close(function(err){});
        });
      });
    });
  },

  update: function (data, callback) {
    ibmdb.open(cn,function(err,conn){
      let topups = []
      conn.prepare("UPDATE BILL_PAYMENT SET " + data.key +" = ? WHERE SESSION = ?", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        if (data.key == "BILLER_NAME" || data.key == "PACKAGE_NAME" || data.key == "AMOUNT" || data.key == "BANKIT" || data.key == "SWITCHIT") {
          //Bind and Execute the statment asynchronously
          stmt.execute([data.value, Number(data.session)], function (err, result) {
            if( err ) {
              console.log(err);
              topups[0] = {status:"Error"}
              callback(null, topups);
              return conn.closeSync();
            }
            else {
              topups[0] = {status:"Success"}
              callback(null, topups);
              result.closeSync();
            }
            //Close the connection
            conn.close(function(err){});
          });
        } else {
          //Bind and Execute the statment asynchronously
          stmt.execute([Number(data.value), data.session], function (err, result) {
            if( err ) {
              console.log(err);
              topups[0] = {status:"Error"}
              callback(null, topups);
              return conn.closeSync();
            }
            else {
              topups[0] = {status:"Success"}
              callback(null, topups);
              result.closeSync();
            }
          });
        }
      });
    });
  },

  remove: function (data, callback) {
    let topups = [];
    ibmdb.open(cn,function(err,conn) {
      conn.prepare("DELETE FROM BILL_PAYMENT WHERE SESSION = ?", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        //Bind and Execute the statment asynchronously
        stmt.execute([Number(data.session)], function (err, result) {
          if( err ) {
            console.log(err);
            topups[0] = {status:"Error"}
            callback(null, topups);
            return conn.closeSync();
          }
          else {
            topups[0] = {status:"Success"}
            callback(null, topups);
            result.closeSync();
          }

          //Close the connection
          conn.close(function(err){});
        });
      });
    });
  }

}

module.exports = payment;
