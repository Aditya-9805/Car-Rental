import User from '../models/User.js';

const syncUser = async (
  req,
  res,
  next
) => {

  try {

    const firebaseUser = req.user;

    let user =
      await User.findOne({

        firebaseUID:
          firebaseUser.uid

      });

    // CREATE USER IF NOT EXISTS
    if (!user) {

      user = await User.create({

        firebaseUID:
          firebaseUser.uid,

        name:
          firebaseUser.name ||

          firebaseUser.email?.split('@')[0] ||

          'User',

        email:
          firebaseUser.email,

        image:
          firebaseUser.picture || '',

      });
    }

    // ATTACH DB USER
    req.userData = user;

    next();

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });
  }
};

export default syncUser;