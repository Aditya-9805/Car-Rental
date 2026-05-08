import express from 'express';

import {
  getUserData,
  getAllCars
} from '../controllers/userController.js';

import firebaseAuth from '../middleware/firebaseAuth.js';
import syncUser from '../middleware/syncUser.js';

const router = express.Router();

// REAL AUTH ROUTES

router.get(
  '/data',
  firebaseAuth,
  syncUser,
  getUserData
);

// PUBLIC
router.get(
  '/cars',
  getAllCars
);

export default router;