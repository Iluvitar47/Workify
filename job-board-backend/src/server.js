const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const HttpException = require('./utils/HttpException.utils');
const errorMiddleware = require('./middlewares/error.middleware');
const userRouter = require('./routes/user.route');

// Init express
const app = express();

// Init environment variables
dotenv.config();

// Parse request body as JSON
app.use(express.json());

// Enable CORS
app.use(cors());

// Enale preflight requests
app.options('*', cors());

// Setting Port
const PORT = process.env.PORT || 3000;

app.use(`/api/v1/users`, userRouter);

// 404 error
app.call('*', (req, res, next) => {
  const err = new HttpException(404, 'Endpoint Not Found');
  next(err);
});

// Error middleware
app.use(errorMiddleware);

// Starting server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;