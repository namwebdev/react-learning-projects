export interface Car {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    color: string;
    fuelType: string;
    transmission: string;
    bodyType: string;
    seats: number | null;
    description: string;
    status: string;
    featured: boolean;
    images: string[];
    createdAt: string;
    updatedAt: string;
}