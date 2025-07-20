import type { Context } from "hono";
import { ApplicationStatus, Prisma, PrismaClient } from "@prisma/client";
import { applicationSchema, applicationStatusSchema } from "@/schemas/application.schema.js";
import { ROLES } from "@/constants.js";

const prisma = new PrismaClient();

export const createApplication = async (c: Context) => {
    const body = await c.req.json();
    const currentUser = c.get("user");
    const tenantCognitoId = currentUser.id;

    const validation = applicationSchema.parse(body);
    if (!validation) return c.json({ message: "Invalid request body" }, 400);

    const { propertyId, name, email, phoneNumber, message, applicationDate } = body;

    const isTenantExists = await prisma.tenant.findUnique({
        where: { cognitoId: tenantCognitoId },
    });
    if (!isTenantExists) return c.json({ message: "Tenant not found" }, 404);

    const property = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { pricePerMonth: true, securityDeposit: true, managerCognitoId: true },
    });
    if (!property) return c.json({ message: "Property not found" }, 404);

    if (await getPropertyLeaseStatus(propertyId)) return c.json({ message: "Property is already leased" }, 400);

    try {
        const newApplication = await prisma.$transaction(async (prisma) => {
            const lease = await prisma.lease.create({
                data: {
                    startDate: new Date(), // Today
                    endDate: new Date(
                        new Date().setFullYear(new Date().getFullYear() + 1)
                    ), // 1 year from today
                    rent: property.pricePerMonth,
                    deposit: property.securityDeposit,
                    property: {
                        connect: { id: propertyId },
                    },
                    tenant: {
                        connect: { cognitoId: tenantCognitoId },
                    },
                },
            });

            const application = await prisma.application.create({
                data: {
                    applicationDate: applicationDate ? new Date(applicationDate) : new Date(),
                    status: "Pending",
                    name,
                    email,
                    phoneNumber,
                    message,
                    property: {
                        connect: { id: propertyId },
                    },
                    tenant: {
                        connect: { cognitoId: tenantCognitoId },
                    },
                    lease: {
                        connect: { id: lease.id },
                    },
                },
                include: {
                    property: true,
                    tenant: true,
                    lease: true,
                },
            });
            return application;
        })

        return c.json({ application: newApplication }, 201);
    } catch (error) {
        console.error("Error creating application", error);
        return c.json({ message: "Error creating application" }, 500);
    }
}

export const getApplications = async (c: Context) => {
    const currentUser = c.get("user");
    const whereCondition: Prisma.ApplicationWhereInput = {};

    if (currentUser.role === ROLES.MANAGER) {
        whereCondition.property = { managerCognitoId: currentUser.id };
    } else if (currentUser.role === ROLES.TENANT) {
        whereCondition.tenant = { cognitoId: currentUser.id };
    }

    try {
        const applications = await prisma.application.findMany({
            where: whereCondition,
            include: {
                property: {
                    include: {
                        location: true,
                        manager: true,
                    },
                },
                tenant: true,
                lease: true,
            },
        });
        return c.json({ applications }, 200);
    } catch (error) {
        console.error("Error getting applications", error);
        return c.json({ message: "Error getting applications" }, 500);
    }
}

export const getApplicationById = async (c: Context) => {
    const applicationId = c.req.param("id");
    const currentUser = c.get("user");
    try {
        const application = await prisma.application.findUnique({
            where: { id: Number(applicationId) },
            include: {
                property: true,
                tenant: true,
            },
        });
        if (!application) return c.json({ message: "Application not found" }, 404);

        if (currentUser.role === ROLES.MANAGER) {
            if (application.property.managerCognitoId !== currentUser.id) return c.json({ message: "Application not found" }, 404);
        } else if (currentUser.role === ROLES.TENANT) {
            if (application.tenant.cognitoId !== currentUser.id) return c.json({ message: "Application not found" }, 404);
        }

        return c.json({ application }, 200);
    } catch (error) {
        console.error("Error getting application by id", error);
        return c.json({ message: "Error getting application by id" }, 500);

    }
}

export const updateApplication = async (c: Context) => {
    const applicationId = c.req.param("id");
    const { status } = await c.req.json();
    const applicationStatus = status.charAt(0).toUpperCase() + status.slice(1);
    const validation = applicationStatusSchema.parse(applicationStatus);

    if (!validation) return c.json({ message: "Bad request" }, 400);

    try {
        const application = await prisma.application.findUnique({
            where: { id: Number(applicationId) },
            include: {
                property: true,
                tenant: true,
            },
        });
        if (!application) return c.json({ message: "Application not found" }, 404);

        const currentUser = c.get("user");
        if (application.property.managerCognitoId !== currentUser.id) return c.json({ message: "You are not allowed to update this application" }, 403);

        if (applicationStatus === application.status) return c.json({ message: "Bad request" }, 400);

        if (application.status !== ApplicationStatus.Pending) return c.json({ message: "Application is already updated!" }, 400);

        if (applicationStatus === ApplicationStatus.Denied) {
            await prisma.lease.update({
                where: { id: application.leaseId! },
                data: {
                    endDate: new Date(),
                },
            });
            await prisma.application.update({
                where: { id: Number(applicationId) },
                data: { status: applicationStatus },
            });
            return c.status(204);
        }

        const updatedApplication = await prisma.application.update({
            where: { id: Number(applicationId) },
            data: { status: applicationStatus },
        });
        await prisma.property.update({
            where: { id: application.propertyId },
            data: {
                tenants: {
                    connect: { cognitoId: application.tenantCognitoId },
                },
            },
        });

        return c.json({ application: updatedApplication }, 200);
    } catch (error) {
        console.error("Error updating application", error);
        return c.json({ message: "Error updating application" }, 500);
    }
}

const getPropertyLeaseStatus = async (propertyId: number) => {
    const isPropertyLeased = await prisma.application.findFirst({
        where: { propertyId, status: ApplicationStatus.Approved, lease: { startDate: { lte: new Date() }, endDate: { gte: new Date() } } },
    });
    return !!isPropertyLeased;
}

