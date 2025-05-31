import { getCarById } from "@/actions/car.action";
import { notFound } from "next/navigation";
import CarDetails from "./_components/CarDetails";

export default async function CarDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const res = await getCarById(id);

    if (!res.success || !("data" in res) || !res.data) {
        return notFound();
    }

    const car = res.data;

    return <CarDetails car={car} />;
}
