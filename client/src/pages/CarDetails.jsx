import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    backendUrl,
    user,
    token,
    setShowLogin,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  } = useAppContext();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {

  const fetchCar = async () => {
    try {

      const { data } = await axios.get(
        `${backendUrl}/api/user/cars`
      );

      if (data.success) {

        const foundCar =
          data.cars.find((c) => c._id === id);

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

  const fetchReviews = async () => {
    try {

      const { data } = await axios.get(
        `${backendUrl}/api/reviews/${id}`
      );

      if (data.success) {
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
      }

    } catch (error) {
      console.log(error);
    }
  };

  fetchCar();
  fetchReviews();

}, [id]);

  // Total Price Calculation
  const totalDays =
    pickupDate && returnDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(returnDate) - new Date(pickupDate)) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const totalPrice = car ? totalDays * car.pricePerDay : 0;

  // Check Availability
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
      const { data } = await axios.post(
        `${backendUrl}/api/bookings/check-availability`,
        {
          carId: id,
          pickupDate,
          returnDate,
        }
      );

      if (data.success) {
        setIsAvailable(data.available);

        if (data.available) {
          toast.success('Car is available!');
        } else {
          toast.error('Car is not available');
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to check availability'
      );
    }
  };

  const submitReview = async () => {

  if (!token) {
    setShowLogin(true);
    return;
  }

  try {

    const { data } = await axios.post(
      `${backendUrl}/api/reviews/add`,
      {
        carId: id,
        rating,
        comment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success) {

      toast.success("Review added!");

      setComment("");
      setRating(5);

      const updatedReviews = await axios.get(
        `${backendUrl}/api/reviews/${id}`
      );

      setReviews(updatedReviews.data.reviews);
      setAverageRating(
        updatedReviews.data.averageRating
      );
    }

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Failed to add review"
    );
  }
};

  // Razorpay Booking
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

      // Create Razorpay Order
      const { data } = await axios.post(
        `${backendUrl}/api/payment/create-order`,
        {
          amount: totalPrice,
        }
      );

      if (!data.success) {
        toast.error("Failed to initiate payment");
        return;
      }

      // Razorpay Popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "DriveEase",
        description: "Car Booking Payment",
        order_id: data.order.id,

        handler: async function (response) {

  // Verify payment
  const verifyRes = await axios.post(
    `${backendUrl}/api/payment/verify-payment`,
    {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    }
  );

  if (!verifyRes.data.success) {
    toast.error("Payment verification failed");
    return;
  }

  // Create booking after verification
  const bookingRes = await axios.post(
    `${backendUrl}/api/bookings/create`,
    {
      carId: id,
      pickupDate,
      returnDate,
    }
  );

  if (bookingRes.data.success) {
    toast.success("Payment Verified & Booking Confirmed!");
    navigate("/my-bookings");
  }
},

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },

        theme: {
          color: "#3B82F6",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Payment failed");
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

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Side */}
          <div className="lg:col-span-2">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl overflow-hidden"
            >

              <img
                src={car.image}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-[400px] object-cover"
              />

              <div className="p-6">

                <div className="flex justify-between items-start mb-4">

                  <div>
                    <h1 className="text-3xl font-bold">
                      {car.brand} {car.model}
                    </h1>

                    <p className="text-slate-400 mt-1">
                      {car.location}
                    </p>
                    <div className="flex items-center gap-2 mt-2">

                      <span className="text-yellow-400 text-lg">
                        ⭐
                      </span>

                      <span className="font-semibold">
                        {averageRating || 0}
                      </span>

                      <span className="text-slate-400 text-sm">
                        ({reviews.length} reviews)
                      </span>

                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-bold gradient-text">
                      ₹{car.pricePerDay}
                    </p>

                    <p className="text-sm text-slate-400">
                      per day
                    </p>
                  </div>

                </div>

                <p className="text-slate-300 leading-relaxed">
                  {car.description}
                </p>

              </div>
            </motion.div>
                        <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 mt-6"
            >

              <h2 className="text-2xl font-bold mb-4">
                Reviews & Ratings
              </h2>

              {/* Add Review */}
              <div className="space-y-4 mb-8">

                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="input-field"
                >
                  <option value="5">⭐ 5 Stars</option>
                  <option value="4">⭐ 4 Stars</option>
                  <option value="3">⭐ 3 Stars</option>
                  <option value="2">⭐ 2 Stars</option>
                  <option value="1">⭐ 1 Star</option>
                </select>

                <textarea
                  rows="4"
                  placeholder="Write your review..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="input-field"
                />

                <button
                  onClick={submitReview}
                  className="btn-primary"
                >
                  Submit Review
                </button>

              </div>

              {/* Reviews List */}
              <div className="space-y-4">

                {reviews.length === 0 ? (

                  <p className="text-slate-400">
                    No reviews yet
                  </p>

                ) : (

                  reviews.map((review) => (

                    <div
                      key={review._id}
                      className="bg-surface-dark/40 p-4 rounded-xl border border-slate-700/40"
                    >

                      <div className="flex items-center justify-between mb-2">

                        <h3 className="font-semibold">
                          {review.user?.name}
                        </h3>

                        <span className="text-yellow-400">
                          {'⭐'.repeat(review.rating)}
                        </span>

                      </div>

                      <p className="text-slate-300">
                        {review.comment}
                      </p>

                    </div>
                  ))
                )}

              </div>

            </motion.div>
          </div>

          

          {/* Booking Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6 h-fit sticky top-24"
          >

            <h2 className="text-xl font-bold mb-6">
              Book This Car
            </h2>

            <div className="space-y-4">

              <div>
                <label className="block text-sm mb-2">
                  Pickup Date
                </label>

                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => {
                    setPickupDate(e.target.value);
                    setIsAvailable(null);
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">
                  Return Date
                </label>

                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => {
                    setReturnDate(e.target.value);
                    setIsAvailable(null);
                  }}
                  min={pickupDate || new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>

              <button
                onClick={checkAvailability}
                className="w-full btn-secondary"
              >
                Check Availability
              </button>

              {totalDays > 0 && (
                <div className="bg-surface-dark/40 rounded-xl p-4 border border-slate-700/40">

                  <div className="flex justify-between mb-2">
                    <span>
                      ₹{car.pricePerDay} × {totalDays} day
                      {totalDays > 1 ? 's' : ''}
                    </span>

                    <span>
                      ₹{totalPrice}
                    </span>
                  </div>

                  <hr className="border-slate-700 my-2" />

                  <div className="flex justify-between font-bold text-lg">

                    <span>Total</span>

                    <span className="gradient-text">
                      ₹{totalPrice}
                    </span>

                  </div>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={booking || !pickupDate || !returnDate}
                className="w-full btn-primary disabled:opacity-50"
              >
                {booking
                  ? 'Processing...'
                  : token
                  ? 'Book Now'
                  : 'Sign In to Book'}
              </button>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default CarDetails;