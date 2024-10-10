const CompanyModel = require('../models/company.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

class CompanyController {
    getAllCompanies = async (req, res, next) => {
        let companyList = await CompanyModel.find();
        if (!companyList.lenght) {
            throw new HttpException(404, 'Companies not found');
        }

        companyList = companyList.map(company => {
            const { password, ...companyWithoutPassword } = company;
            return companyWithoutPassword;
        });

        res.send(companyList);
    }

    getCompanyById = async (req, res, next) => {
        const company = await CompanyModel.findOne({ id: req.params.id });
        if (!company) {
            throw new HttpException(404, 'Company not found');
        }

        const { password, ...companyWithoutPassword } = company;

        res.send(companyWithoutPassword);
    }

    createCompany = async (req, res, next) => {
        this.checkValidation(req);

        await this.hashPassword(req);

        const result = await CompanyModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Company was created!');
    }

    updateCompany = async (req, res, next) => {
        this.checkValidation(req);

        await this.hashPassword(req);

        const { confirm_password, ...restOfUpdates } = req.body;

        const result = await CompanyModel.update(restOfUpdates, req.params.id);
        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        res.status(204).send();
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