import type { Context } from "hono";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import { wktToGeoJSON } from "@terraformer/wkt";
import { propertySchema, filterPropertySchema } from "@/schemas/property.schema.js";
import axios from "axios";
import { ApplicationStatus, Prisma, PrismaClient } from "@prisma/client";
import { IMAGE_TYPES } from "@/constants.js";

type RawLocation = {
    id: number;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    coordinates: string;
};

const prisma = new PrismaClient();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});

export const uploadImageForProperty = async (c: Context) => {
    const body = await c.req.parseBody()
    const files = body['files[]'] as File | File[]
    const fileArray = Array.isArray(files) ? files : [files]

    if (!fileArray) return c.json({ message: "File is required" }, 400);
    if (typeof fileArray === 'string') return c.json({ message: "Wrong file format!" }, 400);

    // Validate all files are images
    if (!fileArray.every(file => IMAGE_TYPES.includes(file.type))) {
        return c.json({ message: `All files must be images. Only format ${IMAGE_TYPES.join(", ")} are allowed` }, 400);
    }

    try {
        const uploadPromises = fileArray.map(async (file) => {
            const buffer = await file.arrayBuffer();
            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME!,
                Key: `properties/${Date.now()}-${file.name}`,
                Body: new Uint8Array(buffer),
                ContentType: file.type,
            };

            const uploadResult = await new Upload({
                client: s3Client,
                params: uploadParams,
            }).done();

            return uploadResult.Location;
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        return c.json({
            message: "Images uploaded successfully",
            urls: uploadedUrls
        }, 201);
    } catch (error) {
        console.error("Error uploading images: ", error)
        return c.json({
            message: "Error uploading images",
        }, 500);
    }
}

export const getProperties = async (c: Context) => {
    const { favoriteIds,
        priceMin,
        priceMax,
        beds,
        baths,
        propertyType,
        squareFeetMin,
        squareFeetMax,
        amenities,
        availableFrom,
        latitude,
        longitude, } = c.req.query();
    const validation = filterPropertySchema.parse({
        favoriteIds,
        priceMin,
        priceMax,
        beds,
        baths,
        propertyType,
        squareFeetMin,
        squareFeetMax,
        amenities,
        availableFrom,
        latitude,
        longitude,
    });
    if (!validation) return c.json({ message: "Invalid query params" }, 400);

    let whereConditions: Prisma.Sql[] = [];
    if (priceMin) {
        whereConditions.push(
            Prisma.sql`p."pricePerMonth" >= ${Number(priceMin)}`
        );
    }
    if (priceMax) {
        whereConditions.push(
            Prisma.sql`p."pricePerMonth" <= ${Number(priceMax)}`
        );
    }
    if (beds && beds !== "any") {
        whereConditions.push(Prisma.sql`p.beds >= ${Number(beds)}`);
    }
    if (baths && baths !== "any") {
        whereConditions.push(Prisma.sql`p.baths >= ${Number(baths)}`);
    }
    if (squareFeetMin) {
        whereConditions.push(
            Prisma.sql`p."squareFeet" >= ${Number(squareFeetMin)}`
        );
    }

    if (squareFeetMax) {
        whereConditions.push(
            Prisma.sql`p."squareFeet" <= ${Number(squareFeetMax)}`
        );
    }

    if (propertyType && propertyType !== "any") {
        whereConditions.push(
            Prisma.sql`p."propertyType" = ${propertyType}::"PropertyType"`
        );
    }

    if (amenities && amenities !== "any") {
        const amenitiesArray = (amenities as string).split(",");
        whereConditions.push(Prisma.sql`p.amenities @> ${amenitiesArray}`);
    }

    if (availableFrom && availableFrom !== "any") {
        const availableFromDate =
            typeof availableFrom === "string" ? availableFrom : null;
        if (availableFromDate) {
            const date = new Date(availableFromDate);
            if (!isNaN(date.getTime())) {
                whereConditions.push(
                    Prisma.sql`EXISTS (
                SELECT 1 FROM "Lease" l 
                WHERE l."propertyId" = p.id 
                AND l."startDate" <= ${date.toISOString()}
              )`
                );
            }
        }
    }

    if (latitude && longitude) {
        const lat = parseFloat(latitude as string);
        const lng = parseFloat(longitude as string);
        const radiusInKilometers = 1000;
        const degrees = radiusInKilometers / 111; // Converts kilometers to degrees

        whereConditions.push(
            Prisma.sql`ST_DWithin(
            l.coordinates::geometry,
            ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),
            ${degrees}
          )`
        );
    }

    try {
        const completeQuery = Prisma.sql`
      SELECT 
        p.*,
        json_build_object(
          'id', l.id,
          'address', l.address,
          'city', l.city,
          'state', l.state,
          'country', l.country,
          'postalCode', l."postalCode",
          'coordinates', json_build_object(
            'longitude', ST_X(l."coordinates"::geometry),
            'latitude', ST_Y(l."coordinates"::geometry)
          )
        ) as location
      FROM "Property" p
      JOIN "Location" l ON p."locationId" = l.id
      ${whereConditions.length > 0
                ? Prisma.sql`WHERE ${Prisma.join(whereConditions, " AND ")}`
                : Prisma.empty
            }
    `;
        const properties = await prisma.$queryRaw(completeQuery);
        return c.json({ properties }, 200);
    } catch (error) {
        console.error("Error fetching properties: ", error);
        return c.json({ message: "Error fetching properties" }, 500);
    }
}

export const getPropertyById = async (c: Context) => {
    const { id } = c.req.param();
    if (!id) return c.json({ message: "Bad request" }, 400);

    try {
        const property = await prisma.property.findUnique({
            where: { id: Number(id) },
            include: {
                location: true,
            },
        });
        if (!property) return c.json({ message: "Property not found" }, 404);

        // check property has any applications that are not approved
        const isPropertyLeased = await prisma.application.findFirst({
            where: {
                propertyId: Number(id),
                status: ApplicationStatus.Approved
            },
        });

        const coordinates: { coordinates: string }[] =
            await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;
        const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
        const longitude = geoJSON.coordinates[0];
        const latitude = geoJSON.coordinates[1];
        const propertyWithCoordinates = {
            ...property,
            location: {
                ...property.location,
                coordinates: {
                    longitude,
                    latitude,
                },
            },
            isLeased: !!isPropertyLeased,
        };

        return c.json({ property: propertyWithCoordinates }, 200);
    } catch (error) {
        console.error("Error fetching property: ", error);
        return c.json({ message: "Error fetching property" }, 500);
    }
}

export const createProperty = async (c: Context) => {
    const bodyData = await c.req.json();
    const validation = propertySchema.parse(bodyData);
    if (!validation) return c.json({ message: "Invalid query params" }, 400);

    const { address, city, country, postalCode, state, managerCognitoId, imageUrls, ...propertyData } = bodyData;

    try {
        const { longitude, latitude } = await getCoordinates({ address, city, country, postalCode });
        if (longitude === 0 && latitude === 0) return c.json({ message: "Invalid address" }, 400);

        const [location] = await prisma.$queryRaw<RawLocation[]>`
    INSERT INTO "Location" (address, city, state, country, "postalCode", coordinates)
    VALUES (${address}, ${city}, ${state}, ${country}, ${postalCode}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326))
    RETURNING id, address, city, state, country, "postalCode", ST_AsText(coordinates) as coordinates;
  `;
        const newProperty = await prisma.property.create({
            data: {
                ...propertyData,
                locationId: location.id,
                managerCognitoId,
                photoUrls: imageUrls,
                amenities:
                    typeof propertyData.amenities === "string"
                        ? propertyData.amenities.split(",")
                        : [],
                highlights:
                    typeof propertyData.highlights === "string"
                        ? propertyData.highlights.split(",")
                        : [],
                isPetsAllowed: propertyData.isPetsAllowed === "true",
                isParkingIncluded: propertyData.isParkingIncluded === "true",
                pricePerMonth: parseFloat(propertyData.pricePerMonth),
                securityDeposit: parseFloat(propertyData.securityDeposit),
                applicationFee: parseFloat(propertyData.applicationFee),
                beds: parseInt(propertyData.beds),
                baths: parseFloat(propertyData.baths),
                squareFeet: parseInt(propertyData.squareFeet),
            },
            include: {
                location: true,
                manager: true,
            },
        });
        return c.json({ property: newProperty }, 201);
    } catch (error) {
        console.error("----- Error creating property", error);
        return c.json({ message: "Error creating property" }, 500);

    }
}

const OPEN_STREET_MAP_URL = "https://nominatim.openstreetmap.org"
const getCoordinates = async ({ address, city, country, postalCode }: { address: string, city: string, country: string, postalCode: string }) => {
    const geocodingUrl = `${OPEN_STREET_MAP_URL}/search?${new URLSearchParams(
        {
            street: address,
            city,
            country,
            postalcode: postalCode,
            format: "json",
            limit: "1",
        }
    ).toString()}`;
    const geocodingResponse = await axios.get(geocodingUrl, {
        headers: {
            "User-Agent": "RealEstateApp (justsomedummyemail@gmail.com",
        },
    });
    const [longitude, latitude] =
        geocodingResponse.data[0]?.lon && geocodingResponse.data[0]?.lat
            ? [
                parseFloat(geocodingResponse.data[0]?.lon),
                parseFloat(geocodingResponse.data[0]?.lat),
            ]
            : [0, 0];
    return { longitude, latitude };
}

export const getPropertyLeaseStatus = async (c: Context) => {
    const { id } = c.req.param();
    const currentUser = c.get("user");

    if (!id) return c.json({ message: "Bad request" }, 400);

    try {
        const leaseStatus = await prisma.application.findFirst({
            where: {
                propertyId: Number(id),
                status: ApplicationStatus.Approved,
                lease: {
                    startDate: { lte: new Date() },
                    endDate: { gte: new Date() }
                }
            },
            include: {
                tenant: true
            }
        });
        const isLeased = !!leaseStatus;

        return c.json({
            isLeased,
            isCurrentTenantLeased: isLeased && leaseStatus?.tenantCognitoId === currentUser.id
        }, 200);
    } catch (error) {
        console.error("Error checking lease status:", error);
        return c.json({ message: "Error checking lease status" }, 500);
    }
}

export const getPropertyLeases = async (c: Context) => {
    const { id } = c.req.param();
    if (!id) return c.json({ message: "Bad request" }, 400);

    const data = await prisma.lease.findMany({
        where: { propertyId: Number(id) },
        include: {
            tenant: true,
            application: true,
        },
    });
    // remove application field from the response and add status: application.status
    const leases = data.map(({ application, ...lease }) => ({
        ...lease,
        status: application?.status,
    }));
    return c.json({ leases }, 200);
}
