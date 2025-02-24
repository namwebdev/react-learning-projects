import { ICustomer, ITransaction, OrderResponse } from "@/types";
import { api } from "./_base";
import { BaseSuccessResponse } from "./_types";


export const orderApi = {
    getOrderByKey: (key: string) => {
        return api.request<BaseSuccessResponse<OrderResponse>>({
            path: `/order/${key}`,
            method: "GET",
            secure: true,
        });
    },
};
