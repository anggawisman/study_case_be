const express = require('express');
const morgan = require('morgan');

// -------- REQUIRE SECURITY -------- //
// const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
// const hpp = require('hpp');

// -------- REQUIRE CUSTOM MODULE -------- //
const AppError = require('./utils/appError');
const rackRouter = require('./routes/rackRoutes')
const boxRouter = require('./routes/boxRoutes')

// ----------------- DEFINE EXPRESS AS APP ----------------------- //
const app = express();

// ----------- MIDDLEWARE FOR LOG FOR EXPRESS ----------------- //
// Development logging | morgan will logs HTTP requests
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


// -------------- ROUTES -------------------- //
// API Routes is divide it to routes folder
app.use('/api/v1/racks', rackRouter); // parent route, prevent for update we use v1
app.use('/api/v1/box', boxRouter); // parent route



// HANDLE UNHANDLE ROUTE makesure this route on bot of others route
app.all('*', (req, res, next) => { // "*" means anything
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


// EXPORTS THIS MODULE
module.exports = app;