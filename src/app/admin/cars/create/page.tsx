"use client";

import ImageUpload from "@/components/ImageUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { addCar, generateCarDetailsFromImage } from "@/actions/car.action";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useFetch from "@/hooks/use-fetch";
import { Card, CardDescription, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CreateCarPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [suggestedPrice, setSuggestedPrice] = useState<string | null>(null);
  const [isDetailsGenerated, setIsDetailsGenerated] = useState(false);

  const { register, setValue, getValues,
    formState: { errors, isSubmitting },
    handleSubmit,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      price: "",
      mileage: "",
      color: "",
      fuelType: "",
      transmission: "",
      bodyType: "",
      seats: "",
      description: "",
      status: "AVAILABLE",
      featured: false,
    },
  });

  const {
    loading: generateCarDetailsLoading, fetchData: generateCarDetailsFn,
    data: carDetails, error: generateCarDetailsError,
  } = useFetch(generateCarDetailsFromImage);

  useEffect(() => {
    if (carDetails && !generateCarDetailsError) {
      setValue("make", carDetails.make);
      setValue("model", carDetails.model);
      setValue("year", carDetails.year.toString());
      setValue("color", carDetails.color);
      setValue("fuelType", carDetails.fuelType);
      setValue("transmission", carDetails.transmission);
      setValue("bodyType", carDetails.bodyType);
      setValue("seats", carDetails.seats);
      setValue("description", carDetails.description);

      setSuggestedPrice(carDetails.price);
      setIsDetailsGenerated(true);
    }
  }, [carDetails])

  const onDrop = async (imageUrl: string | null) => {
    if (imageUrl) {
      setImageUrl(imageUrl);
      generateCarDetailsFn(imageUrl);
      return;
    }

    setIsDetailsGenerated(false);
    setSuggestedPrice(null);
  }

  const onSubmit = async (data: z.infer<typeof carFormSchema>) => {
    // Ensure seats is always a string (not undefined)
    const carData = { ...data, seats: data.seats ?? "" };
    // Ensure imageUrl is a string (not null)
    const res = await addCar({
      carData,
      base64Data: imageUrl ?? "",
    });
    if (res.success) {
      reset();
      setImageUrl(null);
      setSuggestedPrice(null);
      setIsDetailsGenerated(false);
      toast.success("Car added successfully!");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Car Details</CardTitle>
        <CardDescription>
          Enter the details of the car you want to add.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <ImageUpload imageUrl={imageUrl} setImageUrl={setImageUrl} onDrop={onDrop} />
          <div className="grid grid-cols-2 gap-6">
            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                {...register("price")}
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <p className="text-xs text-red-500">
                  {errors.price.message}
                </p>
              )}
              {suggestedPrice && (
                <p className="text-xs text-gray-500">
                  Suggested Price: {suggestedPrice}
                </p>
              )}
            </div>
            {/* Mileage */}
            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage (km)</Label>
              <Input
                id="mileage"
                {...register("mileage")}
                className={errors.mileage ? "border-red-500" : ""}
              />
              {errors.mileage && (
                <p className="text-xs text-red-500">
                  {errors.mileage.message}
                </p>
              )}
            </div>
          </div>

          {generateCarDetailsLoading && <div className="flex justify-center items-center h-full">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-sm text-gray-500">Generating car details...</p>
          </div>}
          {!generateCarDetailsLoading && isDetailsGenerated && (
            <>
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  className={`min-h-32 ${errors.description ? "border-red-500" : ""
                    }`}
                  readOnly
                />
                {errors.description && (
                  <p className="text-xs text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Make */}
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    {...register("make")}
                    className={errors.make ? "border-red-500" : ""}
                    readOnly
                  />
                  {errors.make && (
                    <p className="text-xs text-red-500">
                      {errors.make.message}
                    </p>
                  )}
                </div>

                {/* Model */}
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    {...register("model")}
                    className={errors.model ? "border-red-500" : ""}
                    readOnly
                  />
                  {errors.model && (
                    <p className="text-xs text-red-500">
                      {errors.model.message}
                    </p>
                  )}
                </div>

                {/* Body Type */}
                <div className="space-y-2">
                  <Label htmlFor="bodyType">Body Type</Label>
                  <Input
                    id="bodyType"
                    {...register("bodyType")}
                    className={errors.bodyType ? "border-red-500" : ""}
                    readOnly
                  />
                  {errors.bodyType && (
                    <p className="text-xs text-red-500">
                      {errors.bodyType.message}
                    </p>
                  )}
                </div>

                {/* Year */}
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    {...register("year")}
                    className={errors.year ? "border-red-500" : ""}
                    readOnly
                  />
                  {errors.year && (
                    <p className="text-xs text-red-500">
                      {errors.year.message}
                    </p>
                  )}
                </div>

                {/* Color */}
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    {...register("color")}
                    className={errors.color ? "border-red-500" : ""}
                    readOnly
                  />
                  {errors.color && (
                    <p className="text-xs text-red-500">
                      {errors.color.message}
                    </p>
                  )}
                </div>

                {/* Fuel Type */}
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Input
                    id="fuelType"
                    {...register("fuelType")}
                    className={errors.fuelType ? "border-red-500" : ""}
                    readOnly
                  />
                  {errors.fuelType && (
                    <p className="text-xs text-red-500">
                      {errors.fuelType.message}
                    </p>
                  )}
                </div>

                {/* Transmission */}
                <div className="space-y-2">
                  <Label htmlFor="transmission">Transmission</Label>
                  <Input
                    id="transmission"
                    {...register("transmission")}
                    className={errors.transmission ? "border-red-500" : ""}
                    readOnly
                  />
                  {errors.transmission && (
                    <p className="text-xs text-red-500">
                      {errors.transmission.message}
                    </p>
                  )}
                </div>

                {/* Seats */}
                <div className="space-y-2">
                  <Label htmlFor="seats">Seats</Label>
                  <Input
                    id="seats"
                    {...register("seats")}
                    className={errors.seats ? "border-red-500" : ""}
                    readOnly
                  />
                  {errors.seats && (
                    <p className="text-xs text-red-500">
                      {errors.seats.message}
                    </p>
                  )}
                </div>
              </div>
            </>

          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              className="w-52 xs:w-auto px-4 py-2"
              disabled={generateCarDetailsLoading || !imageUrl || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Car...
                </>
              ) : (
                "Add Car"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

  );
}

const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];
const transmissions = ["Automatic", "Manual", "Semi-Automatic"];
const carStatuses = ["AVAILABLE", "UNAVAILABLE", "SOLD"];

const carFormSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().refine((val) => {
    const year = parseInt(val);
    return !isNaN(year) && year >= 1900 && year <= new Date().getFullYear() + 1;
  }, "Valid year required"),
  price: z.string().min(1, "Price is required"),
  mileage: z.string().min(1, "Mileage is required"),
  color: z.string().min(1, "Color is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  transmission: z.string().min(1, "Transmission is required"),
  bodyType: z.string().min(1, "Body type is required"),
  seats: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(["AVAILABLE", "UNAVAILABLE", "SOLD"]),
  featured: z.boolean().default(false),
});
