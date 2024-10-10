const UserModel = require('../models/user.model');
const HttpException = require('../utils/HttpException.utils');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const auth = (...roles) => {
    return async function (req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            const bearer = 'Bearer ';

            if (!authHeader || !authHeader.startsWith(bearer)) {
                throw new HttpException(401, 'Access denied. No credentials sent!');
            }

            const token = authHeader.replace(bearer, '');
            const secretKey = process.env.SECRET_JWT || "";

            // Verify token
            const decoded = jwt.verify(token, secretKey);
            const user = await UserModel.findOne({ id: decoded.user_id });

            if (!user) {
                throw new HttpException(401, 'Authentication failed!');
            }

            const ownerAuthorized = req.params.id === user.id;

            if (!ownerAuthorized && roles.length && !roles.includes(user.permission)) {
                throw new HttpException(401, 'Unauthorized');
            }

            req.currentUser = user;
            next();
        } catch (err) {
            err.status = 401;
            next(err);
        }
    }
}

module.exports = auth;