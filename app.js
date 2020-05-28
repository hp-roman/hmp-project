const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');


// Load config
dotenv.config({
    path: './config/config.env'
});
connectDB();

// Route files
const foodRoute = require('./router/food');
const dishRoute = require('./router/dish');
const userRoute = require('./router/user');
const statisticRoute = require('./router/statistic');
const historyRoute = require('./router/history');
const adminRoute = require('./router/admin');



const app = express();
// Body parser
app.use(express.json());
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(cors());

// Mount routers
app.use('/api/foods/', foodRoute);
app.use('/api/dish', dishRoute);
app.use('/api/user', userRoute);
app.use('/api/statistic', statisticRoute);
app.use('/api/history', historyRoute);
app.use('/api/admin/', adminRoute);





const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on ${port}`);
});

// Handle unhandle promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server
    server.close(() => process.exit(1));
});

