import { useState } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getAuth } from 'firebase/auth';
import { useAppContext } from '../../context/AppContext';

const AddCar = () => {

  const { backendUrl, fetchCars } =
    useAppContext();

  const [loading, setLoading] =
    useState(false);

  const [imagePreview, setImagePreview] =
    useState(null);

  const [formData, setFormData] =
    useState({

      brand: '',

      model: '',

      year: '',

      category: 'Sedan',

      seatingCapacity: '',

      fuelType: 'Petrol',

      transmission: 'Automatic',

      pricePerDay: '',

      location: '',

      description: '',

    });

  const [imageFile, setImageFile] =
    useState(null);

  const categories = [

    'SUV',

    'Sedan',

    'Hatchback',

    'Coupe',

    'Convertible',

    'Truck',

    'Van',

    'Luxury'

  ];

  const fuelTypes = [

    'Petrol',

    'Diesel',

    'Electric',

    'Hybrid',

    'CNG'

  ];

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value

    });
  };

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (file) {

      setImageFile(file);

      setImagePreview(
        URL.createObjectURL(file)
      );
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const auth = getAuth();

      const token =
        await auth.currentUser.getIdToken();

      const data = new FormData();

      Object.keys(formData).forEach(

        (key) => {

          data.append(
            key,
            formData[key]
          );
        }
      );

      if (imageFile) {

        data.append(
          'image',
          imageFile
        );
      }

      const response =
        await axios.post(

          `${backendUrl}/api/owner/add-car`,

          data,

          {
            headers: {

              Authorization:
                `Bearer ${token}`,

              'Content-Type':
                'multipart/form-data',

            },
          }
        );

      if (response.data.success) {

        toast.success(
          'Car added successfully!'
        );

        fetchCars();

        // RESET FORM

        setFormData({

          brand: '',

          model: '',

          year: '',

          category: 'Sedan',

          seatingCapacity: '',

          fuelType: 'Petrol',

          transmission: 'Automatic',

          pricePerDay: '',

          location: '',

          description: '',

        });

        setImageFile(null);

        setImagePreview(null);
      }

    } catch (error) {

      console.log(error);

      toast.error(

        error.response?.data?.message ||

        'Failed to add car'
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div>

      <motion.div

        initial={{
          opacity: 0,
          y: 20
        }}

        animate={{
          opacity: 1,
          y: 0
        }}

        transition={{
          duration: 0.5
        }}
      >

        <h1 className="text-2xl font-bold mb-1">

          Add New Car

        </h1>

        <p className="text-slate-400 text-sm mb-8">

          List a new vehicle on DriveEase.

        </p>

      </motion.div>

      <motion.form

        initial={{
          opacity: 0,
          y: 20
        }}

        animate={{
          opacity: 1,
          y: 0
        }}

        transition={{
          duration: 0.5,
          delay: 0.15
        }}

        onSubmit={handleSubmit}

        className="glass rounded-2xl p-6 max-w-3xl"
      >

        {/* IMAGE */}

        <div className="mb-6">

          <label className="block text-sm font-medium text-slate-300 mb-2">

            Car Image

          </label>

          <div

            onClick={() =>
              document
                .getElementById(
                  'car-image-input'
                )
                .click()
            }

            className="relative w-full h-48 rounded-xl border-2 border-dashed border-slate-600 hover:border-primary/50 transition-colors cursor-pointer overflow-hidden group"
          >

            {imagePreview ? (

              <>
                <img

                  src={imagePreview}

                  alt="Preview"

                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">

                  <p className="text-white text-sm font-medium">

                    Click to change

                  </p>

                </div>
              </>

            ) : (

              <div className="flex flex-col items-center justify-center h-full text-slate-400">

                <svg

                  className="w-10 h-10 mb-2"

                  fill="none"

                  stroke="currentColor"

                  viewBox="0 0 24 24"
                >

                  <path

                    strokeLinecap="round"

                    strokeLinejoin="round"

                    strokeWidth={1.5}

                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />

                </svg>

                <p className="text-sm">

                  Click to upload car image

                </p>

              </div>
            )}
          </div>

          <input

            type="file"

            id="car-image-input"

            accept="image/*"

            onChange={handleImageChange}

            className="hidden"
          />

        </div>

        {/* FORM */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="input-field"
            required
          />

          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Model"
            className="input-field"
            required
          />

          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="Year"
            className="input-field"
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
          >

            {categories.map((cat) => (

              <option
                key={cat}
                value={cat}
              >

                {cat}

              </option>
            ))}
          </select>

          <input
            type="number"
            name="seatingCapacity"
            value={formData.seatingCapacity}
            onChange={handleChange}
            placeholder="Seats"
            className="input-field"
            required
          />

          <select
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            className="input-field"
          >

            {fuelTypes.map((fuel) => (

              <option
                key={fuel}
                value={fuel}
              >

                {fuel}

              </option>
            ))}
          </select>

          <select
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            className="input-field"
          >

            <option value="Automatic">

              Automatic

            </option>

            <option value="Manual">

              Manual

            </option>

          </select>

          <input
            type="number"
            name="pricePerDay"
            value={formData.pricePerDay}
            onChange={handleChange}
            placeholder="Price Per Day"
            className="input-field"
            required
          />

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="input-field sm:col-span-2"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
            className="input-field resize-none sm:col-span-2"
          />

        </div>

        <button

          type="submit"

          disabled={loading}

          className="btn-primary !py-3 w-full sm:w-auto mt-6 disabled:opacity-50"
        >

          {loading
            ? 'Adding Car...'
            : 'Add Car'}

        </button>

      </motion.form>

    </div>
  );
};

export default AddCar;