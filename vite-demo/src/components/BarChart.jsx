// We installed 'chart.js', 'react-chartjs-2' for creating our chart
// It is important to note that without 'chart.js/auto' that chart will NOT render

import React from 'react';
import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';

// this creates a bar chart
function BarChart({chartData}) {
  return <Bar data={chartData} />;
}

export default BarChart;
