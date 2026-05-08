import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

const ManageCars = () => {

  const {
    backendUrl,
    cars,
    fetchCars
  } = useAppContext();

  const [myCars, setMyCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadCars();

  }, []);

  const loadCars = async () => {

    try {

      const token =
        localStorage.getItem('token');

      // GET CURRENT USER
      const userRes =
        await axios.get(

          `${backendUrl}/api/user/data`,

          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }

        );

      const currentUserId =
        userRes.data.user._id;

      // FETCH ALL CARS
      const carsRes =
        await axios.get(

          `${backendUrl}/api/user/cars`
        );

      const allCars =
        carsRes.data.cars;

      // FILTER OWNER CARS
      const filteredCars =
        allCars.filter(

          (car) =>

            car.owner === currentUserId ||

            car.owner?._id === currentUserId

        );

      setMyCars(filteredCars);

    } catch (error) {

      console.log(error);

      toast.error(
        'Failed to fetch your cars'
      );

    } finally {

      setLoading(false);

    }
  };

  // TOGGLE
  const handleToggle = async (carId) => {

    try {

      const token =
        localStorage.getItem('token');

      const { data } =
        await axios.post(

          `${backendUrl}/api/owner/toggle-car`,

          { carId },

          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }

        );

      if (data.success) {

        toast.success(data.message);

        loadCars();

      }

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        'Failed to toggle car'

      );
    }
  };

  // DELETE
  const handleDelete = async (carId) => {

    const confirmDelete =
      window.confirm(
        'Delete this car?'
      );

    if (!confirmDelete) return;

    try {

      const token =
        localStorage.getItem('token');

      const { data } =
        await axios.post(

          `${backendUrl}/api/owner/delete-car`,

          { carId },

          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }

        );

      if (data.success) {

        toast.success(data.message);

        loadCars();

      }

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        'Failed to delete car'

      );
    }
  };

  // LOADING
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

        <h1 className="text-2xl font-bold mb-1">

          Manage Cars

        </h1>

        <p className="text-slate-400 text-sm mb-8">

          Toggle availability or remove your listed vehicles.

        </p>

      </motion.div>

      {myCars.length > 0 ? (

        <div className="space-y-4">

          {myCars.map((car, i) => (

            <motion.div

              key={car._id}

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{
                duration: 0.4,
                delay: i * 0.08
              }}

              className="glass rounded-2xl p-4 sm:p-5"

            >

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

                {/* IMAGE */}
                <div className="w-full sm:w-24 h-20 rounded-xl overflow-hidden shrink-0">

                  <img
                    src={car.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />

                </div>

                {/* INFO */}
                <div className="flex-1 min-w-0">

                  <h3 className="font-bold">

                    {car.brand} {car.model}

                  </h3>

                  <p className="text-sm text-slate-400">

                    {car.year} • {car.category} • {car.location}

                  </p>

                  <p className="text-sm font-semibold text-primary mt-1">

                    ₹{car.pricePerDay?.toLocaleString()}/day

                  </p>

                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">

                  {/* TOGGLE */}
                  <button

                    onClick={() =>
                      handleToggle(car._id)
                    }

                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      car.isAvailable
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                    }`}

                  >

                    {car.isAvailable
                      ? 'Available'
                      : 'Unavailable'}

                  </button>

                  {/* DELETE */}
                  <button

                    onClick={() =>
                      handleDelete(car._id)
                    }

                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"

                  >

                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />

                    </svg>

                  </button>

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

          <svg
            className="w-16 h-16 mx-auto mb-4 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />

          </svg>

          <p className="text-slate-400 text-lg">

            No cars listed yet

          </p>

          <p className="text-slate-500 text-sm mt-1">

            Add your first car to start receiving bookings.

          </p>

        </motion.div>

      )}

    </div>
  );
};

export default ManageCars;