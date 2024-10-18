const EmailModel = require('../models/email.model');
const HttpException = require('../utils/HttpException.utils');
const dotenv = require('dotenv');
dotenv.config();

class EmailController {
    sendEmail = async (req, res, next) => {
        const email = await EmailModel.send(req.body);
        if (!email || email.error) {
            throw new HttpException(404, 'Email not sent');
        }

        res.status(202).send('Email has been sent!');
    };
}

module.exports = new EmailController;