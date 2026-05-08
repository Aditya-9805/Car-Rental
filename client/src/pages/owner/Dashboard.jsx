import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

const Dashboard = () => {
  const { backendUrl } = useAppContext();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/owner/dashboard`);
      if (data.success) {
        setDashboard(data.dashboard);
      }
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Total Cars',
      value: dashboard?.totalCars || 0,
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Total Bookings',
      value: dashboard?.totalBookings || 0,
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      gradient: 'from-violet-500 to-purple-500',
      bg: 'bg-violet-500/10',
    },
    {
      title: 'Pending',
      value: dashboard?.pendingBookings || 0,
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-500/10',
    },
    {
      title: 'Monthly Revenue',
      value: `₹${(dashboard?.monthlyRevenue || 0).toLocaleString()}`,
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      gradient: 'from-emerald-500 to-green-500',
      bg: 'bg-emerald-500/10',
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-1">Owner Dashboard</h1>
        <p className="text-slate-400 text-sm mb-8">Overview of your car rental business.</p>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metricCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass rounded-2xl p-5 card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center`}>
                <svg className={`w-5 h-5 bg-gradient-to-r ${card.gradient} bg-clip-text`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ stroke: 'url(#gradient)' }}>
                  <defs>
                    <linearGradient id="gradient">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-slate-400 mt-1">{card.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="text-lg font-bold mb-5">Recent Bookings</h2>

        {dashboard?.recentBookings?.length > 0 ? (
          <div className="space-y-3">
            {dashboard.recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="flex items-center gap-4 p-4 rounded-xl bg-surface-dark/40 border border-slate-700/20 hover:border-slate-700/40 transition-colors"
              >
                {booking.car?.image && (
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                    <img src={booking.car.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {booking.car?.brand} {booking.car?.model}
                  </p>
                  <p className="text-xs text-slate-400">
                    by {booking.user?.name} • {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold">₹{booking.price?.toLocaleString()}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' ? 'badge-confirmed' :
                    booking.status === 'cancelled' ? 'badge-cancelled' : 'badge-pending'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">No bookings yet. Start by listing your first car!</p>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
