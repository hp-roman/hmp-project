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
const adNutritionRoute = require('./router/admin_nutrition');
const adMenuRoute = require('./router/admin_menu');
const adUserRoute = require('./router/admin_user');
const adFoodRoute = require('./router/admin_food');
const adDishRoute = require('./router/admin_dish');



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
app.use('/api/admin/nutrition', adNutritionRoute);
app.use('/api/admin/menu', adMenuRoute);
app.use('/api/admin/food', adFoodRoute);
app.use('/api/admin/user', adUserRoute);
app.use('/api/admin/dish', adDishRoute);





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

