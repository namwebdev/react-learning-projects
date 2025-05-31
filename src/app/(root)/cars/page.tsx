import { getCars } from "@/actions/car.action";
import CarCard from "@/components/CarCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import Link from "next/link";

export default async function CarsPage() {
    const result = await getCars();

    if (("error" in result && result.error) || !("data" in result)) {
        return (
            <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Failed to load cars. Please try again later.
                </AlertDescription>
            </Alert>
        );
    }

    const carData = result.data;
    if (!carData?.length) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-50">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Info className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">No cars found</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                    We couldn't find any cars matching your search criteria. Try adjusting
                    your filters or search term.
                </p>
                <Button variant="outline" asChild>
                    <Link href="/cars">Clear all filters</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-6xl mb-4 gradient-title">Browse Cars</h1>
            <div className="flex flex-col lg:flex-row gap-8">

                <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {carData.map((car) => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

