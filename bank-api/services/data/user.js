'use strict';

const util = require('../util')
const ibmdb = require('ibm_db');
require('dotenv').config({
  silent: true
});

const cn = "DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-lon02-01.services.eu-gb.bluemix.net;UID="+process.env.DASHDB_UID+";PWD="+process.env.DASHDB_PWD+";PORT=50000;PROTOCOL=TCPIP";

const user = {
  find: function (data, callback) {
    let user = []
    ibmdb.open(cn,function(err,conn){
      // Check if user BVN or email or phone exist
      var stmt = conn.prepareSync("SELECT * FROM USERS LEFT JOIN STATUS ON USERS.STATUS_ID=STATUS.STATUS_ID WHERE PHONE = ?");
      //Bind and Execute the statment asynchronously
      stmt.execute([data.phone], function (err, result) {
        if (err) {
          console.log(err)
          callback(null, user);
          return conn.closeSync();
        }
        else {
          user = result.fetchAllSync();
          callback(null, user);
          result.closeSync();
        }
        stmt.closeSync();

        //Close the connection
        conn.close(function(err){});
      });
    });//close db authenticate query
  },

  create: function (data, callback) {
    let user = []
    ibmdb.open(cn,function(err,conn){
      conn.prepare("INSERT INTO USERS (BVN, EMAIL, PHONE, FIRST_NAME, MIDDLE_NAME, LAST_NAME, DATE_OF_BIRTH, STATUS_ID, PASSWORD, HASH, TOC) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        //Bind and Execute the statment asynchronously
        stmt.execute([Number(data.bvn), data.email, data.phone, data.first_name, data.middle_name, data.last_name, data.dob, util.getStatusID(data.status), data.password, data.hash, Date.now()], function (err, result) {
          if( err ) {
            console.log(err);
            user[0] = {status:"Error"}
            callback(null, user);
            return conn.closeSync();
          }
          else {
            user[0] = {status:"Success"}
            callback(null, user);
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
      let user = []
      conn.prepare("UPDATE USERS SET " + data.key +" = ? WHERE PHONE = ?", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        if (data.key == "BVN" || data.key == "STATUS_ID" || data.key == "TOC" || data.key == "LAST_SIGNIN") {
          //Bind and Execute the statment asynchronously
          stmt.execute([Number(data.value), data.phone], function (err, result) {
            if( err ) {
              console.log(err);
              user[0] = {status:"Error"}
              callback(null, user);
              return conn.closeSync();
            }
            else {
              user[0] = {status:"Success"}
              callback(null, user);
              result.closeSync();
            }
            //Close the connection
            conn.close(function(err){});
          });
        } else {
          //Bind and Execute the statment asynchronously
          stmt.execute([data.value, data.bvn], function (err, result) {
            if( err ) console.log(err);
            else result.closeSync();
            //Close the connection
            conn.close(function(err){});
          });
        }
      });
    });
  },

  remove: function (data, callback) {
    let user = []
    ibmdb.open(cn,function(err,conn){
      conn.prepare("DELETE FROM USERS WHERE BVN = ?", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        //Bind and Execute the statment asynchronously
        stmt.execute([Number(data.bvn)], function (err, result) {
          if( err ) {
            console.log(err);
            user[0] = {status:"Error"}
            callback(null, user);
            return conn.closeSync();
          }
          else {
            user[0] = {status:"Success"}
            callback(null, user);
            result.closeSync();
          }

          //Close the connection
          conn.close(function(err){});
        });
      });
    });
  }

}

module.exports = user;
