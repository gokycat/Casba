'use strict';

const util = require('../util')
const ibmdb = require('ibm_db');
require('dotenv').config({
  silent: true
});

const cn = "DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-lon02-01.services.eu-gb.bluemix.net;UID="+process.env.DASHDB_UID+";PWD="+process.env.DASHDB_PWD+";PORT=50000;PROTOCOL=TCPIP";

const bank = {
  find: function (data, callback) {
    let banks = []
    ibmdb.open(cn,function(err,conn){
      // blocks until the query is completed and all data has been acquired
      banks = conn.querySync('SELECT * FROM BANKS');

      callback(null, banks);
    });
  }

}

module.exports = bank;
