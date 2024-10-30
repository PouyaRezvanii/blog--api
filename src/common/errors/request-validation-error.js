const CustomError = require('./custom-error')

module.exports = class RequsetValidationError extends CustomError {
    constructor(errors){
        super('Invalid Request')

        this.statusCode = 400;
        this.errors = errors; 
    }

    generateErrors(){
        return this.errors.map(error => {
            return {message: error.msg, field: error.path}
        }) 
    }
}