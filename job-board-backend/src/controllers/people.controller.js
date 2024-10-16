const PeopleModel = require('../models/people.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

class PeopleController {
    getAllPeople = async (req, res, next) => {
        let peopleList = await PeopleModel.find();
        if (!peopleList.length) {
            throw new HttpException(404, 'People not found');
        }

        res.send(peopleList);
    };

    getPeopleById = async (req, res, next) => {
        const people = await PeopleModel.findOne({ id: req.params.id });
        if (!people) {
            throw new HttpException(404, 'People not found');
        }

        res.send(people);
    };

    searchPeople = async (req, res, next) => {
        const people = await PeopleModel.search(req.query);

        if (!people.length) {
            throw new HttpException(404, 'People not found');
        }

        res.send(people);
    };

    createPeople = async (req, res, next) => {
        this.checkValidation(req);

        const result = await PeopleModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('People has been created!');
    };

    updatePeople = async (req, res, next) => {
        this.checkValidation(req);

        const restOfUpdates= req.body;

        const result = await PeopleModel.update(restOfUpdates, req.params.id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        res.status(202).send('People has been updated');
    };

    deletePeople = async (req, res, next) => {
        const result = await PeopleModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'People not found');
        }
        res.status(202).send('People has been deleted');
    };

    checkValidation = (req) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation failed', errors);
        }
    };
}

module.exports = new PeopleController;