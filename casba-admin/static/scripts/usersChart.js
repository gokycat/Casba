$(document).ready(function() {


var usersData = $('#my-user').data();
var active = 0;
var inactive = 0;

const m = moment(1517924469578);

getUserStatus();

console.log('--======--');
console.log(m);
console.log(m.month());

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

var ctx = document.getElementById('usersStatusChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "Active",
            backgroundColor: 'rgba(75, 72, 192, 0.4)',
            borderColor: 'black',
            data: [active, 10, 5, 2, 20, 30, 45 ],
        },
        {
            label: "Inactive",
            backgroundColor: 'rgba(75, 192, 192, 0.4)',
            borderColor: 'black',
            data: [inactive, 30, 5, 45, 10, 20, 2],
        }
      ]
    },

    // Configuration options go here
    options: {}
});

});
