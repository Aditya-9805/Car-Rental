import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

const ManageBookings = () => {
  const { backendUrl } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/bookings/owner`);
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, status) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/bookings/change-status`, {
        bookingId,
        status,
      });
      if (data.success) {
        toast.success(data.message);
        fetchBookings();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change status');
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
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-1">Manage Bookings</h1>
        <p className="text-slate-400 text-sm mb-8">Review and manage incoming booking requests.</p>
      </motion.div>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking, i) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex flex-col lg:flex-row gap-5">
                {/* Car Image */}
                {booking.car?.image && (
                  <div className="w-full lg:w-32 h-24 rounded-xl overflow-hidden shrink-0">
                    <img src={booking.car.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Booking Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-bold">{booking.car?.brand} {booking.car?.model}</h3>
                      <p className="text-sm text-slate-400 mt-0.5">
                        Booked by <span className="text-slate-200">{booking.user?.name}</span> ({booking.user?.email})
                      </p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="p-2.5 rounded-lg bg-surface-dark/50">
                      <p className="text-xs text-slate-400">Pickup</p>
                      <p className="text-sm font-semibold">{new Date(booking.pickupDate).toLocaleDateString()}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface-dark/50">
                      <p className="text-xs text-slate-400">Return</p>
                      <p className="text-sm font-semibold">{new Date(booking.returnDate).toLocaleDateString()}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface-dark/50">
                      <p className="text-xs text-slate-400">Total Price</p>
                      <p className="text-sm font-bold gradient-text">₹{booking.price?.toLocaleString()}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface-dark/50">
                      <p className="text-xs text-slate-400">Booked On</p>
                      <p className="text-sm font-semibold">{new Date(booking.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {booking.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleStatusChange(booking._id, 'confirmed')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusChange(booking._id, 'cancelled')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 glass rounded-2xl"
        >
          <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-slate-400 text-lg">No bookings received yet</p>
          <p className="text-slate-500 text-sm mt-1">Bookings will appear here when customers book your cars.</p>
        </motion.div>
      )}
    </div>
  );
};

export default ManageBookings;
