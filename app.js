const express = require("express");
const morgan = require("morgan");

// -------- REQUIRE SECURITY -------- //
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// -------- REQUIRE CUSTOM MODULE -------- //
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

// -------- REQUIRE ROUTES MODULES -------- //
const rackRouter = require("./routes/rackRoutes");
const boxRouter = require("./routes/boxRoutes");
const userRouter = require("./routes/userRoutes");

// ----------------- DEFINE EXPRESS AS APP ----------------------- //
const app = express();

// ------------------- MIDDLEWARE -------------------- //
// Development logging | morgan will logs HTTP requests
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// SECURITY
// limit if too many request from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: "10kb",
  })
);


// -------------- ROUTES -------------------- //
// API Routes is divide it to routes folder
app.use("/api/v1/racks", rackRouter); // parent route, prevent for update we use v1
app.use("/api/v1/boxes", boxRouter); // parent route
app.use("/api/v1/users", userRouter); // parent route

// HANDLE UNHANDLE ROUTE makesure this route on bot of others route
app.all("*", (req, res, next) => {
  // "*" means anything
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Operational Error Handling Middleware with Express
app.use(globalErrorHandler);

// EXPORTS THIS MODULE
module.exports = app;
