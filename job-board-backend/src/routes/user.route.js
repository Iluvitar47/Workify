const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middlewares/awaitHandlerFactory.middleware');

const { createUserSchema, updateUserSchema, validateLogin } = require('../middlewares/validators/userValidator.middleware');

router.get('/', auth(Role.Admin), awaitHandlerFactory(userController.getAllUsers)); // localhost:5558/api/v1/users
router.get('/id/:id', auth(Role.Admin), awaitHandlerFactory(userController.getUserById)); // localhost:5558/api/v1/users/:id
router.get('/search', auth(Role.Admin), awaitHandlerFactory(userController.searchUser)); // localhost:5558/api/v1/users/search
router.get('/current', auth(), awaitHandlerFactory(userController.getCurrentUser)); // localhost:5558/api/v1/users/current
router.post('/', createUserSchema, awaitHandlerFactory(userController.createUser)); // localhost:5558/api/v1/users
router.patch('/:id', updateUserSchema, awaitHandlerFactory(userController.updateUser)); // localhost:5558/api/v1/users/:id
router.delete('/:id', auth(Role.Admin), awaitHandlerFactory(userController.deleteUser)); // localhost:5558/api/v1/users/:id

router.post('/login', validateLogin, awaitHandlerFactory(userController.userLogin)); // localhost:5558/api/v1/users/login

module.exports = router;