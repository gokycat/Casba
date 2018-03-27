var express = require('express');
var app = express();

app.use('/', express.static('public'));

var userController = require('./controller/userController');
app.use('/user', userController);

var userKYCController = require('./controller/userKYCController');
app.use('/kyc/user', userKYCController);

var accountController = require('./controller/accountController');
app.use('/account', accountController);

var userAccountController = require('./controller/userAccountController');
app.use('/user/account', userAccountController);

var accountKYCController = require('./controller/accountKYCController');
app.use('/kyc/account', accountKYCController);

var cardController = require('./controller/cardController');
app.use('/card', cardController);

var userCardController = require('./controller/userCardController');
app.use('/user/card', userCardController);

var accountCardController = require('./controller/accountCardController');
app.use('/account/card', accountCardController);

var cardKYCController = require('./controller/cardKYCController');
app.use('/kyc/card', cardKYCController);

var transferController = require('./controller/transferController');
app.use('/transfer', transferController);

var userTransferController = require('./controller/userTransferController');
app.use('/user/transfer', userTransferController);

var accountTransferController = require('./controller/accountTransferController');
app.use('/account/transfer', accountTransferController);

var cardTransferController = require('./controller/cardTransferController');
app.use('/card/transfer', cardTransferController);

var bankTransferController = require('./controller/bankTransferController');
app.use('/bank/transfer', bankTransferController);

var debitAccountController = require('./controller/debitAccountController');
app.use('/account/debit', debitAccountController);

var balanceEnquiryController = require('./controller/balanceEnquiryController');
app.use('/wallet/balance', balanceEnquiryController);

var fundTransferController = require('./controller/fundTransferController');
app.use('/transfer/fund', fundTransferController);

var topupController = require('./controller/topupController');
app.use('/topup', topupController);

var userTopupController = require('./controller/userTopupController');
app.use('/user/topup', userTopupController);

var accountTopupController = require('./controller/accountTopupController');
app.use('/account/topup', accountTopupController);

var cardTopupController = require('./controller/cardTopupController');
app.use('/card/topup', cardTopupController);

var bankTopupController = require('./controller/bankTopupController');
app.use('/bank/topup', bankTopupController);

var airtimeTopupController = require('./controller/airtimeTopupController');
app.use('/topup/airtime', airtimeTopupController);

var paymentController = require('./controller/paymentController');
app.use('/payment', paymentController);

var userPaymentController = require('./controller/userPaymentController');
app.use('/user/payment', userPaymentController);

var accountPaymentController = require('./controller/accountPaymentController');
app.use('/account/payment',  accountPaymentController);

var cardPaymentController = require('./controller/cardPaymentController');
app.use('/card/payment', cardPaymentController);

var bankPaymentController = require('./controller/bankPaymentController');
app.use('/bank/payment', bankPaymentController);

var billPaymentController = require('./controller/billPaymentController');
app.use('/payment/bill', billPaymentController);

var userTransactionController = require('./controller/userTransactionController');
app.use('/user/transaction', userTransactionController);

var accountTransactionController = require('./controller/accountTransactionController');
app.use('/account/transaction', accountTransactionController);

var cardTransactionController = require('./controller/cardTransactionController');
app.use('/card/transaction', cardTransactionController);

var bankController = require('./controller/bankController');
app.use('/bank', bankController);

var accountTypeController = require('./controller/accountTypeController');
app.use('/account/type', accountTypeController);

var beneficiaryController = require('./controller/beneficiaryController');
app.use('/beneficiary', beneficiaryController);

var beneficiaryXController = require('./controller/beneficiaryXController');
app.use('/beneficiary/recipient', beneficiaryXController);

var phoneKYCController = require('./controller/phoneKYCController');
app.use('/kyc/phone', phoneKYCController);

module.exports = app;
