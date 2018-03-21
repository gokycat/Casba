$(document).ready(function() {

  var data = $('#my-user').data();


  console.log(data);

  // POPULATE USER DETAILS
  var username = document.getElementById("user-names");
    username.innerHTML = '<p><b>User Name:</b>' + ' ' +  data.user[0].FIRST_NAME + ' ' + data.user[0].LAST_NAME + '</p>'

  var bvn = document.getElementById("user-bvn");
    bvn.innerHTML = '<p><b>BVN:</b>' + ' ' +  data.user[0].BVN + '</p>'

  var dob = document.getElementById("user-dob");
    dob.innerHTML = '<p><b>Date of Birth:</b>' + ' ' +  data.user[0].DATE_OF_BIRTH + '</p>'

  var phone = document.getElementById("user-phone");
    phone.innerHTML = '<p><b>Phone:</b>' + ' ' +  data.user[0].PHONE + '</p>'

  var email = document.getElementById("user-email");
    email.innerHTML = '<p><b>Email:</b>' + ' ' +  data.user[0].EMAIL + '</p>'

  var email = document.getElementById("user-email");
    email.innerHTML = '<p><b>Email:</b>' + ' ' +  data.user[0].EMAIL + '</p>'


});
