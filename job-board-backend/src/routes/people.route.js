const express = require('express');
const router = express.Router();
const PeopleController = require('../controllers/people.controller');
const auth = require('../middlewares/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middlewares/awaitHandlerFactory.middleware');

const { createPeopleSchema, updatePeopleSchema } = require('../middlewares/validators/peopleValidator.middleware');

router.get('/', auth(Role.Admin), awaitHandlerFactory(PeopleController.getAllPeople)); // localhost:5558/api/v1/people
router.get('/id/:id', auth(Role.Admin), awaitHandlerFactory(PeopleController.getPeopleById)); // localhost:5558/api/v1/people/:id
router.get('/search', auth(Role.Admin), awaitHandlerFactory(PeopleController.searchPeople)); // localhost:5558/api/v1/people/search
router.post('/', createPeopleSchema, awaitHandlerFactory(PeopleController.createPeople)); // localhost:5558/api/v1/people
router.patch('/:id', updatePeopleSchema, awaitHandlerFactory(PeopleController.updatePeople)); // localhost:5558/api/v1/people/:id
router.delete('/:id', auth(Role.Admin), awaitHandlerFactory(PeopleController.deletePeople)); // localhost:5558/api/v1/people/:id

module.exports = router;