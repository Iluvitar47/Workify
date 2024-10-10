const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const auth = require('../middlewares/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middlewares/awaitHandlerFactory.middleware');

const { createCompanySchema, updateCompanySchema } = require('../middlewares/validators/companyValidator.middleware');

router.get('/', auth(Role.Admin), awaitHandlerFactory(companyController.getAllCompanies)); // localhost:5558/api/v1/companies
router.get('/id/:id', auth(Role.Admin), awaitHandlerFactory(companyController.getCompanyById)); // localhost:5558/api/v1/companies/id/:id
router.get('/search', auth(Role.Admin), awaitHandlerFactory(companyController.searchCompany)); // localhost:5558/api/v1/companies/search
router.post('/', auth(Role.Admin), createCompanySchema, awaitHandlerFactory(companyController.createCompany)); // localhost:5558/api/v1/companies
router.patch('/id/:id', auth(Role.Admin), updateCompanySchema, awaitHandlerFactory(companyController.updateCompany)); // localhost:5558/api/v1/companies/id/:id
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(companyController.deleteCompany)); // localhost:5558/api/v1/companies/id/:id

module.exports = router;