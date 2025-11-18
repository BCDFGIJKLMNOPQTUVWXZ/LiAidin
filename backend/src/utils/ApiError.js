class ApiError extends Error{
    constructor(
        statusCode,
        message="something went wrong",
        errors=[],
        Stack=""
    ){
        super(message)
        this.statusCode=statusCode
        this.data=null
        this.errors =errors
        this.message=message
        if(Stack){
            this.Stack=Stack
        }else{
            Error.captureStackTrace(this , this.constructor)
        }
    }
}
export {ApiError}