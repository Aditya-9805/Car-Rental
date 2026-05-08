import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import CarCard from '../components/CarCard';

const Home = () => {
  const { cars, pickupDate, setPickupDate, returnDate, setReturnDate } = useAppContext();
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const featuredCars = cars.slice(0, 6);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/cars');
  };

  const testimonials = [
    { name: 'Rahul Sharma', role: 'Business Traveler', text: 'DriveEase made my business trip so much smoother. The booking process was seamless and the car was in perfect condition.', rating: 5 },
    { name: 'Priya Patel', role: 'Weekend Explorer', text: 'Amazing selection of cars! I rented an SUV for a family trip and it was an incredible experience. Highly recommend!', rating: 5 },
    { name: 'Arjun Kapoor', role: 'Daily Commuter', text: 'Best car rental platform I\'ve used. Transparent pricing, great cars, and excellent customer support. 5 stars!', rating: 5 },
  ];

  const stats = [
    { number: '500+', label: 'Cars Available' },
    { number: '10K+', label: 'Happy Customers' },
    { number: '50+', label: 'Cities Covered' },
    { number: '24/7', label: 'Customer Support' },
  ];

  return (
    <div className="overflow-hidden">
      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-slate-900 to-surface-dark" />
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="inline-block px-5 py-2 mb-8 text-sm font-medium rounded-full bg-primary/10 text-primary-light border border-primary/20">
              🚗 Premium Car Rental Platform
            </span>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-6">
              Find Your Perfect
              <br />
              <span className="gradient-text">Drive Today</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Browse hundreds of premium vehicles from verified owners. 
              Book instantly, drive confidently, and explore without limits.
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            onSubmit={handleSearch}
            className="glass p-6 sm:p-8 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-2 text-left">Location</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Where do you want to go?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input-field !pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2 text-left">Pickup Date</label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2 text-left">Return Date</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            <button type="submit" className="w-full btn-primary !py-3.5 mt-5 text-base">
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Available Cars
              </span>
            </button>
          </motion.form>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold gradient-text">{stat.number}</p>
                <p className="text-sm text-slate-400 mt-2">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ FEATURED CARS ============ */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-primary tracking-widest uppercase">Our Fleet</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3 mb-5">
              Featured <span className="gradient-text">Cars</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">
              Handpicked vehicles from our top-rated owners, ready for your next adventure.
            </p>
          </motion.div>

          {featuredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map((car, i) => (
                <motion.div
                  key={car._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <CarCard car={car} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center py-20 glass max-w-2xl mx-auto"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-800/50 flex items-center justify-center">
                <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-slate-300 text-xl font-semibold">No cars available yet</p>
              <p className="text-slate-500 text-sm mt-2">Check back soon or become an owner to list your car!</p>
            </motion.div>
          )}

          {cars.length > 6 && (
            <div className="text-center mt-12">
              <button onClick={() => navigate('/cars')} className="btn-secondary !px-8 !py-3">
                View All Cars →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/15 rounded-full blur-[100px]" />

            <div className="relative glass !rounded-3xl px-8 py-16 sm:px-16 sm:py-20 text-center">
              <h2 className="text-3xl sm:text-5xl font-bold mb-6">
                Own a Car? <span className="gradient-text">Start Earning Today</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
                List your car on DriveEase and start earning passive income. 
                Join our community of trusted car owners and make your vehicle work for you.
              </p>
              <button onClick={() => navigate('/owner')} className="btn-primary !px-10 !py-4 !text-base">
                Become an Owner →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-primary tracking-widest uppercase">Testimonials</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3 mb-5">
              What Our <span className="gradient-text">Customers Say</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="glass p-8 card-hover"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
