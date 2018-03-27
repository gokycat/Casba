'use strict';

const util = require('../util')
const ibmdb = require('ibm_db');
require('dotenv').config({
  silent: true
});

const cn = "DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-lon02-01.services.eu-gb.bluemix.net;UID="+process.env.DASHDB_UID+";PWD="+process.env.DASHDB_PWD+";PORT=50000;PROTOCOL=TCPIP";

const beneficiary = {
  find: function (data, callback) {
    let beneficiaries = []
    ibmdb.open(cn,function(err,conn){
      // Check if user BVN or email or phone exist
      var stmt = conn.prepareSync("SELECT * FROM BENEFICIARIES WHERE ACCOUNT_NO_REF = ?");
      //Bind and Execute the statment asynchronously
      stmt.execute([Number(data.accountNo)], function (err, result) {
        if (err) {
          console.log(err)
          callback(null, beneficiaries);
          return conn.closeSync();
        }
        else {
          beneficiaries = result.fetchAllSync();
          callback(null, beneficiaries);
          result.closeSync();
        }
        stmt.closeSync();

        //Close the connection
        conn.close(function(err){});
      });
    });//close db authenticate query
  },

  findAccount: function (data, callback) {
    let beneficiaries = []
    ibmdb.open(cn,function(err,conn){
      // Check if user BVN or email or phone exist
      var stmt = conn.prepareSync("SELECT * FROM BENEFICIARIES WHERE ACCOUNT_NO = ?");
      //Bind and Execute the statment asynchronously
      stmt.execute([Number(data.accountNo)], function (err, result) {
        if (err) {
          console.log(err)
          callback(null, beneficiaries);
          return conn.closeSync();
        }
        else {
          beneficiaries = result.fetchAllSync();
          callback(null, beneficiaries);
          result.closeSync();
        }
        stmt.closeSync();

        //Close the connection
        conn.close(function(err){});
      });
    });//close db authenticate query
  },

  create: function (data, callback) {
    let beneficiaries = []
    ibmdb.open(cn,function(err,conn){
      conn.prepare("INSERT INTO BENEFICIARIES (ACCOUNT_NO, NAME, BANK_NAME, ACCOUNT_NO_REF, TOC) VALUES (?, ?, ?, ?, ?)", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        //Bind and Execute the statment asynchronously
        stmt.execute([Number(data.recipientNo), data.fullName, data.bankName, Number(data.accountNo), Date.now()], function (err, result) {
          if( err ) {
            console.log(err);
            beneficiaries[0] = {status:"Error"}
            callback(null, beneficiaries);
            return conn.closeSync();
          }
          else {
            beneficiaries[0] = {status:"Success"}
            callback(null, beneficiaries);
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
      let beneficiaries = []
      conn.prepare("UPDATE BENEFICIARIES SET " + data.key +" = ? WHERE ACCOUNT_NO = ?", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        if (data.key == "REF_ACCOUNT_NO") {
          //Bind and Execute the statment asynchronously
          stmt.execute([Number(data.value), data.phone], function (err, result) {
            if( err ) {
              console.log(err);
              beneficiaries[0] = {status:"Error"}
              callback(null, beneficiaries);
              return conn.closeSync();
            }
            else {
              beneficiaries[0] = {status:"Success"}
              callback(null, beneficiaries);
              result.closeSync();
            }
            //Close the connection
            conn.close(function(err){});
          });
        } else {
          //Bind and Execute the statment asynchronously
          stmt.execute([data.value, data.bvn], function (err, result) {
            if( err ) {
              console.log(err);
              beneficiaries[0] = {status:"Error"}
              callback(null, beneficiaries);
              return conn.closeSync();
            }
            else {
              beneficiaries[0] = {status:"Success"}
              callback(null, beneficiaries);
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
    let beneficiaries = []
    ibmdb.open(cn,function(err,conn){
      conn.prepare("DELETE FROM BENEFICIARIES WHERE ACCOUNT_NO = ?", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        //Bind and Execute the statment asynchronously
        stmt.execute([Number(data.bvn)], function (err, result) {
          if( err ) {
            console.log(err);
            beneficiaries[0] = {status:"Error"}
            callback(null, beneficiaries);
            return conn.closeSync();
          }
          else {
            beneficiaries[0] = {status:"Success"}
            callback(null, beneficiaries);
            result.closeSync();
          }

          //Close the connection
          conn.close(function(err){});
        });
      });
    });
  }

}

module.exports = beneficiary;
