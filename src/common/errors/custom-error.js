module.exports = class CustomError extends Error {
    constructor(message){
        super(message);
        if(new.target === CustomError){
            throw new TypeError('cannot construct CustomError instances directly!')
        }
    }

    /**
     * @abstract
     * @returns Array<{message: string, field?: string}>
     */
    generateErrors(){
        throw new Error('generate new errors must be in subclass')
    }

}