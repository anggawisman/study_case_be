const mongoose = require('mongoose');
const dotenv = require('dotenv');



// ---------------------- HANDLE ERROR CATCHING UNCAUGHT EXCEPTIONS ---------------------------- //
// -------- If there is a bug or error occur(happen) in sync code, this will handle it -------- //
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTIONS !!! Shuting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

// ---------------------- CONNECT DB ---------------------------- //
dotenv.config({ path: './.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    // .connect(process.env.DATABASE_LOCAL, {
    .connect(DB, {
        // live DB
        useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        // console.log(con.connections);
        console.log('DB connection success');
    });

// ---------------------- START SERVER ---------------------------- //
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});


// -------------- HANDLE ERROR OUTSIDE EXPRESS: UNDHANDLE REJECTION ----------------- //
process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('UNHANDLER REJECTION !!! Shuting down...');
    server.close(() => {
        // doing server.close, we give the server time to finish all the request that are still pending or being handled at the time.
        process.exit(1);
    });
});