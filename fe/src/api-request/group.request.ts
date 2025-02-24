import { IGroup } from "@/types";
import { api } from "./_base";
import { BaseSuccessResponse } from "./_types";

export const groupApi = {
    getGroups: () => {
        return api.request<BaseSuccessResponse<IGroup[]>>({
            path: `/dashboard/groups`,
            method: "GET",
            secure: true,
        });
    },
    getGroupById: (id: string) => {
        return api.request<BaseSuccessResponse<IGroup>>({
            path: `/dashboard/groups/${id}`,
            method: "GET",
            secure: true,
        });
    },
};
