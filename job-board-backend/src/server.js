const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const HttpException = require('./utils/HttpException.utils');
const errorMiddleware = require('./middlewares/error.middleware');
const peopleRouter = require('./routes/people.route');
const userRouter = require('./routes/user.route');
const companyRouter = require('./routes/company.route');
const advertisementRouter = require('./routes/advertisement.route');
const applicationRouter = require('./routes/application.route');

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

// Setting routes
app.use(`/api/v1/users`, userRouter);
app.use(`/api/v1/people`, peopleRouter);
app.use(`/api/v1/companies`, companyRouter);
app.use(`/api/v1/advertisements`, advertisementRouter);
app.use(`/api/v1/applications`, applicationRouter);


// 404 error
app.all('*', (req, res, next) => {
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