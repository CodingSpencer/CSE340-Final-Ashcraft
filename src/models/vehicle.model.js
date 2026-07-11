import { getDb } from '../config/db.js';

const listVehicles = async (categoryId = null) => {
    const db = await getDb();
    let vehicles = db.vehicles;

    if (categoryId) {
        vehicles = vehicles.filter((v) => v.category_id === Number(categoryId));
    }

    // Attach category name to each vehicle
    return vehicles.map((v) => {
        const category = db.categories.find((c) => c.id === v.category_id);
        return { ...v, category_name: category ? category.category_name : null };
    });
};

const findVehicleById = async (id) => {
    const db = await getDb();
    const vehicle = db.vehicles.find((v) => v.id === Number(id));
    if (!vehicle) return null;

    const category = db.categories.find((c) => c.id === vehicle.category_id);
    const images = db.vehicleImages.filter((img) => img.vehicle_id === Number(id));

    return {
        ...vehicle,
        category_name: category ? category.category_name : null,
        images
    };
};

const createVehicle = async ({ category_id, make, model, year, mileage, price, description, availability }) => {
    const db = await getDb();
    const vehicle = {
        id: db.nextVehicleId++,
        category_id: Number(category_id),
        make,
        model,
        year: Number(year),
        mileage: Number(mileage),
        price: Number(price),
        description: description || null,
        availability: availability !== undefined ? Boolean(availability) : true
    };
    db.vehicles.push(vehicle);
    return vehicle;
};

const updateVehicle = async (id, updates) => {
    const db = await getDb();
    const vehicle = db.vehicles.find((v) => v.id === Number(id));
    if (!vehicle) return null;

    if (updates.category_id !== undefined) vehicle.category_id = Number(updates.category_id);
    if (updates.make !== undefined) vehicle.make = updates.make;
    if (updates.model !== undefined) vehicle.model = updates.model;
    if (updates.year !== undefined) vehicle.year = Number(updates.year);
    if (updates.mileage !== undefined) vehicle.mileage = Number(updates.mileage);
    if (updates.price !== undefined) vehicle.price = Number(updates.price);
    if (updates.description !== undefined) vehicle.description = updates.description;
    if (updates.availability !== undefined) vehicle.availability = Boolean(updates.availability);

    return vehicle;
};

const deleteVehicle = async (id) => {
    const db = await getDb();
    const index = db.vehicles.findIndex((v) => v.id === Number(id));
    if (index === -1) return false;
    db.vehicles.splice(index, 1);
    return true;
};

export {
    listVehicles,
    findVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
};