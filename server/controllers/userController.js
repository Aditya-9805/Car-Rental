import User from '../models/User.js';
import Car from '../models/Car.js';

// GET LOGGED IN USER
export const getUserData =
  async (req, res) => {

    try {

      const user =
        await User.findById(

          req.userData._id

        );

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            'User not found'

        });
      }

      res.json({

        success: true,

        user

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message

      });
    }
  };

// GET ALL CARS
export const getAllCars =
  async (req, res) => {

    try {

      const cars =
        await Car.find({

          isAvailable: true

        })

          .populate(
            'owner',
            'name email image'
          )

          .sort({
            createdAt: -1
          });

      res.json({

        success: true,

        cars

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message

      });
    }
  };