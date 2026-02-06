import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const RequestChart = ({ stats }) => {
  const data = {
    labels: ['Pending', 'Resolved', 'High Priority'],
    datasets: [
      {
        label: 'Requests',
        // We use the real stats from your database here
        data: [stats.pending, stats.resolved, stats.highPriority],
        backgroundColor: [
          '#fbbf24', // Amber/Yellow for Pending
          '#10b981', // Emerald/Green for Resolved
          '#f43f5e', // Rose/Red for High Priority
        ],
        hoverBackgroundColor: [
          '#f59e0b',
          '#059669',
          '#e11d48',
        ],
        borderWidth: 0,
        hoverOffset: 15,
        cutout: '75%', // This creates the "Ring" look
        borderRadius: 20, // Rounded edges on the segments
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: '#64748b',
        },
      },
      tooltip: {
        backgroundColor: '#1e2330',
        padding: 12,
        cornerRadius: 10,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
      },
    },
  };

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <Doughnut data={data} options={options} />
      
      {/* Center Text to make it look attractive */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-800">{stats.total}</span>
        <span className="text-xs text-gray-400 uppercase tracking-widest">Total</span>
      </div>
    </div>
  );
};

export default RequestChart;