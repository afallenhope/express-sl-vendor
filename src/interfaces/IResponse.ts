interface IResponse {
    statusCode: number;
    status?: string;
    message?: string;
    extra?: any;
};

export default IResponse;
