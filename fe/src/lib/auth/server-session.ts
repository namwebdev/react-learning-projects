import { UserWithSession } from "./auth-types";
import { sessionApi } from "@/api-request/session.request";

const getServerSession = async (): Promise<UserWithSession | null> => {
  try {
    const { data, error } = await sessionApi.getUserSession();

    if (error) return null

    return data;
  } catch (err) {
    console.error("Error in getting session: ", err);

    return null;
  }
};

export default getServerSession;
