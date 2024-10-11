const AdvertisementModel = require('../models/advertisement.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

class AdvertisementController {
    getAllAdvertisements = async (req, res, next) => {
        let advertisementList = await AdvertisementModel.find();
        if (!advertisementList.length) {
            throw new HttpException(404, 'Advertisements not found');
        }

        res.send(advertisementList);
    }

    getAdvertisementById = async (req, res, next) => {
        const advertisement = await AdvertisementModel.findOne({ id: req.params.id });
        if (!advertisement) {
            throw new HttpException(404, 'Advertisement not found');
        }

        res.send(advertisement);
    }

    searchAdvertisement = async (req, res, next) => {
        const advertisements = await AdvertisementModel.search(req.query);
        if (!advertisements.length) {
            throw new HttpException(404, 'Advertisement not found');
        }
    
        res.send(advertisements);
    }

    createAdvertisement = async (req, res, next) => {
        this.checkValidation(req);

        const result = await AdvertisementModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Advertisement has been created!');
    }

    updateAdvertisement = async (req, res, next) => {
        this.checkValidation(req);

        const restOfUpdates = req.body;

        const result = await AdvertisementModel.update(restOfUpdates, req.params.id);
        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }
        
        res.send('Advertisement has been updated!');
    }

    deleteAdvertisement = async (req, res, next) => {
        const result = await AdvertisementModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'Advertisement not found');
        }
        res.send('Advertisement has been deleted!');
    }

    checkValidation = (req) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation failed', errors);
        }
    }
}

module.exports = new AdvertisementController;