function errorMiddleware(error, req, res, next) {
    let { status = 500, message, data } = error;

    // If the status code is 500, change the message to "Internal server error"
    message = status === 500 || !message ? 'Internal server error' : message;

    error = {
        type: 'error',
        status,
        message,
        ...(data) && data
    }

    res.status(status).send(error);
}

module.exports = errorMiddleware;