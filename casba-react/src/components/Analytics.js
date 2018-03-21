import React, {Component} from 'react';
import {Bar, Line, Pie, HorizontalBar } from 'react-chartjs-2';


class Analytics extends Component{

  static defaultProps = {
    displayTitle:true,
    displayLegend: true,
    legendPosition:'right'
  }


  render(){

    let budgetData = {
      labels: this.props.timeString,
      datasets:[
        {
          label:'Transaction',
          data: this.props.amount,
          backgroundColor: 'rgba(255, 99, 132, 0.6)'
        }
      ]
    }

    let categoryData = {
      labels: [ 'Bills', 'Airtime', 'Transfers'],
      datasets:[
        {
          label:'Categories',
          data: [this.props.classification.bills, this.props.classification.airtime, this.props.classification.transfer],
          backgroundColor: ['rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)']
        }
      ]
    }
    let chartData = {
      labels: this.props.timeString,
      datasets:[
        {
          label:'Budget',
          data: this.props.amount,
          backgroundColor: 'rgba(255, 99, 132, 0.6)'
        },
        {
          label:'Expenses',
          data: [ 140,115,100,125,130,120],
          backgroundColor: 'rgba(153, 102, 255, 0.6)'
        }
      ]
    }
    return (
      <div className="chart">
        <Line
          data={budgetData}
          options={{
            title:{
              display:this.props.displayTitle,
              text:'Series',
              fontSize:25
            },
            legend:{
              display:this.props.displayLegend,
              position:this.props.legendPosition
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }}
        />

        <HorizontalBar
          data={categoryData}
          options={{
            title:{
              display:this.props.displayTitle,
              text:'Distribution',
              fontSize:25
            },
            legend:{
              display:this.props.displayLegend,
              position:this.props.legendPosition
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }}
        />

        <Bar
          data={chartData}
          options={{
            title:{
              display:this.props.displayTitle,
              text:'Combo',
              fontSize:25
            },
            legend:{
              display:this.props.displayLegend,
              position:this.props.legendPosition
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }}
        />

      </div>
    )
  }
}

export default Analytics;
