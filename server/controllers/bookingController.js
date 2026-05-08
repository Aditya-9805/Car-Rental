import Booking from '../models/Booking.js';
import Car from '../models/Car.js';

// Check Availability
export const checkAvailability =
  async (req, res) => {

    try {

      const {
        carId,
        pickupDate,
        returnDate
      } = req.body;

      if (
        !carId ||
        !pickupDate ||
        !returnDate
      ) {

        return res.status(400).json({

          success: false,

          message:
            'Please provide carId, pickupDate, and returnDate'

        });
      }

      const pickup =
        new Date(pickupDate);

      const returnD =
        new Date(returnDate);

      if (pickup >= returnD) {

        return res.status(400).json({

          success: false,

          message:
            'Return date must be after pickup date'

        });
      }

      const conflictingBooking =
        await Booking.findOne({

          car: carId,

          status: {
            $ne: 'cancelled'
          },

          $or: [
            {
              pickupDate: {
                $lt: returnD
              },

              returnDate: {
                $gt: pickup
              }
            },
          ],
        });

      if (conflictingBooking) {

        return res.json({

          success: true,

          available: false,

          message:
            'Car is not available for selected dates'

        });
      }

      res.json({

        success: true,

        available: true,

        message:
          'Car is available'

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message

      });
    }
  };

// Create Booking
export const createBooking =
  async (req, res) => {

    try {

      const {
        carId,
        pickupDate,
        returnDate
      } = req.body;

      if (
        !carId ||
        !pickupDate ||
        !returnDate
      ) {

        return res.status(400).json({

          success: false,

          message:
            'Please provide booking details'

        });
      }

      const car =
        await Car.findById(carId);

      if (!car) {

        return res.status(404).json({

          success: false,

          message:
            'Car not found'

        });
      }

      // PREVENT BOOKING OWN CAR
      if (
        car.owner.toString() ===
        req.userData._id.toString()
      ) {

        return res.status(400).json({

          success: false,

          message:
            'You cannot book your own car'

        });
      }

      const pickup =
        new Date(pickupDate);

      const returnD =
        new Date(returnDate);

      if (pickup >= returnD) {

        return res.status(400).json({

          success: false,

          message:
            'Invalid booking dates'

        });
      }

      // CHECK CONFLICT
      const conflictingBooking =
        await Booking.findOne({

          car: carId,

          status: {
            $ne: 'cancelled'
          },

          $or: [
            {
              pickupDate: {
                $lt: returnD
              },

              returnDate: {
                $gt: pickup
              }
            },
          ],
        });

      if (conflictingBooking) {

        return res.status(400).json({

          success: false,

          message:
            'Car already booked for selected dates'

        });
      }

      const days = Math.ceil(

        (returnD - pickup) /

        (1000 * 60 * 60 * 24)

      );

      const totalPrice =
        days * car.pricePerDay;

      const booking =
        await Booking.create({

          car: carId,

          user:
            req.userData._id,

          owner:
            car.owner,

          pickupDate: pickup,

          returnDate: returnD,

          price: totalPrice,

          status: 'pending',

        });

      res.status(201).json({

        success: true,

        message:
          'Booking created successfully',

        booking

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message

      });
    }
  };

// User Bookings
export const getUserBookings =
  async (req, res) => {

    try {

      const bookings =
        await Booking.find({

          user:
            req.userData._id

        })

          .populate(

            'car',

            'brand model image pricePerDay location'

          )

          .sort({
            createdAt: -1
          });

      res.json({

        success: true,

        bookings

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message

      });
    }
  };

// Owner Bookings
export const getOwnerBookings =
  async (req, res) => {

    try {

      const bookings =
        await Booking.find({

          owner:
            req.userData._id

        })

          .populate(

            'car',

            'brand model image pricePerDay location'

          )

          .populate(

            'user',

            'name email image'

          )

          .sort({
            createdAt: -1
          });

      res.json({

        success: true,

        bookings

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message

      });
    }
  };

// Change Booking Status
export const changeBookingStatus =
  async (req, res) => {

    try {

      const {
        bookingId,
        status
      } = req.body;

      const booking =
        await Booking.findById(
          bookingId
        );

      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            'Booking not found'

        });
      }

      // SECURITY CHECK
      if (
        booking.owner.toString() !==
        req.userData._id.toString()
      ) {

        return res.status(403).json({

          success: false,

          message:
            'Unauthorized'

        });
      }

      booking.status = status;

      await booking.save();

      res.json({

        success: true,

        message:
          `Booking ${status} successfully`,

        booking

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message

      });
    }
  };