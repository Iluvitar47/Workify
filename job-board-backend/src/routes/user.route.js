const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middlewares/awaitHandlerFactory.middleware');

const { createUserSchema, updateUserSchema, validateLogin } = require('../middlewares/validators/userValidator.middleware');

router.get('/', auth(Role.Admin), awaitHandlerFactory(UserController.getAllUsers)); // localhost:5558/api/v1/users
router.get('/id/:id', auth(Role.Admin), awaitHandlerFactory(UserController.getUserById)); // localhost:5558/api/v1/users/:id
router.get('/search', auth(Role.Admin), awaitHandlerFactory(UserController.searchUser)); // localhost:5558/api/v1/users/search
router.get('/current', auth(), awaitHandlerFactory(UserController.getCurrentUser)); // localhost:5558/api/v1/users/current
router.post('/', createUserSchema, awaitHandlerFactory(UserController.createUser)); // localhost:5558/api/v1/users
router.patch('/:id', updateUserSchema, awaitHandlerFactory(UserController.updateUser)); // localhost:5558/api/v1/users/:id
router.delete('/:id', auth(Role.Admin), awaitHandlerFactory(UserController.deleteUser)); // localhost:5558/api/v1/users/:id

router.post('/login', validateLogin, awaitHandlerFactory(UserController.userLogin)); // localhost:5558/api/v1/users/login

module.exports = router;