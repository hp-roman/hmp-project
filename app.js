const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');


// Load config
dotenv.config({
    path: './config/config.env'
});
connectDB();

// Route files
const foodRoute = require('./router/food');
const lotteRoute = require('./router/admin_lotte');
const catogoryRoute = require('./router/admin_catogory');
const nutritionRoute = require('./router/admin_nutritions');
const menuRoute = require('./router/admin_menu');
const dishRoute = require('./router/dish');
const userRoute = require('./router/user');



const app = express();
// Body parser
app.use(express.json());
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/foods/', foodRoute);
app.use('/api/admin/lotte', lotteRoute);
app.use('/api/admin/catogory', catogoryRoute);
app.use('/api/admin/nutrition', nutritionRoute);
app.use('/api/admin/menu', menuRoute);
app.use('/api/dish', dishRoute);
app.use('/api/user', userRoute);





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

