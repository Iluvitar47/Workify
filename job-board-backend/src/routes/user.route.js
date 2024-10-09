const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middlewares/awaitHandlerFactory.middleware');

const { createUserSchema, updateUserSchema, validateLogin } = require('../middlewares/validators/userValidator.middleware');

router.get('/', awaitHandlerFactory(userController.getAllUsers)); // localhost:3000/api/v1/users
router.get('/id/:id', awaitHandlerFactory(userController.getUserById)); // localhost:3000/api/v1/users/id/1
router.get('/whoami', auth(), awaitHandlerFactory(userController.getCurrentUser)); // localhost:3000/api/v1/users/whoami
router.post('/', createUserSchema, awaitHandlerFactory(userController.createUser)); // localhost:3000/api/v1/users
router.patch('/id/:id', auth(), updateUserSchema, awaitHandlerFactory(userController.updateUser)); // localhost:3000/api/v1/users/id/1
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(userController.deleteUser)); // localhost:3000/api/v1/users/id/1

router.post('/login', validateLogin, awaitHandlerFactory(userController.userLogin)); // localhost:3000/api/v1/users/login

module.exports = router;