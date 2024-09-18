import IResponse from "../interfaces/IResponse";

abstract class BaseResponse implements IResponse {
    statusCode: number;
    status?: string;
    message?: string;

    static toString() {
        return JSON.stringify({ statusCode, status, message });
    }
}
