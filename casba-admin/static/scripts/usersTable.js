$(document).ready(function() {


  var data = $('#my-user').data();


  console.log(data);


  // EXTRACT VALUE FOR TABLE HEADER.
  var values = [];
  var keys = [];
  var index = [];

  for (i in data.user.data) {
    values.push(data.user.data[i]);
  }

  for (key in data.user.columns) {
    keys.push(data.user.columns[key]);
  }

  for (i in data.user.index) {
    index.push(data.user.index[i]);
  }

  console.log('===========data===========');
  console.log(data);
  console.log('===========values==========');
  console.log(values);
  console.log('===========keys============');
  console.log(keys);

  // CREATE DYNAMIC TABLE.
  var table = document.createElement("table");

  table.classList.add('table-hover', 'table-striped');
  table.setAttribute("id", "tableUsers");

  // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

  var tr = table.insertRow(-1);                   // TABLE ROW.
  console.log('=====Keys===========')
  for (var i = 0; i < keys.length; i++) {
    var th = document.createElement("th");      // TABLE HEADER.
    //  console.log(keys[i])
    th.innerHTML = keys[i];
    tr.appendChild(th);
  }

  // ADD JSON DATA TO THE TABLE AS ROWS.
  console.log('=====LAST===========')

  for (var i=0; i <= values.length; i++) {
    tr = table.insertRow(-1);
    for (j in values[i]) {
      if ( j == 0) {
        var cells = tr.insertCell(-1)
        cells.innerHTML = '<a href=' + "user/" + values[i][j] + '>' + values[i][j] + '</a>';
      }
      else if (j != 0) {
        var cells = tr.insertCell(-1)
        cells.innerHTML = values[i][j];
      }
    }
  }


  // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
  var divContainer = document.getElementById("usersTable");
  divContainer.appendChild(table);


});
