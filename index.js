const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const logger = require('./middleware/logger');
const fileUpload = require('express-fileupload');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

// Security libraries
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xSS = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

// Load env vars
dotenv.config({
  path: './config/config.env',
});

// Connect to mongodb
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading
app.use(fileUpload());

// Mongo Sanitize
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// XSS- cleaning
app.use(xSS());

// Rate-limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});

app.use(limiter);

// Prevent http param pollution

app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Error handler
app.use(errorHandler);

// Mount routers with basepath to bootcamps.js file above
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} \
mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});
