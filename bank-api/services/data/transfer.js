'use strict';

const util = require('../util')
const ibmdb = require('ibm_db');
require('dotenv').config({
  silent: true
});

const cn = "DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-lon02-01.services.eu-gb.bluemix.net;UID="+process.env.DASHDB_UID+";PWD="+process.env.DASHDB_PWD+";PORT=50000;PROTOCOL=TCPIP";

const transfer = {
  find: function (data, callback) {
    let transfers = []

    ibmdb.open(cn, function(err, conn){
      // blocks until the query is completed and all data has been acquired
      transfers = conn.querySync('SELECT * FROM FUND_TRANSFER WHERE SESSION = ' + data.session);

      callback(null, transfers);
    });
  },

  findBVN: function (data, callback) {
    let transfers = []

    ibmdb.open(cn, function(err, conn){
      // blocks until the query is completed and all data has been acquired
      transfers = conn.querySync('SELECT * FROM FUND_TRANSFER WHERE BVN = ' + data.bvn);

      callback(null, transfers);
    });
  },

  findAccount: function (data, callback) {
    let transfers = []

    ibmdb.open(cn, function(err, conn){
      // blocks until the query is completed and all data has been acquired
      transfers = conn.querySync('SELECT * FROM FUND_TRANSFER WHERE ACCOUNT_NO = ' + data.accountNo);

      callback(null, transfers);
    });
  },

  findCard: function (data, callback) {
    let transfers = []

    ibmdb.open(cn, function(err, conn){
      // blocks until the query is completed and all data has been acquired
      transfers = conn.querySync('SELECT * FROM FUND_TRANSFER WHERE CARD_NO = ' + data.cardNo);

      callback(null, transfers);
    });
  },

  create: function (data, callback) {
    let transfers = [];
    ibmdb.open(cn,function(err,conn){
      conn.prepare("INSERT INTO FUND_TRANSFER (ID, BVN, ACCOUNT_NO, RECIPIENT_NO, AMOUNT, SESSION, REFERENCE, ESACODE, PASSCODE, BANKIT, SWITCHIT, TOC) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }
        
        //Bind and Execute the statment asynchronously
        stmt.execute([Number((Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)), Number(data.bvn), Number(data.accountNo), Number(data.recipientNo), data.amount, Number(data.session), Number(data.reference), Number(data.esacode), 123456, data.bankIT, data.switchIT, Date.now()], function (err, result) {
          if ( err ) {
            console.log(err);
            transfers[0] = {status:"Error"}
            callback(null, transfers);
            return conn.closeSync();
          }
          else {
            transfers[0] = {status:"Success"}
            callback(null, transfers);
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
      let transfers = []
      conn.prepare("UPDATE FUND_TRANSFER SET " + data.key +" = ? WHERE SESSION = ?", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        if (data.key == "AMOUNT" || data.key == "BANKIT" || data.key == "SWITCHIT") {
          //Bind and Execute the statment asynchronously
          stmt.execute([data.value, Number(data.session)], function (err, result) {
            if( err ) {
              console.log(err);
              transfers[0] = {status:"Error"}
              callback(null, transfers);
              return conn.closeSync();
            }
            else {
              transfers[0] = {status:"Success"}
              callback(null, transfers);
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
              transfers[0] = {status:"Error"}
              callback(null, transfers);
              return conn.closeSync();
            }
            else {
              transfers[0] = {status:"Success"}
              callback(null, transfers);
              result.closeSync();
            }
          });
        }
      });
    });
  },

  remove: function (data, callback) {
    let transfers = [];
    ibmdb.open(cn,function(err,conn) {
      conn.prepare("DELETE FROM FUND_TRANSFER WHERE SESSION = ?", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        //Bind and Execute the statment asynchronously
        stmt.execute([Number(data.session)], function (err, result) {
          if( err ) {
            console.log(err);
            transfers[0] = {status:"Error"}
            callback(null, transfers);
            return conn.closeSync();
          }
          else {
            transfers[0] = {status:"Success"}
            callback(null, transfers);
            result.closeSync();
          }

          //Close the connection
          conn.close(function(err){});
        });
      });
    });
  }

}

module.exports = transfer;
