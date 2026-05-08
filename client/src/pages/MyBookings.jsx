import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const MyBookings = () => {
  const { backendUrl } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/bookings/user`);
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'badge-pending',
      confirmed: 'badge-confirmed',
      cancelled: 'badge-cancelled',
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {status === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 pulse-dot" />}
        {status === 'confirmed' && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
        {status === 'cancelled' && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-2">
            My <span className="gradient-text">Bookings</span>
          </h1>
          <p className="text-slate-400 mb-8">Track and manage all your car rental bookings.</p>
        </motion.div>

        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking, i) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass rounded-2xl p-5 card-hover"
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Car Image */}
                  {booking.car?.image && (
                    <div className="w-full sm:w-40 h-28 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={booking.car.image}
                        alt={`${booking.car.brand} ${booking.car.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-lg font-bold">
                          {booking.car?.brand} {booking.car?.model}
                        </h3>
                        <p className="text-sm text-slate-400 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {booking.car?.location}
                        </p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-2.5 rounded-lg bg-surface-dark/50">
                        <p className="text-xs text-slate-400">Pickup</p>
                        <p className="text-sm font-semibold">{new Date(booking.pickupDate).toLocaleDateString()}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-surface-dark/50">
                        <p className="text-xs text-slate-400">Return</p>
                        <p className="text-sm font-semibold">{new Date(booking.returnDate).toLocaleDateString()}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-surface-dark/50">
                        <p className="text-xs text-slate-400">Daily Rate</p>
                        <p className="text-sm font-semibold">₹{booking.car?.pricePerDay?.toLocaleString()}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-surface-dark/50">
                        <p className="text-xs text-slate-400">Total</p>
                        <p className="text-sm font-bold gradient-text">₹{booking.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 glass rounded-2xl"
          >
            <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-slate-400 text-lg">No bookings yet</p>
            <p className="text-slate-500 text-sm mt-1">Start exploring and book your first car!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
