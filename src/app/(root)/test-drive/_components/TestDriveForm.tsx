'use client'

import { CardContent } from '@/components/ui/card';
import { Card } from '@/components/ui/card';
import { Car } from '@/types';
import { Dealership } from '@/hooks/use-dealership-store';
import { CalendarIcon, Car as CarIcon, CheckCircle2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn, format } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TestDriveFormProps {
    car: Car;
    dealerships: Dealership[];
}

export default function TestDriveForm({ car, dealerships }: TestDriveFormProps) {
    const { control, handleSubmit, watch, setValue, reset, formState: { errors, isValid, isSubmitting } } =
        useForm({
            resolver: zodResolver(testDriveSchema),
            defaultValues: {
                dealershipId: undefined,
                date: undefined,
                timeSlot: undefined,
                notes: "",
            },
        });

    const onSubmit = async (data: z.infer<typeof testDriveSchema>) => {
        console.log("🚀 ~ Test Drive Data:", data);
        console.log("🚀 ~ Available Dealerships:", dealerships);
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column - Car Summary */}
                <div className="md:col-span-1">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-4">Car Details</h2>

                            <div className="aspect-video rounded-lg overflow-hidden relative mb-4">
                                {car.images && car.images.length > 0 ? (
                                    <img
                                        src={car.images[0]}
                                        alt={`${car.year} ${car.make} ${car.model}`}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <CarIcon className="h-12 w-12 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            <h3 className="text-lg font-bold">
                                {car.year} {car.make} {car.model}
                            </h3>

                            <div className="mt-2 text-xl font-bold text-blue-600">
                                ${car.price.toLocaleString()}
                            </div>

                            <div className="mt-4 text-sm text-gray-500">
                                <div className="flex justify-between py-1 border-b">
                                    <span>Mileage</span>
                                    <span className="font-medium">
                                        {car.mileage.toLocaleString()} miles
                                    </span>
                                </div>
                                <div className="flex justify-between py-1 border-b">
                                    <span>Fuel Type</span>
                                    <span className="font-medium">{car.fuelType}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b">
                                    <span>Transmission</span>
                                    <span className="font-medium">{car.transmission}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b">
                                    <span>Body Type</span>
                                    <span className="font-medium">{car.bodyType}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span>Color</span>
                                    <span className="font-medium">{car.color}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Right Column - Booking Form */}
                <div className="md:col-span-2">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-6">Schedule Your Test Drive</h2>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Date Selection */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">
                                        Select a Date
                                    </label>
                                    <Controller
                                        name="date"
                                        control={control}
                                        render={({ field }) => (
                                            <div>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value
                                                                ? format(field.value, "PPP")
                                                                : "Pick a date"}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            // disabled={isDayDisabled}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                {errors.date && (
                                                    <p className="text-sm font-medium text-red-500 mt-1">
                                                        {errors.date.message}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>

                                {/* Time Slot Selection */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">
                                        Select a Time Slot
                                    </label>
                                    {/* <Controller
                                    name="timeSlot"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                // disabled={
                                                //     !selectedDate || availableTimeSlots.length === 0
                                                // }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={
                                                            !selectedDate
                                                                ? "Please select a date first"
                                                                : availableTimeSlots.length === 0
                                                                    ? "No available slots on this date"
                                                                    : "Select a time slot"
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableTimeSlots.map((slot) => (
                                                        <SelectItem key={slot.id} value={slot.id}>
                                                            {slot.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.timeSlot && (
                                                <p className="text-sm font-medium text-red-500 mt-1">
                                                    {errors.timeSlot.message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                /> */}
                                </div>

                                {/* Notes */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">
                                        Additional Notes (Optional)
                                    </label>
                                    <Controller
                                        name="notes"
                                        control={control}
                                        render={({ field }) => (
                                            <Textarea
                                                {...field}
                                                placeholder="Any specific questions or requests for your test drive?"
                                                className="min-h-24"
                                            />
                                        )}
                                    />
                                </div>

                                {/* Submit Button */}
                                {/* <Button
                                type="submit"
                                className="w-full"
                                disabled={bookingInProgress}
                            >
                                {bookingInProgress ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Booking Your Test Drive...
                                    </>
                                ) : (
                                    "Book Test Drive"
                                )}
                            </Button> */}
                            </form>

                            {/* Instructions */}
                            <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">What to expect</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                        Bring your driver's license for verification
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                        Test drives typically last 30-60 minutes
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                        A dealership representative will accompany you
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>


            </div>

            {/* Dealership Info */}
            <Card className="mt-5">
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Available Dealerships</h2>

                    {dealerships.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dealerships.map((dealership) => (
                                <div key={dealership.id} className="border rounded-lg p-4">
                                    <h3 className="font-semibold text-lg">{dealership.name}</h3>
                                    <p className="text-gray-600">{dealership.address}</p>
                                    <p className="text-gray-600">📞 {dealership.phone}</p>
                                    <p className="text-gray-600">✉️ {dealership.email}</p>

                                    <div className="mt-2">
                                        <h4 className="font-medium text-sm">Working Hours:</h4>
                                        <div className="grid grid-cols-2 gap-2 text-xs mt-1">
                                            {dealership.workingHours.map((hour) => (
                                                <div key={hour.id} className="flex justify-between">
                                                    <span>{hour.dayOfWeek}</span>
                                                    <span>
                                                        {hour.isOpen
                                                            ? `${hour.openTime} - ${hour.closeTime}`
                                                            : 'Closed'
                                                        }
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No dealerships available at the moment.</p>
                    )}
                </CardContent>
            </Card>
        </>
    )
}

const testDriveSchema = z.object({
    dealershipId: z.string({
        required_error: "Please select a dealership",
    }),
    date: z.date({
        required_error: "Please select a date for your test drive",
    }),
    timeSlot: z.string({
        required_error: "Please select a time slot",
    }),
    notes: z.string().optional(),
});

// const isDayDisabled = (day: Date) => {
//     // Disable past dates
//     if (day < new Date()) {
//         return true;
//     }

//     // Get day of week
//     const dayOfWeek = format(day, "EEEE").toUpperCase();

//     // Find working hours for the day
//     const daySchedule = dealership?.workingHours?.find(
//         (schedule) => schedule.dayOfWeek === dayOfWeek
//     );

//     // Disable if dealership is closed on this day
//     return !daySchedule || !daySchedule.isOpen;
// };
