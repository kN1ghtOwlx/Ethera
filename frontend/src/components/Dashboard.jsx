import { useState, useEffect } from 'react';
import api from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/tasks/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!stats) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Tasks" value={stats.total} color="bg-blue-600" />
        <StatCard title="Pending" value={stats.pending} color="bg-yellow-500" />
        <StatCard title="In Progress" value={stats.inProgress} color="bg-cyan-500" />
        <StatCard title="Completed" value={stats.completed} color="bg-green-600" />
        <StatCard title="Overdue" value={stats.overdue} color="bg-red-600" />
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className={`${color} text-white rounded-lg p-6 shadow-sm`}>
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-sm opacity-90">{title}</p>
    </div>
  );
}