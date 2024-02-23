// We installed 'chart.js', 'react-chartjs-2' for creating our chart
// It is important to note that without 'chart.js/auto' that chart will * NOT * render

// import React from 'react';

import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';

// styling for chart legend
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
function BarChart({chartData}) {
  const options = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 16,
          },
          // creates the labels for the legend
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
