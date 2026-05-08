import express from 'express';
import multer from 'multer';

import {
  changeRole,
  addCar,
  getDashboard,
  toggleCar,
  deleteCar,
  updateImage
} from '../controllers/ownerController.js';

import firebaseAuth from '../middleware/firebaseAuth.js';
import syncUser from '../middleware/syncUser.js';

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage });

// REAL AUTH + USER SYNC

router.post(
  '/change-role',
  firebaseAuth,
  syncUser,
  changeRole
);

router.post(
  '/add-car',
  firebaseAuth,
  syncUser,
  upload.single('image'),
  addCar
);

router.get(
  '/dashboard',
  firebaseAuth,
  syncUser,
  getDashboard
);

router.post(
  '/toggle-car',
  firebaseAuth,
  syncUser,
  toggleCar
);

router.post(
  '/delete-car',
  firebaseAuth,
  syncUser,
  deleteCar
);

router.post(
  '/update-image',
  firebaseAuth,
  syncUser,
  upload.single('image'),
  updateImage
);

export default router;