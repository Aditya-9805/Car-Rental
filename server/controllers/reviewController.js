import Review from "../models/Review.js";

// Add Review
export const addReview = async (req, res) => {
  try {

    const { carId, rating, comment } = req.body;

    // Prevent duplicate review
    const existingReview = await Review.findOne({
      user: "681c7c9d8b6f9c0012345678",
      car: carId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this car",
      });
    }

    const review = await Review.create({
      user: "681c7c9d8b6f9c0012345678",
      car: carId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to add review",
    });
  }
};

// Get Reviews
export const getReviews = async (req, res) => {
  try {

    const { carId } = req.params;

    const reviews = await Review.find({
      car: carId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews > 0
        ? (
            reviews.reduce(
              (acc, item) => acc + item.rating,
              0
            ) / totalReviews
          ).toFixed(1)
        : 0;

    res.status(200).json({
      success: true,
      reviews,
      averageRating,
      totalReviews,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};