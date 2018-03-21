exports.getStatusID = function(status){
  if(status == "Inactive") {
    return 1;
  }
  else if(status == "Active") {
    return 2;
  } else {
    return 3;
  }
};

exports.getAccountCard = function (array1, array2) {
  const merge = require('merge');
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

exports.getBankID = function(bank_name){
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
};

exports.getAccountTypeID = function(account_type){
  if('Savings' == account_type) {
    return 1;
  } else if('Current' == account_type) {
    return 2;
  } else if('Domicillary' == account_type) {
    return 3;
  } else {
    return 0;
  }
};

exports.getCardIssuerID = function(card_brand){
  if('Mastercard' == card_brand) {
    return 1;
  } else if('Visa' == card_brand) {
    return 2;
  } else if('Verve' == card_brand) {
    return 3;
  } else {
    return 0;
  }
};

exports.getCardTypeID = function(card_type){
  if('CREDIT' == card_type) {
    return 1;
  } else if('DEBIT' == card_type) {
    return 2;
  } else {
    return 0;
  }
};

exports.getBankCode = function(bank_name){
  if('access' == bank_name) {
    return "044";
  } else if('zenith' == bank_name) {
    return "057";
  } else if('stanbic' == bank_name) {
    return "221";
  } else if('standard' == bank_name) {
    return "068";
  } else if('heritage' == bank_name) {
    return "030";
  } else if('diamond' == bank_name) {
    return "063";
  } else if('keystone' == bank_name) {
    return "082";
  } else if('union' == bank_name) {
    return "032";
  } else if('fidelity' == bank_name) {
    return "070";
  } else if('sterling' == bank_name) {
    return "232";
  } else if('unity' == bank_name) {
    return "215";
  } else if('fcmb' == bank_name) {
    return "214";
  } else if('enterprise' == bank_name) {
    return "084";
  } else if('skye' == bank_name) {
    return "076";
  } else if('gtb' == bank_name) {
    return "058";
  } else if('ecobank' == bank_name) {
    return "050";
  } else if('wema' == bank_name) {
    return "035";
  } else if('uba' == bank_name) {
    return "033";
  } else if('first' == bank_name) {
    return "011";
  } else {
    return 0;
  }
};

exports.pad_with_zeroes = function (number, length) {
  var my_string = '' + number;
  while (my_string.length < length) {
    my_string = '0' + my_string;
  }
  return my_string;
};

exports.getBankitStatus = function(status) {
  if('0' == status) {
    return "Transaction Successful";
  } else if('Z' == status) {
    return "Pending";
  } else if('1' == status) {
    return "Destination Card Not Found";
  } else if('2' == status) {
    return "Card Number Not Found";
  } else if('3' == status) {
    return "Invalid Card PIN";
  } else if('4' == status) {
    return "Card Expiration Incorrect";
  } else if('5' == status) {
    return "Insufficient balance";
  } else if('6' == status) {
    return "Spending Limit Exceeded";
  } else if('7' == status) {
    return "Internal System Error Occurred, please contact the service provider";
  } else if('8' == status) {
    return "Financial Institution cannot authorize transaction, Please try later";
  } else if('9' == status) {
    return "PIN tries Exceeded";
  } else if('10' == status) {
    return "Card has been locked";
  } else if('11' == status) {
    return "Invalid Terminal Id";
  } else if('12' == status) {
    return "Payment Timeout";
  } else if('13' == status) {
    return "Destination card has been locked";
  } else if('14' == status) {
    return "Card has expired";
  } else if('15' == status) {
    return "PIN change required";
  } else if('16' == status) {
    return "Invalid Amount";
  } else if('17' == status) {
    return "Card has been disabled";
  } else if('18' == status) {
    return "Unable to credit this account immediately, credit will be done later";
  } else if('19' == status) {
    return "Transaction not permitted on terminal";
  } else if('20' == status) {
    return "Exceeds withdrawal frequency";
  } else if('21' == status) {
    return "Destination Card has expired";
  } else if('22' == status) {
    return "Destination Card Disabled";
  } else if('23' == status) {
    return "Source Card Disabled";
  } else if('24' == status) {
    return "Invalid Bank Account";
  } else if('25' == status) {
    return "Insufficient Balance";
  } else if('1002' == status) {
    return "CHECKSUM/FINAL_CHECKSUM error";
  } else if('100' == status) {
    return "Duplicate session id";
  } else if('200' == status) {
    return "Invalid client id";
  } else if('300' == status) {
    return "Invalid mac";
  } else if('400' == status) {
    return "Expired session";
  } else if('500' == status) {
    return "You have entered an account number that is not tied to your phone number with bank. Pls contact your bank for assistance.";
  } else if('600' == status) {
    return "Invalid account id";
  } else if('800' == status) {
    return "Invalid esa code";
  } else if('900' == status) {
    return "Transaction limit exceeded";
  } else {
    return "Sorry, Your transaction could not be completed";
  }
};

exports.getSwitchitStatus = function(status) {
  if('0' == status) {
    return "Transaction Successful";
  } else if('-1' == status) {
    return "Transaction timed out.";
  } else if('1' == status) {
    return "Destination Card Not Found";
  } else if('2' == status) {
    return "Card Number Not Found";
  } else if('3' == status) {
    return "Invalid Card PIN";
  } else if('4' == status) {
    return "Card Expiration Incorrect";
  } else if('5' == status) {
    return "Insufficient balance";
  } else if('6' == status) {
    return "Spending Limit Exceeded";
  } else if('7' == status) {
    return "Internal System Error Occurred, please contact the service provider";
  } else if('8' == status) {
    return "Financial Institution cannot authorize transaction, Please try later";
  } else if('9' == status) {
    return "PIN tries Exceeded";
  } else if('10' == status) {
    return "Card has been locked";
  } else if('11' == status) {
    return "Invalid Terminal Id";
  } else if('12' == status) {
    return "Payment Timeout";
  } else if('13' == status) {
    return "Destination card has been locked";
  } else if('14' == status) {
    return "Card has expired";
  } else if('15' == status) {
    return "PIN change required";
  } else if('16' == status) {
    return "Invalid Amount";
  } else if('17' == status) {
    return "Card has been disabled";
  } else if('18' == status) {
    return "Unable to credit this account immediately, credit will be done later";
  } else if('19' == status) {
    return "Transaction not permitted on terminal";
  } else if('20' == status) {
    return "Exceeds withdrawal frequency";
  } else if('21' == status) {
    return "Destination Card has expired";
  } else if('22' == status) {
    return "Destination Card Disabled";
  } else if('23' == status) {
    return "Source Card Disabled";
  } else if('24' == status) {
    return "Invalid Bank Account";
  } else if('25' == status) {
    return "Insufficient Balance";
  } else if('26' == status) {
    return "Request/Function not supported";
  } else if('27' == status) {
    return "No Route to Issuer/Bank";
  } else if('28' == status) {
    return "Bank TSS not Funded";
  } else if('29' == status) {
    return "Transaction with this amount, destination account has already been approved today.";
  } else if('31' == status) {
    return "Pending transaction, upon confirmation from bank.";
  } else if('32' == status) {
    return "Transaction status unknown, contact Josla after T+1 for status.";
  } else if('92' == status) {
    return "No Route to Issuer/Bank";
  } else if('99' == status) {
    return "Transaction Failed";
  } else if('1000' == status) {
    return "Invalid Session";
  } else if('1001' == status) {
    return "Invalid Caller";
  } else if('1002' == status) {
    return "Invalid Transaction Reference";
  } else if('1003' == status) {
    return "Duplicate Transaction Reference";
  } else if('1004' == status) {
    return "Invalid Information";
  } else if('1005' == status) {
    return "Invalid Date Format";
  } else if('1006' == status) {
    return "Invalid Source Information";
  } else if('1007' == status) {
    return "Invalid Payout Bank";
  } else {
    return "Sorry, Your transaction could not be completed";
  }
};

exports.getTransactions = function(array1, array2){
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

exports.sortByKey = function(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0)) * -1;
    });
}

exports.getClassified = function(transactions){
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
