import { orderApi } from "@/api-request/order.request";
import { P } from "@/components/custom/p";
import { ThankYou as ThankYouComponent } from "../_components/thank-you";
const ThankYou = async ({ params }: {
    params: Promise<{ key: string }>;
}) => {
    const anonymousKey = (await params).key;
    if (!anonymousKey) return <div>Invalid key</div>;

    const { data, error } = await orderApi.getOrderByKey(anonymousKey);

    if (error) return (
        <div className="space-y-4">
            <P size="medium" weight="medium">
                {error?.message}
            </P>
        </div>
    );

    const order = data.result

    return <ThankYouComponent order={order} />
};

export default ThankYou;