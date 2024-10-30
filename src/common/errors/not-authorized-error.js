const CustomError = require('./custom-error')

module.exports = class NotAuthorizedError extends CustomError {
    constructor() {
        super('not Authorized!')

        this.statusCode = 401;
    }

    generateErrors() {
        return [{message : 'Not Authorized!'}]
    }
}