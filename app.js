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

//Its Security middleware but its should be in the first middleware
// Set Security HTTP headers: Using helmet are quick and simple way to create a layer of security by switching from Express defaults to a more secure set of defaults
app.use(helmet());

// Development logging | morgan will logs HTTP requests
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser, reading data from body into req.body
app.use(
  express.json({
    // LIMIT BODY PAYLOAD HERE
    limit: "10kb",
  })
);

// ------------------- SECURITY MIDDLEWARE -------------------- //


// limit if too many request from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Data Sanitization againts XSS: sanitize user input coming from POST body, GET queries, and url params.
app.use(xss());

// Data Sanitization againts NoSQL query injection
// Object keys starting with a $ or containing a . are reserved for use by MongoDB as operators. Without this sanitization, malicious users could send an object containing a $ operator, or including a ., which could change the context of a database operation. Most notorious is the $where operator, which can execute arbitrary JavaScript on the database.
app.use(mongoSanitize());

// Prevent Parameter Pollution
// Should in the end of middleware because it does to clear up query string

// GET/ search? boxCode=BC1412421&boxCode=312332
// HPP puts array parameters in req.query and/or req.body aside and just selects the last parameter value. You add the middleware and you are done.
// actually it's not implemented here yet
app.use(
  hpp({
    whitelist: [

    ],
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
