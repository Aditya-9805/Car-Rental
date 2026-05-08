import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import CarCard from '../components/CarCard';

const Cars = () => {
  const { cars } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');

  const categories = ['All', 'SUV', 'Sedan', 'Hatchback', 'Coupe', 'Convertible', 'Truck', 'Van', 'Luxury'];
  const fuelTypes = ['All', 'Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
  const transmissions = ['All', 'Automatic', 'Manual'];

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesSearch =
        car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || car.category === selectedCategory;
      const matchesFuel = selectedFuel === 'All' || car.fuelType === selectedFuel;
      const matchesTransmission = selectedTransmission === 'All' || car.transmission === selectedTransmission;

      return matchesSearch && matchesCategory && matchesFuel && matchesTransmission;
    });
  }, [cars, searchQuery, selectedCategory, selectedFuel, selectedTransmission]);

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Browse Our <span className="gradient-text">Fleet</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Discover the perfect car for every occasion. Filter by type, fuel, and more.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass p-6 mb-10"
        >
          {/* Search Bar */}
          <div className="relative mb-5">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by brand, model, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field !pl-12 !py-3.5"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Fuel Type</label>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="input-field"
              >
                {fuelTypes.map((fuel) => (
                  <option key={fuel} value={fuel} className="bg-slate-800">{fuel}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Transmission</label>
              <select
                value={selectedTransmission}
                onChange={(e) => setSelectedTransmission(e.target.value)}
                className="input-field"
              >
                {transmissions.map((t) => (
                  <option key={t} value={t} className="bg-slate-800">{t}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-slate-400">
            Showing <span className="text-white font-semibold">{filteredCars.length}</span> cars
          </p>
          {(searchQuery || selectedCategory !== 'All' || selectedFuel !== 'All' || selectedTransmission !== 'All') && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedFuel('All'); setSelectedTransmission('All'); }}
              className="text-sm text-primary hover:text-primary-light transition-colors font-medium"
            >
              Clear Filters ×
            </button>
          )}
        </div>

        {/* Cars Grid */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car, i) => (
              <motion.div
                key={car._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 glass max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-800/50 flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-slate-300 text-xl font-semibold">No cars found</p>
            <p className="text-slate-500 text-sm mt-2">Try adjusting your filters or search query.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Cars;
