const express = require('express');
const router = express.Router();
const AdvertisementController = require('../controllers/advertisement.controllers');
const auth = require('../middlewares/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middlewares/awaitHandlerFactory.middleware');

const { createAdvertisementSchema, updateAdvertisementSchema } = require('../middlewares/validators/advertisementValidator.middleware');

router.get('/', awaitHandlerFactory(AdvertisementController.getAllAdvertisements)); // localhost:5558/api/v1/advertisements
router.get('/:id', awaitHandlerFactory(AdvertisementController.getAdvertisementById)); // localhost:5558/api/v1/advertisements/:id
router.get('/search', awaitHandlerFactory(AdvertisementController.searchAdvertisement)); // localhost:5558/api/v1/advertisements/search
router.post('/', auth(Role.Admin), createAdvertisementSchema, awaitHandlerFactory(AdvertisementController.createAdvertisement)); // localhost:5558/api/v1/advertisements
router.patch('/:id', auth(Role.Admin), updateAdvertisementSchema, awaitHandlerFactory(AdvertisementController.updateAdvertisement)); // localhost:5558/api/v1/advertisements/:id
router.delete('/:id', auth(Role.Admin), awaitHandlerFactory(AdvertisementController.deleteAdvertisement)); // localhost:5558/api/v1/advertisements/:id

module.exports = router;