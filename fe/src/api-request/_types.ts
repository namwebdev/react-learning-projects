export interface BaseSuccessResponse<T> {
    success: boolean;
    message?: string;
    result: T;
}



