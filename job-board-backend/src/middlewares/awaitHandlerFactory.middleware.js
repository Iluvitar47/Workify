// This function will get a callback, run the middleware script, and will attempt to trigger this callback in the try block.
const awaitHandlerFactory = (middleware) => {
    return async (req, res, next) => {
        try {
            await middleware(req, res, next)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = awaitHandlerFactory;