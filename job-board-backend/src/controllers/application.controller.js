const ApplicationModel = require('../models/application.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

class Application {
    getAllApplications = async (req, res, next) => {
        let applicationList = await ApplicationModel.find();
        if (!applicationList.length) {
            throw new HttpException(404, 'Applications not found');
        }

        res.send(applicationList);
    }

    getApplicationById = async (req, res, next) => {
        const application = await ApplicationModel.findOne({ id: req.params.id });
        if (!application) {
            throw new HttpException(404, 'Application not found');
        }

        res.send(application);
    }

    createApplication = async (req, res, next) => {
        this.checkValidation(req);
        
        const result = await ApplicationModel.create(req.body);


        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Application has been created!');
    }

    updateApplication = async (req, res, next) => {
        this.checkValidation(req);

        const restOfUpdates = req.body;

        const result = await ApplicationModel.update(restOfUpdates, req.params.id);
        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }
        
        res.send('Application has been updated!');
    }

    deleteApplication = async (req, res, next) => {
        const result = await ApplicationModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'Application not found');
        }
        res.send('Application has been deleted');
    }

    checkValidation = (req) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation failed', errors);
        }
    }
}

module.exports = new Application;