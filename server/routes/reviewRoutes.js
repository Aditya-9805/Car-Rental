import express from "express";

import {
  addReview,
  getReviews,
} from "../controllers/reviewController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

// Add Review
router.post(
  "/add",
  addReview
);

// Get Reviews
router.get(
  "/:carId",
  getReviews
);

export default router;