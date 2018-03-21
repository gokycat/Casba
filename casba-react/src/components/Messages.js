import React from 'react';

import Message from './Message';

import Button from './Button';

class Messages extends React.Component {
  componentDidUpdate() {
    // There is a new message in the state, scroll to bottom of list
    const objDiv = document.getElementById('messageList');
    objDiv.scrollTop = objDiv.scrollHeight;
  }
  // state
  constructor(props) {
    super(props);
    // bind the ‘this’ keyword to the event handlers
    this.infoClickHandler = this.infoClickHandler.bind(this);
    this.accountInfoClickHandler = this.accountInfoClickHandler.bind(this);
    this.confirmClickHandler = this.confirmClickHandler.bind(this);
    this.declineClickHandler = this.declineClickHandler.bind(this);
    this.accountClickHandler = this.accountClickHandler.bind(this);
    this.addAccountClickHandler = this.addAccountClickHandler.bind(this);
    this.addCardClickHandler = this.addCardClickHandler.bind(this);
    this.bankNameClickHandler = this.bankNameClickHandler.bind(this);
    this.accountTypeClickHandler = this.accountTypeClickHandler.bind(this);
    this.transferClickHandler = this.transferClickHandler.bind(this);
    this.topupClickHandler = this.topupClickHandler.bind(this);
    this.telcoNameClickHandler = this.telcoNameClickHandler.bind(this);
    this.payClickHandler = this.payClickHandler.bind(this);
    this.monthClickHandler = this.monthClickHandler.bind(this);
    this.billTypeClickHandler = this.billTypeClickHandler.bind(this);
    this.vendorClickHandler = this.vendorClickHandler.bind(this);
    this.vendorPackageClickHandler = this.vendorPackageClickHandler.bind(this);
    this.budgetClickHandler = this.budgetClickHandler.bind(this);
  }

  // event handlers
  infoClickHandler() {
    this.props.userInfoClickHandler('Show me my basic customer information');
  }

  accountInfoClickHandler() {
    this.props.userInfoClickHandler('What is my account balance');
  }

  confirmClickHandler() {
    this.props.clickHandler('Yes');
  }

  declineClickHandler() {
    this.props.clickHandler('No');
  }

  accountClickHandler(accountNo) {
    this.props.clickHandler(accountNo);
  }

  addAccountClickHandler() {
    this.props.clickHandler('Add account');
  }

  addCardClickHandler() {
    this.props.clickHandler('Add card');
  }

  bankNameClickHandler(bankName) {
    this.props.clickHandler(bankName[0].toUpperCase() + bankName.substring(1));
  }

  telcoNameClickHandler(telcoName) {
    this.props.clickHandler(telcoName[0].toUpperCase() + telcoName.substring(1));
  }

  vendorClickHandler(vendorCode) {
    this.props.clickHandler(vendorCode[0].toUpperCase() + vendorCode.substring(1));
  }

  vendorPackageClickHandler(vendorPackageName) {
    this.props.clickHandler(vendorPackageName[0].toUpperCase() + vendorPackageName.substring(1));
  }

  accountTypeClickHandler(accountType) {
    this.props.clickHandler(accountType[0].toUpperCase() + accountType.substring(1));
  }

  monthClickHandler(month) {
    this.props.clickHandler(month);
  }

  billTypeClickHandler(billType) {
    this.props.clickHandler(billType);
  }

  transferClickHandler() {
    this.props.userInfoClickHandler('I want to send some money');
  }

  topupClickHandler() {
    this.props.userInfoClickHandler('I would like to buy airtime');
  }

  payClickHandler() {
    this.props.userInfoClickHandler('I want to pay bill');
  }

  budgetClickHandler() {
    this.props.userInfoClickHandler('What is my budget?');
  }

  //view
  render() {
    // Loop through all the messages in the state and create a Message component
    const messages = this.props.messages.map((message, i) => {
      if(message.tag == 'begin') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Info' click={this.infoClickHandler} />
          <Button btnValue='Bills' click={this.payClickHandler} />
          <Button btnValue='Airtime' click={this.topupClickHandler} />
          <Button btnValue='Transfer' click={this.transferClickHandler} />
          <Button btnValue='Budget' click={this.budgetClickHandler} />
          </div>
        );
      } else if(message.tag == 'hello') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Info' click={this.infoClickHandler} />
          <Button btnValue='Bills' click={this.payClickHandler} />
          <Button btnValue='Airtime' click={this.topupClickHandler} />
          <Button btnValue='Transfer' click={this.transferClickHandler} />
          <Button btnValue='Budget' click={this.budgetClickHandler} />
          </div>
        );
      } else if(message.tag == 'noAccount') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Add account' click={this.addAccountClickHandler} />
          </div>
        );
      } else if(message.tag == 'noCard') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Add card' click={this.addAccountClickHandler} />
          </div>
        );
      } else if(message.tag == 'capabilities') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Info' click={this.infoClickHandler} />
          <Button btnValue='Bills' click={this.payClickHandler} />
          <Button btnValue='Airtime' click={this.topupClickHandler} />
          <Button btnValue='Transfer' click={this.transferClickHandler} />
          <Button btnValue='Budget' click={this.budgetClickHandler} />
          </div>
        );
      } else if(message.tag == 'userInfo') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Bills' click={this.payClickHandler} />
          <Button btnValue='Airtime' click={this.topupClickHandler} />
          <Button btnValue='Transfer' click={this.transferClickHandler} />
          <Button btnValue='Budget' click={this.budgetClickHandler} />
          </div>
        );
      } else if(message.tag == 'viewAccount') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <div>
          {message.accounts.map((account, i) => <button key={i} className={'btn btn-default bank-btn ' + account.BANK_NAME} onClick={this.bankNameClickHandler.bind(this, account.ACCOUNT_NO)}>{account.ACCOUNT_NO}</button>)}
          </div>
          </div>
        );
      } else if(message.tag == 'deleteAccount') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <div>
          {message.accounts.map((account, i) => <button key={i} className={'btn btn-default bank-btn ' + account.BANK_NAME} onClick={this.bankNameClickHandler.bind(this, account.ACCOUNT_NO)}>{account.ACCOUNT_NO}</button>)}
          </div>
          </div>
        );
      } else if(message.tag == 'deleteCard') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <div>
          {message.accounts.map((account, i) => <button key={i} className={'btn btn-default bank-btn ' + account.BANK_NAME} onClick={this.bankNameClickHandler.bind(this, account.ACCOUNT_NO)}>{account.ACCOUNT_NO}</button>)}
          </div>
          </div>
        );
      } else if(message.tag == 'addCard') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <div>
          {message.accounts.map((account, i) => <button key={i} className={'btn btn-default bank-btn ' + account.BANK_NAME} onClick={this.bankNameClickHandler.bind(this, account.ACCOUNT_NO)}>{account.ACCOUNT_NO}</button>)}
          </div>
          </div>
        );
      } else if(message.tag == 'accountInfo') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Add account' click={this.addAccountClickHandler} />
          <Button btnValue='Bills' click={this.payClickHandler} />
          <Button btnValue='Airtime' click={this.topupClickHandler} />
          <Button btnValue='Transfer' click={this.transferClickHandler} />
          <Button btnValue='Budget' click={this.budgetClickHandler} />
          </div>
        );
      } else if(message.tag == 'accountBank') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <div>
          {message.banks.map((bank, i) => <button key={i} className={'btn btn-default bank-btn ' + bank.BANK_NAME} onClick={this.bankNameClickHandler.bind(this, bank.BANK_NAME)}>{bank.BANK_NAME}</button>)}
          </div>
          </div>
        );
      } else if(message.tag == 'accountType') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <div>
          {message.account_types.map((account_type, i) => <Button key={i} click={this.accountTypeClickHandler.bind(this, account_type.TYPE_NAME)} btnValue={account_type.TYPE_NAME} />)}
          </div>
          </div>
        );
      } else if(message.tag == 'accountNotResolved') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Add account' click={this.addAccountClickHandler} />
          </div>
        );
      } else if(message.tag == 'transferNotResolved') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='User' click={this.infoClickHandler} />
          <Button btnValue='Account' click={this.accountInfoClickHandler} />
          </div>
        );
      } else if(message.tag == 'topupNotResolved') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='User' click={this.infoClickHandler} />
          <Button btnValue='Account' click={this.accountInfoClickHandler} />
          </div>
        );
      } else if(message.tag == 'cardNotResolved') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Add card' click={this.addAccountClickHandler} />
          </div>
        );
      } else if(message.tag == 'resetPasswordConfirm') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Confirm' click={this.confirmClickHandler} />
          <Button btnValue='Decline' click={this.declineClickHandler} />
          </div>
        );
      } else if(message.tag == 'addAccountConfirm') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Confirm' click={this.confirmClickHandler} />
          <Button btnValue='Decline' click={this.declineClickHandler} />
          </div>
        );
      } else if(message.tag == 'deleteAccountConfirm') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Confirm' click={this.confirmClickHandler} />
          <Button btnValue='Decline' click={this.declineClickHandler} />
          </div>
        );
      } else if(message.tag == 'deleteCardConfirm') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Confirm' click={this.confirmClickHandler} />
          <Button btnValue='Decline' click={this.declineClickHandler} />
          </div>
        );
      } else if(message.tag == 'addCardConfirm') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Confirm' click={this.confirmClickHandler} />
          <Button btnValue='Decline' click={this.declineClickHandler} />
          </div>
        );
      } else if(message.tag == 'transferConfirm') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Confirm' click={this.confirmClickHandler} />
          <Button btnValue='Decline' click={this.declineClickHandler} />
          </div>
        );
      } else if(message.tag == 'topupConfirm') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Confirm' click={this.confirmClickHandler} />
          <Button btnValue='Decline' click={this.declineClickHandler} />
          </div>
        );
      } else if(message.tag == 'paymentConfirm') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Confirm' click={this.confirmClickHandler} />
          <Button btnValue='Decline' click={this.declineClickHandler} />
          </div>
        );
      } else if(message.tag == 'addAccountDeclined') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Add account' click={this.addAccountClickHandler} />
          </div>
        );
      } else if(message.tag == 'paymentDeclined') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Add account' click={this.addAccountClickHandler} />
          </div>
        );
      } else if(message.tag == 'addCardDeclined') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Add card' click={this.addCardClickHandler} />
          </div>
        );
      } else if(message.tag == 'deleteAccountConfirmed') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Add account' click={this.addAccountClickHandler} />
          </div>
        );
      } else if(message.tag == 'deleteCardConfirmed') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Add card' click={this.addCardClickHandler} />
          </div>
        );
      } else if(message.tag == 'addAccountConfirmed') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Add Card' click={this.addCardClickHandler} />
          <Button btnValue='Bills' click={this.payClickHandler} />
          <Button btnValue='Airtime' click={this.topupClickHandler} />
          <Button btnValue='Transfer' click={this.transferClickHandler} />
          <Button btnValue='Budget' click={this.budgetClickHandler} />
          </div>
        );
      } else if(message.tag == 'transferConfirmed') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Bills' click={this.payClickHandler} />
          <Button btnValue='Airtime' click={this.topupClickHandler} />
          <Button btnValue='Transfer' click={this.transferClickHandler} />
          <Button btnValue='Locate' />
          <Button btnValue='Budget' />
          </div>
        );
      } else if(message.tag == 'transferConfirmed') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Bills' click={this.payClickHandler} />
          <Button btnValue='Airtime' click={this.topupClickHandler} />
          <Button btnValue='Transfer' click={this.transferClickHandler} />
          <Button btnValue='Budget' click={this.budgetClickHandler} />
          </div>
        );
      } else if(message.tag == 'topupConfirmed') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Bills' click={this.payClickHandler} />
          <Button btnValue='Airtime' click={this.topupClickHandler} />
          <Button btnValue='Transfer' click={this.transferClickHandler} />
          <Button btnValue='Budget' click={this.budgetClickHandler} />
          </div>
        );
      } else if(message.tag == 'transferDeclined') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Bills' click={this.payClickHandler} />
          <Button btnValue='Airtime' click={this.topupClickHandler} />
          <Button btnValue='Transfer' click={this.transferClickHandler} />
          <Button btnValue='Budget' click={this.budgetClickHandler} />
          </div>
        );
      } else if(message.tag == 'topupDeclined') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Bills' click={this.payClickHandler} />
          <Button btnValue='Airtime' click={this.topupClickHandler} />
          <Button btnValue='Transfer' click={this.transferClickHandler} />
          <Button btnValue='Budget' click={this.budgetClickHandler} />
          </div>
        );
      } else if(message.tag == 'addCardConfirmed') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Bills' click={this.payClickHandler} />
          <Button btnValue='Airtime' click={this.topupClickHandler} />
          <Button btnValue='Transfer' click={this.transferClickHandler} />
          <Button btnValue='Budget' click={this.budgetClickHandler} />
          </div>
        );
      } else if(message.tag == 'deleteAccountDeclined') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Info' click={this.infoClickHandler} />
          <Button btnValue='Bills' click={this.payClickHandler} />
          <Button btnValue='Airtime' click={this.topupClickHandler} />
          <Button btnValue='Transfer' click={this.transferClickHandler} />
          <Button btnValue='Budget' click={this.budgetClickHandler} />
          </div>
        );
      } else if(message.tag == 'deleteCardDeclined') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Info' click={this.infoClickHandler} />
          <Button btnValue='Bills' click={this.payClickHandler} />
          <Button btnValue='Airtime' click={this.topupClickHandler} />
          <Button btnValue='Transfer' click={this.transferClickHandler} />
          <Button btnValue='Budget' click={this.budgetClickHandler} />
          </div>
        );
      } else if(message.tag == 'expiryMonth') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Jan' click={this.monthClickHandler.bind(this, 'Jan')} />
          <Button btnValue='Feb' click={this.monthClickHandler.bind(this, 'Feb')} />
          <Button btnValue='Mar' click={this.monthClickHandler.bind(this, 'Mar')} />
          <Button btnValue='Apr' click={this.monthClickHandler.bind(this, 'Apr')} />
          <Button btnValue='May' click={this.monthClickHandler.bind(this, 'May')} />
          <Button btnValue='Jun' click={this.monthClickHandler.bind(this, 'Jun')} />
          <Button btnValue='Jul' click={this.monthClickHandler.bind(this, 'Jul')} />
          <Button btnValue='Aug' click={this.monthClickHandler.bind(this, 'Aug')} />
          <Button btnValue='Sep' click={this.monthClickHandler.bind(this, 'Sep')} />
          <Button btnValue='Oct' click={this.monthClickHandler.bind(this, 'Oct')} />
          <Button btnValue='Nov' click={this.monthClickHandler.bind(this, 'Nov')} />
          <Button btnValue='Dec' click={this.monthClickHandler.bind(this, 'Dec')} />
          </div>
        );
      } else if(message.tag == 'fundsTransfer') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <div>
          {message.accounts.map((account, i) => <button key={i} className={'btn btn-default bank-btn ' + account.BANK_NAME} onClick={this.bankNameClickHandler.bind(this, account.ACCOUNT_NO)}>{account.ACCOUNT_NO}</button>)}
          </div>
          </div>
        );
      } else if(message.tag == 'airtimeTopup') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <div>
          {message.accounts.map((account, i) => <button key={i} className={'btn btn-default bank-btn ' + account.BANK_NAME} onClick={this.bankNameClickHandler.bind(this, account.ACCOUNT_NO)}>{account.ACCOUNT_NO}</button>)}
          </div>
          </div>
        );
      } else if(message.tag == 'payBills') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <div>
          {message.accounts.map((account, i) => <button key={i} className={'btn btn-default bank-btn ' + account.BANK_NAME} onClick={this.bankNameClickHandler.bind(this, account.ACCOUNT_NO)}>{account.ACCOUNT_NO}</button>)}
          </div>
          </div>
        );
      } else if(message.tag == 'recipientBank') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <div>
          {message.banks.map((bank, i) => <button key={i} className={'btn btn-default bank-btn ' + bank.BANK_NAME} onClick={this.bankNameClickHandler.bind(this, bank.BANK_NAME)}>{bank.BANK_NAME}</button>)}
          </div>
          </div>
        );
      } else if(message.tag == 'topupTelco') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <div>
          {message.telcos.map((telco, i) => <button key={i} className={'btn btn-default'} onClick={this.telcoNameClickHandler.bind(this, telco.TELCO_NAME)}>{telco.TELCO_NAME}</button>)}
          </div>
          </div>
        );
      } else if(message.tag == 'billType') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <div>
          <Button btnValue='Electric' click={this.billTypeClickHandler.bind(this, 'Electric')} />
          <Button btnValue='Internet' click={this.billTypeClickHandler.bind(this, 'Internet')} />
          <Button btnValue='TV' click={this.billTypeClickHandler.bind(this, 'TV')} />
          </div>
          </div>
        );
      } else if(message.tag == 'billBiller') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <div>
          {message.vendors.map((vendor, i) => <button key={i}  className={'btn btn-default bank-btn '} onClick={this.vendorClickHandler.bind(this, vendor.CODE)}>{vendor.BILLER_NAME}</button>)}
          </div>
          </div>
        );
      } else if(message.tag == 'vendor') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <div>
          {message.vendorPackages.map((vendorPackage, i) => <button key={i}  className={'btn btn-default bank-btn '} onClick={this.vendorPackageClickHandler.bind(this, vendorPackage.PACKAGE_NAME)}>{vendorPackage.PACKAGE_NAME}</button>)}
          </div>
          </div>
        );
      } else if(message.tag == 'myBudget') {
        return (
          <div>
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe} />
          <Button btnValue='Utilities' click={this.monthClickHandler.bind(this, 'Utilities')} />
          <Button btnValue='Fees' click={this.monthClickHandler.bind(this, 'Fees')} />
          <Button btnValue='Food' click={this.monthClickHandler.bind(this, 'Food')} />
          <Button btnValue='Entertainment' click={this.monthClickHandler.bind(this, 'Entertainment')} />
          <Button btnValue='Rent' click={this.monthClickHandler.bind(this, 'Rent')} />
          <Button btnValue='Transport' click={this.monthClickHandler.bind(this, 'Transport')} />
          <Button btnValue='Clothings' click={this.monthClickHandler.bind(this, 'Clothings')} />
          <Button btnValue='Personal' click={this.monthClickHandler.bind(this, 'Personal')} />
          </div>
        );
      } else {
        return (
          <Message
          key={i}
          user={this.props.user}
          message={message.message}
          fromMe={message.fromMe}/>
        );
      }
    });

    return (
      <div className='messages' id='messageList'>
        { messages }
      </div>
    );
  }
}

Messages.defaultProps = {
  messages: []
};

export default Messages;
