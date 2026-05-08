import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl, user, token, setShowLogin, pickupDate, setPickupDate, returnDate, setReturnDate } = useAppContext();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/cars`);
        if (data.success) {
          const foundCar = data.cars.find((c) => c._id === id);
          if (foundCar) {
            setCar(foundCar);
          } else {
            toast.error('Car not found');
            navigate('/cars');
          }
        }
      } catch (error) {
        toast.error('Failed to load car details');
        navigate('/cars');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  // Calculate total price
  const totalDays = pickupDate && returnDate
    ? Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)))
    : 0;
  const totalPrice = car ? totalDays * car.pricePerDay : 0;

  const checkAvailability = async () => {
    if (!pickupDate || !returnDate) {
      toast.error('Please select both dates');
      return;
    }

    if (new Date(pickupDate) >= new Date(returnDate)) {
      toast.error('Return date must be after pickup date');
      return;
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/bookings/check-availability`, {
        carId: id,
        pickupDate,
        returnDate,
      });

      if (data.success) {
        setIsAvailable(data.available);
        if (data.available) {
          toast.success('Car is available for your dates!');
        } else {
          toast.error('Car is not available for these dates');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to check availability');
    }
  };

  const handleBooking = async () => {
    if (!token) {
      setShowLogin(true);
      return;
    }

    if (!pickupDate || !returnDate) {
      toast.error('Please select dates first');
      return;
    }

    setBooking(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/bookings/create`, {
        carId: id,
        pickupDate,
        returnDate,
      });

      if (data.success) {
        toast.success('Booking created successfully!');
        navigate('/my-bookings');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!car) return null;

  const specs = [
    { icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'Year', value: car.year },
    { icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', label: 'Category', value: car.category },
    { icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Fuel', value: car.fuelType },
    { icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', label: 'Transmission', value: car.transmission },
    { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', label: 'Seats', value: `${car.seatingCapacity} Passengers` },
    { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', label: 'Location', value: car.location },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Car Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <div className="relative h-64 sm:h-96">
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/60 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-4 py-1.5 text-sm font-semibold rounded-full bg-primary/20 text-primary-light backdrop-blur-sm border border-primary/20">
                  {car.category}
                </span>
              </div>
            </motion.div>

            {/* Title & Details */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{car.brand} {car.model}</h1>
                  <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {car.location}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold gradient-text">₹{car.pricePerDay?.toLocaleString()}</p>
                  <p className="text-sm text-slate-400">per day</p>
                </div>
              </div>

              {car.description && (
                <p className="text-slate-300 text-sm leading-relaxed mb-6">{car.description}</p>
              )}

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-dark/50 border border-slate-700/30">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={spec.icon} />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{spec.label}</p>
                      <p className="text-sm font-semibold text-white">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Owner Info */}
            {car.owner && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold mb-4">Listed By</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                    {car.owner.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{car.owner.name}</p>
                    <p className="text-sm text-slate-400">{car.owner.email}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Booking Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="glass rounded-2xl p-6 glow">
              <h3 className="text-lg font-bold mb-5">Book This Car</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Pickup Date</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => { setPickupDate(e.target.value); setIsAvailable(null); }}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Return Date</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => { setReturnDate(e.target.value); setIsAvailable(null); }}
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                    className="input-field"
                  />
                </div>

                {/* Availability Check */}
                <button
                  onClick={checkAvailability}
                  className="w-full btn-secondary !py-2.5"
                >
                  Check Availability
                </button>

                {isAvailable !== null && (
                  <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
                    isAvailable
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isAvailable ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                    {isAvailable ? 'Available for your dates!' : 'Not available for these dates'}
                  </div>
                )}

                {/* Price Breakdown */}
                {totalDays > 0 && (
                  <div className="p-4 rounded-xl bg-surface-dark/50 border border-slate-700/30 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">₹{car.pricePerDay?.toLocaleString()} × {totalDays} day{totalDays > 1 ? 's' : ''}</span>
                      <span className="text-white">₹{totalPrice.toLocaleString()}</span>
                    </div>
                    <hr className="border-slate-700/50" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="gradient-text text-lg">₹{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* Book Now */}
                <button
                  onClick={handleBooking}
                  disabled={booking || !pickupDate || !returnDate}
                  className="w-full btn-primary !py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {booking ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Booking...
                    </span>
                  ) : token ? 'Book Now' : 'Sign In to Book'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
