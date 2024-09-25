import IResponse from "../interfaces/IResponse";

abstract class BaseResponse implements IResponse {
    statusCode: number;
    status?: string;
    message?: string;
}
