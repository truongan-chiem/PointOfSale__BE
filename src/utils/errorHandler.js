class ErrorHandler extends Error{
    constructor(message,statusCode,field){
        super(message);
        this.statusCode = statusCode;
        this.field = field;
    }
}

export default ErrorHandler;