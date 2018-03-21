$(document).ready(function() {


  var transactionsData = $('#users-transactions').data();
  var usersData = $('#users-users').data();

  console.log(transactionsData);
  console.log(usersData);

  var Transactions = [];
  var Users = [];
  var index = [];
  var active = 0;
  var inactive = 0;

  getUserStatus();

  console.log('ACTIVE');
  console.log(active);
  console.log('INACTIVE');
  console.log(inactive);
  console.log('USERS');
  console.log(Users);

  // Loop through Transactions table
  for (i in transactionsData.user.data) {
    Transactions.push(transactionsData.user.data[i]);
  }

  // Loop through Users table
  for (key in usersData.user.data) {
    Users.push(usersData.user.data[key]);
  }


  //  POPULATE DASHBOARD WITH INFO
  // TOTAL USERS
  var totalUsersBold = document.createElement("b");
  totalUsersBold.innerHTML = Users.length;
  var totalUsers = document.createElement("h3");
  totalUsers.appendChild(totalUsersBold);
  var totalUsersTab = document.getElementById("total-users-tab");
  totalUsersTab.appendChild(totalUsers);

  // TOTAL TRANSACTION
  var totalTransBold = document.createElement("b");
  totalTransBold.innerHTML = Transactions.length;
  var totalTrans = document.createElement("h3");
  totalTrans.appendChild(totalTransBold);
  var totalTransTab = document.getElementById("total-trans-tab");
  totalTransTab.appendChild(totalTrans);

  // ACTIVE USERS
  var activeUsersBold = document.createElement("b");
  activeUsersBold.innerHTML = active;
  var activeUsers = document.createElement("h3");
  activeUsers.appendChild(activeUsersBold);
  var activeUsersTab = document.getElementById("active-users-tab");
  activeUsersTab.appendChild(activeUsers);

  // ACTIVE USERS
  // var activeUsersBold = document.createElement("b");
  // activeUsersBold.innerHTML = active;
  // var activeUsers = document.createElement("h3");
  // activeUsers.appendChild(activeUsersBold);
  // var activeUsersTab = document.getElementById("active-users-tab");
  // activeUsersTab.appendChild(activeUsers);

  // INACTIVE USERS
  var inactiveUsersBold = document.createElement("b");
  inactiveUsersBold.innerHTML = inactive;
  var inactiveUsers = document.createElement("h3");
  inactiveUsers.appendChild(inactiveUsersBold);
  var inactiveUsersTab = document.getElementById("restricted-users-tab");
  inactiveUsersTab.appendChild(inactiveUsers);

  function getUserStatus() {
    for (var i=0; i < usersData.user.data.length; i++) {
      if (usersData.user.data[i][7] == 1) {
        inactive = inactive + 1;
      }
      else if (usersData.user.data[i][7] == 2) {
        active = active + 1;
      }
    }
  }
});
