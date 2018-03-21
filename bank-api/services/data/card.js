'use strict';

const util = require('../util')
const ibmdb = require('ibm_db');
require('dotenv').config({
  silent: true
});

const cn = "DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-lon02-01.services.eu-gb.bluemix.net;UID="+process.env.DASHDB_UID+";PWD="+process.env.DASHDB_PWD+";PORT=50000;PROTOCOL=TCPIP";

const card = {
  find: function (data, callback) {
    let cards = []

    ibmdb.open(cn, function(err, conn){
      // blocks until the query is completed and all data has been acquired
      cards = conn.querySync('SELECT * FROM CARDS LEFT JOIN CARD_TYPE ON CARDS.TYPE_ID=CARD_TYPE.TYPE_ID LEFT JOIN ISSUERS ON CARDS.ISSUER_ID=ISSUERS.ISSUER_ID WHERE CARD_NO = '+data.cardNo);

      if(cards.length > 0){
        for (let i = 0; i < cards.length; i++) {
          cards[i].CARD_NO = cards[i].CARD_NO.slice(-4);
        }
      }

      callback(null, cards);
    });
  },

  findBVN: function (data, callback) {
    let cards = []

    ibmdb.open(cn, function(err, conn){
      // blocks until the query is completed and all data has been acquired
      cards = conn.querySync('SELECT * FROM CARDS LEFT JOIN CARD_TYPE ON CARDS.TYPE_ID=CARD_TYPE.TYPE_ID LEFT JOIN ISSUERS ON CARDS.ISSUER_ID=ISSUERS.ISSUER_ID WHERE BVN = '+data.bvn);

      if(cards.length > 0){
        for (let i = 0; i < cards.length; i++) {
          cards[i].CARD_NO = cards[i].CARD_NO.slice(-4);
        }
      }

      callback(null, cards);
    });
  },

  findAccount: function (data, callback) {
    let cards = []

    ibmdb.open(cn, function(err, conn){
      // blocks until the query is completed and all data has been acquired
      cards = conn.querySync('SELECT * FROM CARDS LEFT JOIN CARD_TYPE ON CARDS.TYPE_ID=CARD_TYPE.TYPE_ID LEFT JOIN ISSUERS ON CARDS.ISSUER_ID=ISSUERS.ISSUER_ID WHERE ACCOUNT_NO = '+data.accountNo);

      if(cards.length > 0){
        for (let i = 0; i < cards.length; i++) {
          cards[i].CARD_NO = cards[i].CARD_NO.slice(-4);
        }
      }

      callback(null, cards);
    });
  },

  create: function (data, callback) {
    let cards = [];
    ibmdb.open(cn,function(err,conn){
      conn.prepare("INSERT INTO CARDS (CARD_NO, BVN, ACCOUNT_NO, ISSUER_ID, TYPE_ID, EXPIRY_MONTH, EXPIRY_YEAR, TOC) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        //Bind and Execute the statment asynchronously
        stmt.execute([Number(data.cardNo), data.bvn, Number(data.accountNo), util.getCardIssuerID(data.cardBrand), util.getCardTypeID(data.cardType), data.expiryMonth, data.expiryYear, Date.now()], function (err, result) {
          if( err ) {
            console.log(err);
            cards[0] = {status:"Error"}
            callback(null, cards);
            return conn.closeSync();
          }
          else {
            cards[0] = {status:"Success"}
            callback(null, cards);
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
      let cards = []
      conn.prepare("UPDATE CARDS SET " + data.key +" = ? WHERE CARD_NO = ?", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        if (data.key == "EXPIRY_MONTH" || data.key == "EXPIRY_YEAR") {
          //Bind and Execute the statment asynchronously
          stmt.execute([data.value, Number(data.cardNo)], function (err, result) {
            if( err ) {
              console.log(err);
              cards[0] = {status:"Error"}
              callback(null, cards);
              return conn.closeSync();
            }
            else {
              cards[0] = {status:"Success"}
              callback(null, cards);
              result.closeSync();
            }
            //Close the connection
            conn.close(function(err){});
          });
        } else {
          //Bind and Execute the statment asynchronously
          stmt.execute([Number(data.value), Number(data.cardNo)], function (err, result) {
            if( err ) {
              console.log(err);
              cards[0] = {status:"Error"}
              callback(null, cards);
              return conn.closeSync();
            }
            else {
              cards[0] = {status:"Success"}
              callback(null, cards);
              result.closeSync();
            }
            //Close the connection
            conn.close(function(err){});
          });
        }
      });
    });
  },

  remove: function (data, callback) {
    let cards = [];
    ibmdb.open(cn,function(err,conn) {
      conn.prepare("DELETE FROM CARDS WHERE CARD_NO = ?", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        //Bind and Execute the statment asynchronously
        stmt.execute([data.cardNo], function (err, result) {
          if( err ) {
            console.log(err);
            cards[0] = {status:"Error"}
            callback(null, cards);
            return conn.closeSync();
          }
          else {
            cards[0] = {status:"Success"}
            callback(null, cards);
            result.closeSync();
          }

          //Close the connection
          conn.close(function(err){});
        });
      });
    });
  },

  removeAccount: function (data, callback) {
    let cards = [];
    ibmdb.open(cn,function(err,conn) {
      conn.prepare("DELETE FROM CARDS WHERE ACCOUNT_NO = ?", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        //Bind and Execute the statment asynchronously
        stmt.execute([data.accountNo], function (err, result) {
          if( err ) {
            console.log(err);
            cards[0] = {status:"Error"}
            callback(null, cards);
            return conn.closeSync();
          }
          else {
            cards[0] = {status:"Success"}
            callback(null, cards);
            result.closeSync();
          }

          //Close the connection
          conn.close(function(err){});
        });
      });
    });
  }

}

module.exports = card;
