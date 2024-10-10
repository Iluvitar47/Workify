const CompanyModel = require('../models/company.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

class CompanyController {
    getAllCompanies = async (req, res, next) => {
        let companyList = await CompanyModel.find();
        if (!companyList.length) {
            throw new HttpException(404, 'Companies not found');
        }

        res.send(companyList);
    }

    getCompanyById = async (req, res, next) => {
        const company = await CompanyModel.findOne({ id: req.params.id });
        if (!company) {
            throw new HttpException(404, 'Company not found');
        }

        res.send(company);
    }

    createCompany = async (req, res, next) => {
        this.checkValidation(req);

        const result = await CompanyModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Company has been created!');
    }

    updateCompany = async (req, res, next) => {
        this.checkValidation(req);

        const restOfUpdates = req.body;
        console.log('restOfUpdates:', restOfUpdates);

        const result = await CompanyModel.update(restOfUpdates, req.params.id);
        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        res.status(204).send('Company has been updated!');
    }

    deleteCompany = async (req, res, next) => {
        const result = await CompanyModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'Company not found');
        }
        res.status(204).send();
    }

    checkValidation = (req) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation failed', errors);
        }
    }
}

module.exports = new CompanyController();