'use strict';

const util = require('../util')
const ibmdb = require('ibm_db');
require('dotenv').config({
  silent: true
});

const cn = "DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-lon02-01.services.eu-gb.bluemix.net;UID="+process.env.DASHDB_UID+";PWD="+process.env.DASHDB_PWD+";PORT=50000;PROTOCOL=TCPIP";

const account = {
  find: function (data, callback) {
    let accounts = []
    let cards = []

    ibmdb.open(cn, function(err, conn){
      // blocks until the query is completed and all data has been acquired
      accounts = conn.querySync('SELECT * FROM ACCOUNTS LEFT JOIN BANKS ON ACCOUNTS.BANK_ID=BANKS.BANK_ID LEFT JOIN ACCOUNT_TYPE ON ACCOUNTS.TYPE_ID=ACCOUNT_TYPE.TYPE_ID WHERE ACCOUNT_NO = '+Number(data.accountNo));
      cards = conn.querySync('SELECT * FROM CARDS LEFT JOIN CARD_TYPE ON CARDS.TYPE_ID=CARD_TYPE.TYPE_ID LEFT JOIN ISSUERS ON CARDS.ISSUER_ID=ISSUERS.ISSUER_ID WHERE ACCOUNT_NO = '+Number(data.accountNo));

      if(accounts.length > 0){
        if(cards.length > 0){
          for (let i = 0; i < cards.length; i++) {
            cards[i].CARD_NO = cards[i].CARD_NO.slice(-4);
          }
          accounts = util.getAccountCard(accounts, cards)
        }
      }

      callback(null, accounts);
    });
  },

  findBVN: function (data, callback) {
    let accounts = []
    let cards = []

    ibmdb.open(cn, function(err, conn){
      // blocks until the query is completed and all data has been acquired
      accounts = conn.querySync('SELECT * FROM ACCOUNTS LEFT JOIN BANKS ON ACCOUNTS.BANK_ID=BANKS.BANK_ID LEFT JOIN ACCOUNT_TYPE ON ACCOUNTS.TYPE_ID=ACCOUNT_TYPE.TYPE_ID WHERE BVN = '+Number(data.bvn));
      cards = conn.querySync('SELECT * FROM CARDS LEFT JOIN CARD_TYPE ON CARDS.TYPE_ID=CARD_TYPE.TYPE_ID LEFT JOIN ISSUERS ON CARDS.ISSUER_ID=ISSUERS.ISSUER_ID WHERE BVN= '+Number(data.bvn));

      if(accounts.length > 0){
        if(cards.length > 0){
          for (let i = 0; i < cards.length; i++) {
            cards[i].CARD_NO = cards[i].CARD_NO.slice(-4);
          }
          accounts = util.getAccountCard(accounts, cards)
        }
      }

      callback(null, accounts);
    });
  },

  create: function (data, callback) {
    let accounts = [];
    ibmdb.open(cn,function(err,conn){
      conn.prepare("INSERT INTO ACCOUNTS (ACCOUNT_NO, BANK_ID, BVN, TYPE_ID, SPEND, DESCRIPTION, TOC) VALUES (?, ?, ?, ?, ?, ?, ?)", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        //Bind and Execute the statment asynchronously
        stmt.execute([Number(data.accountNo), util.getBankID(data.bankName), Number(data.bvn), util.getAccountTypeID(data.accountType), 0, '', Date.now()], function (err, result) {
          if ( err ) {
            console.log(err);
            accounts[0] = {status:"Error"}
            callback(null, accounts);
            return conn.closeSync();
          }
          else {
            accounts[0] = {status:"Success"}
            callback(null, accounts);
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
      let accounts = []
      conn.prepare("UPDATE ACCOUNTS SET " + data.key +" = ? WHERE ACCOUNT_NO = ?", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        if (data.key == "DESCRIPTION") {
          //Bind and Execute the statment asynchronously
          stmt.execute([data.value, Number(data.accountNo)], function (err, result) {
            if( err ) {
              console.log(err);
              accounts[0] = {status:"Error"}
              callback(null, accounts);
              return conn.closeSync();
            }
            else {
              accounts[0] = {status:"Success"}
              callback(null, accounts);
              result.closeSync();
            }
            //Close the connection
            conn.close(function(err){});
          });
        } else {
          //Bind and Execute the statment asynchronously
          stmt.execute([Number(data.value), Number(data.accountNo)], function (err, result) {
            if( err ) {
              console.log(err);
              accounts[0] = {status:"Error"}
              callback(null, accounts);
              return conn.closeSync();
            }
            else {
              accounts[0] = {status:"Success"}
              callback(null, accounts);
              result.closeSync();
            }
          });
        }
      });
    });
  },

  remove: function (data, callback) {
    let accounts = [];
    ibmdb.open(cn,function(err,conn) {
      conn.prepare("DELETE FROM ACCOUNTS WHERE ACCOUNT_NO = ?", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        //Bind and Execute the statment asynchronously
        stmt.execute([Number(data.accountNo)], function (err, result) {
          if( err ) {
            console.log(err);
            accounts[0] = {status:"Error"}
            callback(null, accounts);
            return conn.closeSync();
          }
          else {
            accounts[0] = {status:"Success"}
            callback(null, accounts);
            result.closeSync();
          }

          //Close the connection
          conn.close(function(err){});
        });
      });
    });
  }

}

module.exports = account;
