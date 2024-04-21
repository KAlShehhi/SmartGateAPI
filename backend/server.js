const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const {errorHandler} = require('./middleware/errorMiddleware');
const connectDB = require('./config/db')
const port = process.env.PORT;

connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/api/gym', require('./routes/gymRoutes'));
app.use('/api/class', require('./routes/classRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/gate', require('./routes/gateRoutes'));
app.use('/api/subscription', require('./routes/subscriptionRoutes'));
app.use('/api/app/users', require('./routes/userAppRoutes'));
app.use('/api/admin/', require('./routes/adminRoutes'));
app.use('/api/review', require('./routes/reviewRoutes'));
app.use('/api/statistics', require('./routes/statisticsRoutes'));

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));