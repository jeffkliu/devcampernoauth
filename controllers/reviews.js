const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const advancedResults = require('../middleware/advancedResults');
const Bootcamp = require('../models/Bootcamp');
const Review = require('../models/Review');

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @route   GET /api/v1/users/:userId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    let reviews = await Review.find({ bootcamp: req.params.bootcampId });
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else if (req.params.userId) {
    let reviews = await Review.find({ user: req.params.userId });
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get a single reviews
// @route   GET /api/v1/reviews/:id
// @route   GET /api/v1/bootcamps/:bootcampId/reviews/:id

// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Review.find({
      bootcamp: req.params.bootcampId,
      _id: req.params.id,
    });
  } else {
    query = Review.findById(req.params.id).populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }

  const review = await query;

  if (!review) {
    return next(
      new ErrorResponse(`No review with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc    Add a single review
// @route   POST /api/v1/bootcamps/:bootcampId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId}`, 404)
    );
  }

  const review = await Review.create(req.body);
  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc    Delete a single review
// @route   DELETE /api/v1/bootcamps/:bootcampId/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return new ErrorResponse(`No review with id of ${req.params.id}`, 404);
  }

  const newreview = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: newreview,
  });
});

// @desc    Delete a single review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with id of ${req.params.id}`, 404)
    );
  }

  await Review.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
  });
});
