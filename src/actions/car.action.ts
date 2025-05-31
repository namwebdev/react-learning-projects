"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";
import env from "@/env";
import { supabaseServerClient } from "@/lib/supabase/supabase.server";
import { supabaseBrowserClient } from "@/lib/supabase/supabase.client";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants";
import { getErrorResponse } from "@/lib/utils";

interface CarDetails {
    make: string;
    model: string;
    year: string;
    price: string;
    mileage: string;
    color: string;
    fuelType: string;
    transmission: string;
    bodyType: string;
    seats: string;
    description: string;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export async function generateCarDetailsFromImage(imageUrl: string): Promise<CarDetails> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const mimeType = getFileTypeFromBase64(imageUrl);
    if (!mimeType) throw new Error("Invalid image data URL");

    // Remove the data URL prefix to get only the base64 data
    const base64Data = imageUrl.replace(/^data:[^;]+;base64,/, "");

    const imagePart = {
        inlineData: {
            data: base64Data,
            mimeType: mimeType,
        },
    };

    const result = await model.generateContent([imagePart, prompt]);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    return JSON.parse(cleanedText);
}

export async function addCar({ carData, base64Data }: { carData: CarDetails, base64Data: string }) {
    const uploadImageRes = await uploadImage(base64Data)
    if (uploadImageRes.error || !uploadImageRes.data) return { error: uploadImageRes.error }

    const imageUrl = uploadImageRes.data

    try {
        await db.car.create({
            data: {
                ...carData,
                year: Number(carData.year),
                price: Number(carData.price.replace(/,/g, "")),
                mileage: Number(carData.mileage),
                seats: Number(carData.seats),
                images: [imageUrl],
            }

        });
        revalidatePath(ROUTES.adminCars);

        return { success: true }
    } catch (error) {
        console.error("🚀 ~ addCar ~ error:", error)
        return getErrorResponse(error);
    }
}

async function uploadImage(base64Data: string) {
    const carId = uuidv4();
    const folderPath = `cars/${carId}`;

    // Skip if image data is not valid
    if (!base64Data || !base64Data.startsWith("data:image/")) {
        console.warn("Skipping invalid image data");
        return { error: "Invalid image data" };
    }

    const base64 = base64Data.split(",")[1];
    const imageBuffer = Buffer.from(base64, "base64");

    // Check if image is too large (> 5MB after base64 decoding)
    if (imageBuffer.length > MAX_IMAGE_SIZE) {
        return { error: "Image file is too large. Please use an image smaller than 5MB." };
    }

    // Determine file extension from the data URL
    const mimeMatch = base64Data.match(/data:image\/([a-zA-Z0-9]+);/);
    const fileExtension = mimeMatch ? mimeMatch[1] : "jpeg";

    // Create filename
    const fileName = `image-${Date.now()}.${fileExtension}`;
    const filePath = `${folderPath}/${fileName}`;

    const supabase = await supabaseServerClient();
    const { data, error } = await supabase.storage.from("car-images")
        .upload(filePath, imageBuffer, {
            contentType: `image/${fileExtension}`,
        });

    if (error) {
        console.error("🚀 ~ uploadImage ~ error:", error)
        return { error: error?.message || "Failed to upload image" }
    }

    const imageUrl = env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/" + data.fullPath;
    return { data: imageUrl, error: null };
}

// Helper function to serialize car data for client components
function serializeCarData(car: any) {
    return {
        ...car,
        price: Number(car.price), // Convert Decimal to number
        mileage: Number(car.mileage), // Convert Decimal to number if it's also Decimal
        createdAt: car.createdAt.toISOString(), // Convert Date to string
        updatedAt: car.updatedAt.toISOString(), // Convert Date to string
    };
}

export async function getCars() {
    try {
        const cars = await db.car.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        const serializedCars = cars.map(serializeCarData);
        return {
            success: true,
            data: serializedCars,
        }
    } catch (error) {
        return getErrorResponse(error);
    }
}

export async function getCarById(id: string) {
    try {
        const car = await db.car.findUnique({
            where: { id },
        });

        const serializedCar = car ? serializeCarData(car) : null;

        return {
            success: true,
            data: serializedCar,
        }
    } catch (error) {
        const errorResponse = getErrorResponse(error);
        return errorResponse;
    }
}

function getFileTypeFromBase64(dataUrl: string) {
    // Kiểm tra xem chuỗi có đúng định dạng data url không
    if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
        return null;
    }
    // Tách phần trước dấu phẩy
    const matches = dataUrl.match(/^data:([^;]+);base64,/);
    if (matches && matches[1]) {
        return matches[1]; // Trả về MIME type, ví dụ: 'image/jpeg'
    }
    return null;
}

const prompt = `
    You are a car expert.
    You are given a car image.
    You need to generate a detailed description of the car.
    The description should include the following information:
      1. Make (manufacturer)
      2. Model
      3. Year (exact year as close as possible, just return single year with your best guess)
      4. Color
      5. Body type (SUV, Sedan, Hatchback, etc.)
      6. Fuel type ("Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid" or others your best guess)
      7. Transmission type ("Automatic", "Manual", "Semi-Automatic" or others your best guess)
      8. Price (Return the price range in dollars, your best guess. Ex: $10,000 - $20,000)
      9. Short Description as to be added to a car listing
      10. Seats (your best guess)

      Format your response as a clean JSON object with these fields:
      {
        "make": "",
        "model": "",
        "year": "",
        "color": "",
        "price": "",
        "bodyType": "",
        "fuelType": "",
        "transmission": "",
        "description": "",
        "seats": "",
        "confidence": 0.0
      }

      For confidence, provide a value between 0 and 1 representing how confident you are in your overall identification.
      Only respond with the JSON object, nothing else.
`
