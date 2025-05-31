"use client"

import React from "react";
import { Card, CardContent } from "./ui/card";
import { CarIcon } from "lucide-react";
import { Car } from "@/types";
import Image from "next/image";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Link from "next/link";

export default function CarCard({ car }: { car: Car }) {
    return (
        <Link href={`/cars/${car.id}`} className="w-full">
            <Card className="overflow-hidden hover:shadow-lg transition group">
                <div className="relative h-48">
                    {car.images && car.images.length > 0 ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={car.images[0]}
                                alt={`${car.make} ${car.model}`}
                                fill
                                className="object-cover group-hover:scale-105 transition duration-300"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <CarIcon className="h-12 w-12 text-gray-400" />
                        </div>
                    )}
                </div>

                <CardContent className="p-4">
                    <div className="flex flex-col mb-2">
                        <h3 className="text-lg font-bold line-clamp-1">
                            {car.make} {car.model}
                        </h3>
                        <span className="text-xl font-bold text-blue-600">
                            ${car.price.toLocaleString()}
                        </span>
                    </div>

                    <div className="text-gray-600 mb-2 flex items-center">
                        <span>{car.year}</span>
                        <span className="mx-2">•</span>
                        <span>{car.transmission}</span>
                        <span className="mx-2">•</span>
                        <span>{car.fuelType}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                        <Badge variant="outline" className="bg-gray-50">
                            {car.bodyType}
                        </Badge>
                        <Badge variant="outline" className="bg-gray-50">
                            {car.mileage.toLocaleString()} miles
                        </Badge>
                        <Badge variant="outline" className="bg-gray-50">
                            {car.color}
                        </Badge>
                    </div>

                    <div className="flex justify-between">
                        <Button
                            className="flex-1 w-full"
                        >
                            View Car
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

