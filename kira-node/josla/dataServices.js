'use strict';

const ibmdb = require('ibm_db');
const moment = require('moment');

require('dotenv').config({
  silent: true
});

const cn = "DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-lon02-01.services.eu-gb.bluemix.net;UID="+process.env.DASHDB_UID+";PWD="+process.env.DASHDB_PWD+";PORT=50000;PROTOCOL=TCPIP";

const merge = require('merge');

const getAccountCard = function (array1, array2) {
  const arrayJoin = [];
  for (var i=0; i<array1.length;  i++) {
    for (var j=0; j<array2.length; j++) {
      if(array1[i].ACCOUNT_NO == array2[j].ACCOUNT_NO) {
        arrayJoin[i] = merge(array1[i], array2[j]);
      } else {
        arrayJoin[i] = array1[i];
      }
    }
  }
  return arrayJoin;
};

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

const sortByKey = function(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0)) * -1;
    });
}

const getClassified = function(transactions){
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

const getBankID = function(bank_name){
  if('access' == bank_name) {
    return 3;
  } else if('zenith' == bank_name) {
    return 5;
  } else if('stanbic' == bank_name) {
    return 19;
  } else if('standard' == bank_name) {
    return 20;
  } else if('heritage' == bank_name) {
    return 16;
  } else if('diamond' == bank_name) {
    return 15;
  } else if('keystone' == bank_name) {
    return 14;
  } else if('union' == bank_name) {
    return 13;
  } else if('fidelity' == bank_name) {
    return 21;
  } else if('sterling' == bank_name) {
    return 11;
  } else if('unity' == bank_name) {
    return 10;
  } else if('fcmb' == bank_name) {
    return 9;
  } else if('enterprise' == bank_name) {
    return 8;
  } else if('skye' == bank_name) {
    return 7;
  } else if('gtb' == bank_name) {
    return 6;
  } else if('ecobank' == bank_name) {
    return 4;
  } else if('wema' == bank_name) {
    return 2;
  } else if('uba' == bank_name) {
    return 1;
  } else if('first' == bank_name) {
    return 17;
  } else {
    return 0;
  }
}

const getAccountTypeID = function(account_type){
  if('Savings' == account_type) {
    return 1;
  } else if('Current' == account_type) {
    return 2;
  } else if('Domicillary' == account_type) {
    return 3;
  } else {
    return 0;
  }
}

const getCardIssuerID = function(card_brand){
  if('Mastercard' == card_brand) {
    return 1;
  } else if('Visa' == card_brand) {
    return 2;
  } else if('Verve' == card_brand) {
    return 3;
  } else {
    return 0;
  }
}

const getCardTypeID = function(card_type){
  if('CREDIT' == card_type) {
    return 1;
  } else if('DEBIT' == card_type) {
    return 2;
  } else {
    return 0;
  }
}

const dataServices = {
  getUser: function (userBVN, callback) {
    let user = []
    ibmdb.open(cn,function(err,conn){
      // blocks until the query is completed and all data has been acquired
      user = conn.querySync('SELECT * FROM USERS WHERE BVN = '+userBVN);

      callback(null, user);
    });
  },

  updateUser: function (middle_name, first_name, callback) {
    let users = []
    ibmdb.open(cn,function(err,conn){
      conn.prepare("UPDATE USERS SET MIDDLE_NAME = ? WHERE FIRST_NAME = ?", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        //Bind and Execute the statment asynchronously
        stmt.execute([middle_name, first_name], function (err, result) {
          if( err ) console.log(err);
          else result.closeSync();

          //Close the connection
          conn.close(function(err){});
        });
      });
      callback(null, users);
    });
  },

  updateSpend: function (accountNo, spend, amount, callback) {
    let accounts = []
    ibmdb.open(cn,function(err,conn){
      conn.prepare("UPDATE ACCOUNTS SET SPEND = ? WHERE ACCOUNT_NO = ?", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        //Bind and Execute the statment asynchronously
        stmt.execute([(Number(spend)+Number(amount)), accountNo], function (err, result) {
          if( err ) console.log(err);
          else result.closeSync();

          //Close the connection
          conn.close(function(err){});
        });
      });
      callback(null, accounts);
    });
  },

  getAccountBVN: function (bvn, callback) {
    let accounts = []
    let cards = []

    ibmdb.open(cn, function(err, conn){
      // blocks until the query is completed and all data has been acquired
      accounts = conn.querySync('SELECT * FROM ACCOUNTS LEFT JOIN BANKS ON ACCOUNTS.BANK_ID=BANKS.BANK_ID LEFT JOIN ACCOUNT_TYPE ON ACCOUNTS.TYPE_ID=ACCOUNT_TYPE.TYPE_ID WHERE ACCOUNTS.BVN = '+bvn);
      cards = conn.querySync('SELECT * FROM CARDS LEFT JOIN CARD_TYPE ON CARDS.TYPE_ID=CARD_TYPE.TYPE_ID LEFT JOIN ISSUERS ON CARDS.ISSUER_ID=ISSUERS.ISSUER_ID WHERE CARDS.BVN = '+bvn);

      if(accounts.length > 0){
        if(cards.length > 0){
          for (let i = 0; i < cards.length; i++) {
            cards[i].CARD_NO = cards[i].CARD_NO.slice(-4);
          }
          accounts = getAccountCard(accounts, cards)
        }
      }

      callback(null, accounts);
    });
  },

  getAccountNo: function(accountNo, callback) {
    let accounts = [];
    let cards = [];
    ibmdb.open(cn, function(err, conn){
      // blocks until the query is completed and all data has been acquired
      accounts = conn.querySync('SELECT * FROM ACCOUNTS LEFT JOIN BANKS ON ACCOUNTS.BANK_ID=BANKS.BANK_ID LEFT JOIN ACCOUNT_TYPE ON ACCOUNTS.TYPE_ID=ACCOUNT_TYPE.TYPE_ID WHERE ACCOUNTS.ACCOUNT_NO = '+accountNo);
      cards = conn.querySync('SELECT * FROM CARDS LEFT JOIN CARD_TYPE ON CARDS.TYPE_ID=CARD_TYPE.TYPE_ID LEFT JOIN ISSUERS ON CARDS.ISSUER_ID=ISSUERS.ISSUER_ID WHERE CARDS.ACCOUNT_NO = '+accountNo);

      if(accounts.length > 0){
        if(cards.length > 0){
          for (let i = 0; i < cards.length; i++) {
            cards[i].CARD_NO = cards[i].CARD_NO.slice(-4);
          }
          accounts = getAccountCard(accounts, cards)
        }
      }

      callback(null, accounts);
    });
  },

  addAccountNo: function(accountNo, bankName, userBVN, accountType, callback) {
    let accounts = [];
    ibmdb.open(cn,function(err,conn){
      conn.prepare("INSERT INTO ACCOUNTS (ACCOUNT_NO, BANK_ID, BVN, TYPE_ID, SPEND, DESCRIPTION, TOC) VALUES (?, ?, ?, ?, ?, ?, ?)", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        //Bind and Execute the statment asynchronously
        stmt.execute([Number(accountNo), getBankID(bankName), userBVN, getAccountTypeID(accountType), 0, '', Date.now()], function (err, result) {
          if( err ) console.log(err);
          else result.closeSync();

          //Close the connection
          conn.close(function(err){});
        });
      });
      callback(null, accounts);
    });
  },

  deleteAccountNo: function(accountNo, callback) {
    let accounts = [];
    ibmdb.open(cn,function(err,conn) {
      conn.prepare("DELETE FROM ACCOUNTS WHERE ACCOUNT_NO = ?", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        //Bind and Execute the statment asynchronously
        stmt.execute([accountNo], function (err, result) {
          if( err ) console.log(err);
          else result.closeSync();

          //Close the connection
          conn.close(function(err){});
        });
      });
      callback(null, accounts);
    });
  },


  addCardNo: function(cardNo, userBVN, accountNo, cardBrand, cardType, expiryMonth, expiryYear, callback) {
    let cards = [];
    ibmdb.open(cn,function(err,conn){
      conn.prepare("INSERT INTO CARDS (CARD_NO, BVN, ACCOUNT_NO, ISSUER_ID, TYPE_ID, EXPIRY_MONTH, EXPIRY_YEAR, TOC) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        //Bind and Execute the statment asynchronously
        stmt.execute([Number(cardNo), userBVN, Number(accountNo), getCardIssuerID(cardBrand), getCardTypeID(cardType), expiryMonth, expiryYear, Date.now()], function (err, result) {
          if( err ) console.log(err);
          else result.closeSync();

          //Close the connection
          conn.close(function(err){});
        });
      });
      callback(null, cards);
    });
  },

  deleteCardNo: function(accountNo, callback) {
    let accounts = [];
    ibmdb.open(cn,function(err,conn){
      conn.prepare("DELETE FROM CARDS WHERE ACCOUNT_NO = ?", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        //Bind and Execute the statment asynchronously
        stmt.execute([accountNo], function (err, result) {
          if( err ) console.log(err);
          else result.closeSync();

          //Close the connection
          conn.close(function(err){});
        });
      });
      callback(null, accounts);
    });
  },

  getBanks: function(callback) {
    let banks = [];
    ibmdb.open(cn,function(err,conn){
      // blocks until the query is completed and all data has been acquired
      banks = conn.querySync('SELECT * FROM BANKS');

      callback(null, banks);
    });
  },

  getAccountTypes: function(callback) {
    let account_types = [];
    ibmdb.open(cn,function(err,conn){
      // blocks until the query is completed and all data has been acquired
      account_types = conn.querySync('SELECT * FROM ACCOUNT_TYPE');

      callback(null, account_types);
    });
  },

  getBeneficiary: function(recipientNo, accountNo, callback) {
    let beneficiaries = [];
    ibmdb.open(cn,function(err,conn){
      // blocks until the query is completed and all data has been acquired
      beneficiaries = conn.querySync('SELECT * FROM BENEFICIARIES WHERE ACCOUNT_NO = '+recipientNo+' AND ACCOUNT_NO_REF = '+accountNo);

      callback(null, beneficiaries);
    });
  },

  addBeneficiary: function(recipientNo, recipientName, recipientBank, accountNo, callback) {
    let beneficiaries = [];
    ibmdb.open(cn,function(err,conn){
      conn.prepare("INSERT INTO BENEFICIARIES (ACCOUNT_NO, NAME, BANK_NAME, ACCOUNT_NO_REF, TOC) VALUES (?, ?, ?, ?, ?)", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        //Bind and Execute the statment asynchronously
        stmt.execute([Number(recipientNo), recipientName, recipientBank, Number(accountNo), Date.now()], function (err, result) {
          if( err ) console.log(err);
          else result.closeSync();

          //Close the connection
          conn.close(function(err){});
        });
      });
      callback(null, beneficiaries);
    });
  },

  addFundTransfer: function(userBVN, accountNo, recipientNo, amount, session, reference, esacode, bankIT, switchIT, callback) {
    let transactions = [];
    ibmdb.open(cn,function(err,conn){
      conn.prepare("INSERT INTO FUND_TRANSFER (ID, BVN, ACCOUNT_NO, RECIPIENT_NO, AMOUNT, SESSION, REFERENCE, ESACODE, PASSCODE, BANKIT, SWITCHIT, TOC) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        //Bind and Execute the statment asynchronously
        stmt.execute([Number((Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)), userBVN, Number(accountNo), Number(recipientNo), amount, Number(session), Number(reference), Number(esacode), 123456, bankIT, switchIT, Date.now()], function (err, result) {
          if( err ) console.log(err);
          else result.closeSync();

          //Close the connection
          conn.close(function(err){});
        });
      });

      callback(null, transactions);
    });
  },

  addAirtimeTopup: function(userBVN, accountNo, telcoName, amount, session, reference, esacode, bankIT, switchIT, callback) {
    let receipt = [];
    ibmdb.open(cn,function(err,conn){
      conn.prepare("INSERT INTO AIRTIME_TOPUP (ID, BVN, ACCOUNT_NO, TELCO_NAME, AMOUNT, SESSION, REFERENCE, ESACODE, PASSCODE, BANKIT, SWITCHIT, TOC) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", function (err, stmt) {
        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        //Bind and Execute the statment asynchronously
        stmt.execute([Number((Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)), userBVN, Number(accountNo), Number(recipientNo), amount, Number(session), Number(reference), Number(esacode), 123456, bankIT, switchIT, Date.now()], function (err, result) {
          if( err ) console.log(err);
          else result.closeSync();

          //Close the connection
          conn.close(function(err){});
        });
      });
      receipt[0] = {'account':accountNo,'telco':telcoName,'amount':amount,'status':switchIT}
      callback(null, receipt);
    });
  },

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

        console.log('=-=-=-=-=-=-=-=-=-=-==-=-=');
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

  getTelcos: function(callback) {
    let telcos = [];
    ibmdb.open(cn,function(err,conn){
      // blocks until the query is completed and all data has been acquired
      telcos = conn.querySync('SELECT * FROM TELCOS');

      callback(null, telcos);
    });
  },


};

module.exports = dataServices;
