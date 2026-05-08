import User from '../models/User.js';
import Car from '../models/Car.js';
import Booking from '../models/Booking.js';
import imagekit from '../config/imagekit.js';

// CHANGE ROLE
// CHANGE ROLE
export const changeRole = async (
  req,
  res
) => {

  try {

    const user =
      req.userData;

    user.role = 'owner';

    await user.save();

    res.json({

      success: true,

      message:
        'Owner mode enabled',

      user

    });

  } catch (error) {

    console.log(
      'CHANGE ROLE ERROR:',
      error
    );

    res.status(500).json({

      success: false,

      message: error.message

    });
  }
};

// ADD CAR
export const addCar = async (
  req,
  res
) => {

  try {

    console.log(
      'BODY:',
      req.body
    );

    console.log(
      'FILE:',
      req.file
    );

    console.log(
      'USER:',
      req.userData
    );

    const {
      brand,
      model,
      year,
      category,
      seatingCapacity,
      fuelType,
      transmission,
      pricePerDay,
      location,
      description
    } = req.body;

    if (!req.file) {

      return res.status(400).json({

        success: false,

        message:
          'Please upload image'

      });
    }

    // UPLOAD IMAGE

    const uploadResponse =
      await imagekit.upload({

        file: req.file.buffer,

        fileName:
          `car_${Date.now()}.webp`,

        folder: '/car-rental',

      });

    console.log(
      'IMAGE UPLOADED:',
      uploadResponse.url
    );

    // CREATE CAR

    const car =
      await Car.create({

        owner:
          req.userData._id,

        brand,

        model,

        image:
          uploadResponse.url,

        year:
          Number(year),

        category,

        seatingCapacity:
          Number(seatingCapacity),

        fuelType,

        transmission,

        pricePerDay:
          Number(pricePerDay),

        location,

        description:
          description || '',

      });

    console.log(
      'CAR CREATED:',
      car
    );

    res.status(201).json({

      success: true,

      message:
        'Car added successfully',

      car

    });

  } catch (error) {

    console.log(
      'ADD CAR ERROR:',
      error
    );

    res.status(500).json({

      success: false,

      message: error.message

    });
  }
};

// DASHBOARD
export const getDashboard = async (
  req,
  res
) => {

  try {

    const ownerId =
      req.userData._id;

    const totalCars =
      await Car.countDocuments({

        owner: ownerId

      });

    const totalBookings =
      await Booking.countDocuments({

        owner: ownerId

      });

    const pendingBookings =
      await Booking.countDocuments({

        owner: ownerId,

        status: 'pending'

      });

    const confirmedBookings =
      await Booking.countDocuments({

        owner: ownerId,

        status: 'confirmed'

      });

    const recentBookings =
      await Booking.find({

        owner: ownerId

      })

        .populate(
          'car',
          'brand model image'
        )

        .sort({
          createdAt: -1
        })

        .limit(5);

    res.json({

      success: true,

      dashboard: {

        totalCars,

        totalBookings,

        pendingBookings,

        confirmedBookings,

        monthlyRevenue: 0,

        recentBookings,

      },

    });

  } catch (error) {

    console.log(
      'DASHBOARD ERROR:',
      error
    );

    res.status(500).json({

      success: false,

      message: error.message

    });
  }
};

// TOGGLE CAR
export const toggleCar = async (
  req,
  res
) => {

  try {

    const { carId } =
      req.body;

    const car =
      await Car.findById(carId);

    if (!car) {

      return res.status(404).json({

        success: false,

        message:
          'Car not found'

      });
    }

    if (
      car.owner.toString() !==
      req.userData._id.toString()
    ) {

      return res.status(403).json({

        success: false,

        message:
          'Unauthorized'

      });
    }

    car.isAvailable =
      !car.isAvailable;

    await car.save();

    res.json({

      success: true,

      message:
        `Car marked ${
          car.isAvailable
            ? 'available'
            : 'unavailable'
        }`,

      car

    });

  } catch (error) {

    console.log(
      'TOGGLE CAR ERROR:',
      error
    );

    res.status(500).json({

      success: false,

      message: error.message

    });
  }
};

// DELETE CAR
export const deleteCar = async (
  req,
  res
) => {

  try {

    const { carId } =
      req.body;

    const car =
      await Car.findById(carId);

    if (!car) {

      return res.status(404).json({

        success: false,

        message:
          'Car not found'

      });
    }

    if (
      car.owner.toString() !==
      req.userData._id.toString()
    ) {

      return res.status(403).json({

        success: false,

        message:
          'Unauthorized'

      });
    }

    await Car.findByIdAndDelete(
      carId
    );

    res.json({

      success: true,

      message:
        'Car deleted'

    });

  } catch (error) {

    console.log(
      'DELETE CAR ERROR:',
      error
    );

    res.status(500).json({

      success: false,

      message: error.message

    });
  }
};

// UPDATE IMAGE
export const updateImage = async (
  req,
  res
) => {

  try {

    const { carId } =
      req.body;

    const car =
      await Car.findById(carId);

    if (!car) {

      return res.status(404).json({

        success: false,

        message:
          'Car not found'

      });
    }

    if (
      car.owner.toString() !==
      req.userData._id.toString()
    ) {

      return res.status(403).json({

        success: false,

        message:
          'Unauthorized'

      });
    }

    if (!req.file) {

      return res.status(400).json({

        success: false,

        message:
          'Please upload image'

      });
    }

    const uploadResponse =
      await imagekit.upload({

        file: req.file.buffer,

        fileName:
          `car_${Date.now()}.webp`,

        folder: '/car-rental',

      });

    car.image =
      uploadResponse.url;

    await car.save();

    res.json({

      success: true,

      message:
        'Image updated',

      car

    });

  } catch (error) {

    console.log(
      'UPDATE IMAGE ERROR:',
      error
    );

    res.status(500).json({

      success: false,

      message: error.message

    });
  }
};