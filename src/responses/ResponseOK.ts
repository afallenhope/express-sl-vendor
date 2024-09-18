import IResponse from "../interfaces/IResponse";

class ResponseOK implements IResponse {
    status?: string;
    statusCode: number;
    message?: string;

    constructor() {
        this.statusCode = 200;
        this.status = "OK";
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

export default ResponseOK;
