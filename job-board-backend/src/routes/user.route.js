const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middlewares/awaitHandlerFactory.middleware');

const { createUserSchema, updateUserSchema, validateLogin } = require('../middlewares/validators/userValidator.middleware');

router.get('/', awaitHandlerFactory(userController.getAllUsers)); // localhost:5558/api/v1/users
router.get('/id/:id', awaitHandlerFactory(userController.getUserById)); // localhost:5558/api/v1/users/id/:id
router.get('/whoami', auth(), awaitHandlerFactory(userController.getCurrentUser)); // localhost:5558/api/v1/users/whoami
router.post('/', createUserSchema, awaitHandlerFactory(userController.createUser)); // localhost:5558/api/v1/users
router.patch('/id/:id', auth(Role.Admin), updateUserSchema, awaitHandlerFactory(userController.updateUser)); // localhost:5558/api/v1/users/id/:id
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(userController.deleteUser)); // localhost:5558/api/v1/users/id/:id

router.post('/login', validateLogin, awaitHandlerFactory(userController.userLogin)); // localhost:5558/api/v1/users/login

module.exports = router;