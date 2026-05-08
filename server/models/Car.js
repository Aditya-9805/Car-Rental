import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'Image is required'],
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['SUV', 'Sedan', 'Hatchback', 'Coupe', 'Convertible', 'Truck', 'Van', 'Luxury'],
  },
  seatingCapacity: {
    type: Number,
    required: [true, 'Seating capacity is required'],
    min: 1,
    max: 15,
  },
  fuelType: {
    type: String,
    required: [true, 'Fuel type is required'],
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
  },
  transmission: {
    type: String,
    required: [true, 'Transmission is required'],
    enum: ['Automatic', 'Manual'],
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Price per day is required'],
    min: 0,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);
export default Car;
