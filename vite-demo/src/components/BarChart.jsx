// We installed 'chart.js', 'react-chartjs-2' for creating our chart
// It is important to note that without 'chart.js/auto' that chart will * NOT * render

// import React from 'react';

import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';

// defining the chart legend
const legendItems = [
  {
    text: 'Cache',
    fillStyle: '#faefdf', //green
    fontColor: 'white',
  },
  {
    text: 'Partial',
    fillStyle: 'pink', //yellow
    fontColor: 'white',
  },
  {
    text: 'Database',
    fillStyle: '#f077bc', //red
    fontColor: 'white',
  },
  {
    text: 'Mutation',
    fillStyle: 'purple',
    fontColor: 'white',
  },
  {
    text: 'Error',
    fillStyle: 'black',
    fontColor: 'white',
  },
];

// This creates a bar chart
function BarChart({rawData}) {
  // process raw data to chartData
  const chartData = {
    // labels: the query id that is also shown in the table
    labels: rawData.responseCount,
    // datasets: array of bars
    datasets: [
      {
        // data: the height of each bar (response time of each query invokation)
        data: rawData.responseTimes,
        // backgroundColor: the color of each bar (based on the source the reply came from)
        backgroundColor: rawData.responseSources.map((source) => {
          switch (source) {
            case 'database':
              return '#f077bc';
            case 'cache':
              return '#faefdf'; // bun color
            case 'mutation':
              return 'purple';
            case 'partial':
              return 'pink';
            default:
              return 'black';
          }
        }),
      },
    ],
  };

  // styling for the bar chart legend
  const options = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 16,
          },
          // creates the labels we defined for the legend previously
          generateLabels: function () {
            return legendItems;
          },
        },
      },
    },
    scales: {
      // x-axis styles
      x: {
        ticks: {
          color: 'white', // Font color of the x-axis labels
        },
      },
      // y-axis styles
      y: {
        ticks: {
          color: 'white', // Font color of the y-axis labels
        },
      },
    },
  };
  // Returns the BarChart with its data and styling options
  return <Bar data={chartData} options={options} />;
}

//exports the BarChart
export default BarChart;
