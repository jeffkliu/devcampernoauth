const ErrorResponse = require('../utils/errorResponse');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');
const asyncHandler = require('../middleware/async');

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    let courses = await Course.find({ bootcamp: req.params.bootcampId });
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get a single courses
// @route   GET /api/v1/courses/:id
// @route   GET /api/v1/bootcamps/:bootcampId/courses/:courseid
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({
      bootcamp: req.params.bootcampId,
      _id: req.params.courseid,
    });
  } else {
    query = Course.findById(req.params.courseid).populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }

  const courses = await query;

  if (!courses) {
    return next(
      new ErrorResponse(`No course with id of ${req.params.courseid}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: courses,
  });
});

// @desc    Add a single course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId}`, 404)
    );
  }

  const course = await Course.create(req.body);
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Update a single course
// @route   PUT /api/v1/courses/:courseid
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseid);

  if (!course) {
    return new ErrorResponse(
      `No course with id of ${req.params.courseid}`,
      404
    );
  }

  const newcourse = await Course.findByIdAndUpdate(
    req.params.courseid,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
    data: newcourse,
  });
});

// @desc    Delete a single course
// @route   DELETE /api/v1/courses/:courseid
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseid);

  if (!course) {
    return new ErrorResponse(
      `No course with id of ${req.params.courseid}`,
      404
    );
  }

  const newcourse = await Course.findByIdAndDelete(req.params.courseid);
  res.status(200).json({
    success: true,
  });
});
