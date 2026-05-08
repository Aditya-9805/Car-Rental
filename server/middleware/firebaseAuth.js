import admin from '../config/firebaseAdmin.js';

const firebaseAuth = async (
  req,
  res,
  next
) => {

  try {

    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith('Bearer ')
    ) {

      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token =
      authHeader.split(' ')[1];

    const decodedToken =
      await admin.auth().verifyIdToken(
        token
      );

    req.user = decodedToken;

    next();

  } catch (error) {

    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

export default firebaseAuth;