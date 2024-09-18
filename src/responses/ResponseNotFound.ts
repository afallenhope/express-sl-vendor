import IResponse from "../interfaces/IResponse";

class ResponseNotFound implements IResponse {
    status?: string;
    statusCode: number;
    message?: string;

    constructor() {
        this.status = "Resource Not Found";
        this.statusCode = 404;
    }

    toString() {
        const { status, statusCode, message } = this;
        return JSON.stringify({
            status,
            statusCode,
            message,
        });
    }
}
export default ResponseNotFound;
