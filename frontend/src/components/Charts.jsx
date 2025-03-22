import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Charts({ view }) {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const res = await axios.get('/api/stats/');
    setStats(res.data);
  };

  const barData = {
    labels: ['Companies > 10k Revenue'],
    datasets: [
      {
        label: 'Count',
        data: [stats.revenue_gt_10k || 0],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const pieData = {
    labels: stats.country_counts?.map((c) => c.country) || [],
    datasets: [
      {
        data: stats.country_counts?.map((c) => c.count) || [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  const boxData = {
    labels: ['Revenue'],
    datasets: [
      {
        label: 'Revenue Distribution',
        data: stats.revenue_box_data || [],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  return (
    <div>
      {view === 'bar' && <Bar data={barData} />}
      {view === 'pie' && <Pie data={pieData} />}
      {view === 'box' && <Bar data={boxData} />}
    </div>
  );
}

export default Charts;