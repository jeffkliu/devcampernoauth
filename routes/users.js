const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser,
} = require('../controllers/users');

const User = require('../models/User');

// Include other resource routers
//const UserRouter = require('./users');

const router = express.Router({ mergeParams: true });

// Include other resource routers
const reviewRouter = require('./reviews');

router.use('/:userId/reviews', reviewRouter);

const advancedResults = require('../middleware/advancedResults');

router.route('/').get(advancedResults(User), getUsers).post(createUser);

router.route('/:id').put(updateUser).get(getUser).delete(deleteUser);

module.exports = router;
