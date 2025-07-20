import type { Context } from "hono";
import { PrismaClient } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

export const getCurrentResidences = async (c: Context) => {
    const currentUser = c.get("user");
    const cognitoId = currentUser.id;

    try {
        const properties = await prisma.property.findMany({
            where: { tenants: { some: { cognitoId } } },
            include: {
                location: true,
            },
        });
        if (!properties) return c.json({ residences: [] }, 200);

        const residencesWithFormattedLocation = await Promise.all(
            properties.map(async (property) => {
                const coordinates: { coordinates: string }[] =
                    await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;

                const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
                const longitude = geoJSON.coordinates[0];
                const latitude = geoJSON.coordinates[1];

                return {
                    ...property,
                    location: {
                        ...property.location,
                        coordinates: {
                            longitude,
                            latitude,
                        },
                    },
                };
            })
        );

        return c.json({ residences: residencesWithFormattedLocation }, 200);
    } catch (error) {
        console.error("Error fetching current residences:", error);
        return c.json({ message: "Error fetching current residences" }, 500);
    }
}