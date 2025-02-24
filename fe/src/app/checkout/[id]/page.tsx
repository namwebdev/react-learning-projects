import Checkout from "../_components/checkout";
import { P } from "@/components/custom/p";
import { randomBytes } from "crypto";
import { groupApi } from "@/api-request/group.request";
interface Props {
    params: Promise<{ id: string }>;
}

const CheckoutPage = async ({ params }: Props) => {
    const groupId = (await params).id;
    const anonymousKey = randomBytes(10).toString("hex");

    const { data, error } = await groupApi.getGroupById(groupId);

    if (error) return <P>{error.message}</P>;

    const group = data.result;

    return <Checkout group={group} anonymousKey={anonymousKey} />;
};

export default CheckoutPage;
