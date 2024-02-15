// We installed 'chart.js', 'react-chartjs-2' for creating our chart
// It is important to note that without 'chart.js/auto' that chart will NOT render

// import React from 'react';

import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';

// styling for chart legend
const legendItems = [
  {
    text: 'Cache',
    fillStyle: 'green',
    fontColor: 'white',
  },
  {
    text: 'Partial',
    fillStyle: 'yellow',
    fontColor: 'white',
  },
  {
    text: 'Database',
    fillStyle: 'red',
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
          generateLabels: function () {
            return legendItems;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white', // Font color of the x-axis labels
        },
      },
      y: {
        ticks: {
          color: 'white', // Font color of the y-axis labels
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export default BarChart;
