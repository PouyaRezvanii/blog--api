const CustomError = require('./custom-error')

module.exports = class NotFoundError extends CustomError {
    constructor(customMessage){
        super('not found') //logging
        this.statusCode = 404;

        this.customMessage = customMessage
    }

    generateErrors(){
        if(this.customMessage){
            return [{message : this.customMessage}]
        }

        return [{message: 'Not found!'}]
    }

}