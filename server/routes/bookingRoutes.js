import express from 'express';

import {
  checkAvailability,
  createBooking,
  getUserBookings,
  getOwnerBookings,
  changeBookingStatus
} from '../controllers/bookingController.js';

import firebaseAuth from '../middleware/firebaseAuth.js';
import syncUser from '../middleware/syncUser.js';

const router = express.Router();

router.post(
  '/check-availability',
  checkAvailability
);

router.post(
  '/create',
  firebaseAuth,
  syncUser,
  createBooking
);

router.get(
  '/user',
  firebaseAuth,
  syncUser,
  getUserBookings
);

router.get(
  '/owner',
  firebaseAuth,
  syncUser,
  getOwnerBookings
);

router.post(
  '/change-status',
  firebaseAuth,
  syncUser,
  changeBookingStatus
);

export default router;