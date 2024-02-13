import React from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

//Create bar chart passing in the query data as a prop
function BarChart({ chartData }){
    return <Bar data={chartData} />;
}

export default BarChart;