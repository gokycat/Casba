'use strict';

const util = require('../util')
const ibmdb = require('ibm_db');
require('dotenv').config({
  silent: true
});

const cn = "DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-lon02-01.services.eu-gb.bluemix.net;UID="+process.env.DASHDB_UID+";PWD="+process.env.DASHDB_PWD+";PORT=50000;PROTOCOL=TCPIP";

const accountType = {
  find: function (data, callback) {
    let accountTypes = []
    ibmdb.open(cn,function(err,conn){
      // blocks until the query is completed and all data has been acquired
      accountTypes = conn.querySync('SELECT * FROM ACCOUNT_TYPE');

      callback(null, accountTypes);
    });
  }

}

module.exports = accountType;
