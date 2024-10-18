const express = require('express');
const router = express.Router();
const EmailController = require('../controllers/email.controller');
const awaitHandlerFactory = require('../middlewares/awaitHandlerFactory.middleware');

router.post('/send-email', awaitHandlerFactory(EmailController.sendEmail)); // localhost:5558/api/v1/emails/send-email

module.exports = router;