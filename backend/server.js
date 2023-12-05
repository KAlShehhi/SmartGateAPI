const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT;

const app = express();

app.use('/api/gym', require('./routes/gymRoutes'));

app.listen(port, () => console.log(`Server started on port ${port}`));