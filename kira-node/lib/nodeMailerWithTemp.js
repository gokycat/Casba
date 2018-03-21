
const sender = 'smtps://casba%40josla.com.ng';  // The emailto use in sending the email
// (Change the @ symbol to %40 or do a url encoding )
const password = 'casba-dinosaurs';  // password of the email to use

const nodeMailer = require('nodemailer');
const EmailTemplate = require('email-templates-v2').EmailTemplate;

const path = require('path');


const transporter = nodeMailer.createTransport(sender + ':' + password + '@smtp.gmail.com');

const resetTemplateDir = path.join(__dirname, 'templates', 'resetPassword');

const verifyTemplateDir = path.join(__dirname, 'templates', 'verifyUser');

const loginTemplateDir = path.join(__dirname, 'templates', 'loginUser');

const broadcastTemplateDir = path.join(__dirname, 'templates', 'broadcast');

// create template based sender function
// assumes text.{ext} and html.{ext} in template/directory
const sendResetPasswordLink = transporter.templateSender(
  new EmailTemplate(resetTemplateDir), {
    from: 'casba@josla.com.ng',
  });

const sendVerificationLink = transporter.templateSender(
  new EmailTemplate(verifyTemplateDir), {
    from: 'casba@josla.com.ng',
  });

const sendLoginInfo = transporter.templateSender(
  new EmailTemplate(loginTemplateDir), {
    from: 'casba@josla.com.ng',
  });

const sendBroadcast = transporter.templateSender(
new EmailTemplate(broadcastTemplateDir), {
  from: 'casba@josla.com.ng',
});



exports.sendPasswordReset = function (email, username, name, tokenUrl) {
    // transporter.template
  sendResetPasswordLink({
    to: email,
    subject: 'Password Reset - casba.com.ng',
  }, {
    name,
    username,
    token: tokenUrl,
  }, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log('Link sent\n' + JSON.stringify(info));
    }
  });
};

exports.sendRegistration = function (email, username, name, tokenUrl) {
    // transporter.template
  sendVerificationLink({
    to: email,
    subject: 'Email Verification - casba.com.ng',
  }, {
    name,
    username,
    token: tokenUrl,
  }, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log('Link sent\n' + JSON.stringify(info));
    }
  });
};

exports.sendLogin = function (email, username, name, tokenUrl) {
    // transporter.template
  sendLoginInfo({
    to: email,
    subject: 'Successful Login - casba.com.ng',
  }, {
    name,
    username,
    token: tokenUrl,
  }, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log('Link sent\n' + JSON.stringify(info));
    }
  });
};


exports.sendBroadcast = function (email, username, name) {
    // transporter.template
  sendBroadcast({
    to: email,
    subject: 'We are Glad to Inform you - casba.com.ng',
  }, {
    name,
    username,
  }, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log('Link sent\n' + JSON.stringify(info));
    }
  });
};
