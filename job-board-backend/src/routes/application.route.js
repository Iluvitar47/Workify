const express = require('express');
const router = express.Router();
const ApplicationControllers = require('../controllers/application.controller');
const auth = require('../middlewares/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middlewares/awaitHandlerFactory.middleware');

const { createApplicationSchema, updateApplicationSchema } = require('../middlewares/validators/applicationValidator.middleware');

router.get('/', auth(), awaitHandlerFactory(ApplicationControllers.getAllApplications)); // localhost:5558/api/v1/applications
router.get('/id/:id', auth(Role.Admin), awaitHandlerFactory(ApplicationControllers.getApplicationById)); // localhost:5558/api/v1/applications/:id
router.post('/', auth(Role.Admin), createApplicationSchema, awaitHandlerFactory(ApplicationControllers.createApplication)); // localhost:5558/api/v1/applications
router.patch('/:id', auth(), updateApplicationSchema, awaitHandlerFactory(ApplicationControllers.updateApplication)); // localhost:5558/api/v1/applications/:id
router.delete('/:id', auth(Role.Admin), awaitHandlerFactory(ApplicationControllers.deleteApplication)); // localhost:5558/api/v1/applications/:id

module.exports = router;