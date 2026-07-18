import { getDb, pool, useMemoryStorage } from '../config/db.js';

const listVehicles = async (categoryId = null) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        let vehicles = db.vehicles;

        if (categoryId) {
            vehicles = vehicles.filter((v) => v.category_id === Number(categoryId));
        }

        return vehicles.map((v) => {
            const category = db.categories.find((c) => c.id === v.category_id);
            return {
                ...v,
                category_name: category ? category.category_name : null,
                primary_image: v.image_path || (db.vehicleImages.filter((img) => img.vehicle_id === v.id).length > 0 ? db.vehicleImages.filter((img) => img.vehicle_id === v.id)[0].image_path : null)
            };
        });
    }
    
    let query = `
        SELECT v.*, c.category_id, c.category_name,
               (SELECT i.image_path FROM vehicle_images i 
                WHERE i.vehicle_id = v.vehicle_id 
                LIMIT 1) as primary_image
        FROM vehicles v
        LEFT JOIN categories c ON v.category_id = c.category_id
    `;
    let params = [];

    if (categoryId) {
        query += ' WHERE v.category_id = $1';
        params.push(categoryId);
    }

    query += ' ORDER BY v.vehicle_id';

    const result = await pool.query(query, params);
    return result.rows.map((v) => ({
        id: v.vehicle_id,
        category_id: v.category_id,
        make: v.make,
        model: v.model,
        year: v.year,
        mileage: v.mileage,
        price: v.price,
        description: v.description,
        availability: v.availability,
        image_path: v.image_path,
        category_name: v.category_name,
        primary_image: v.primary_image || v.image_path
    }));
};

const findVehicleById = async (id) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        const vehicle = db.vehicles.find((v) => v.id === Number(id));
        if (!vehicle) return null;

        const category = db.categories.find((c) => c.id === vehicle.category_id);
        const images = db.vehicleImages.filter((img) => img.vehicle_id === Number(id));

        if (vehicle.image_path && !images.find((img) => img.image_path === vehicle.image_path)) {
            images.unshift({ id: null, vehicle_id: vehicle.id, image_path: vehicle.image_path });
        }

        return {
            ...vehicle,
            category_name: category ? category.category_name : null,
            images
        };
    }
    
    const result = await pool.query(
        `SELECT v.*, c.category_id, c.category_name
         FROM vehicles v
         LEFT JOIN categories c ON v.category_id = c.category_id
         WHERE v.vehicle_id = $1`,
        [id]
    );

    if (result.rows.length === 0) return null;

    const vehicle = result.rows[0];

    // Get images
    const imagesResult = await pool.query(
        'SELECT * FROM vehicle_images WHERE vehicle_id = $1',
        [id]
    );

    // If vehicle has its own image_path, use it as the primary image
    let images = imagesResult.rows;
    if (vehicle.image_path && !images.find((img) => img.image_path === vehicle.image_path)) {
        images = [{ id: null, vehicle_id: vehicle.id, image_path: vehicle.image_path }, ...images];
    }

    return {
        id: vehicle.vehicle_id,
        category_id: vehicle.category_id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        mileage: vehicle.mileage,
        price: vehicle.price,
        description: vehicle.description,
        availability: vehicle.availability,
        image_path: vehicle.image_path,
        category_name: vehicle.category_name,
        images
    };
};

const createVehicle = async ({ category_id, make, model, year, mileage, price, description, availability }) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
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
    }
    
    const result = await pool.query(
        `INSERT INTO vehicles (category_id, make, model, year, mileage, price, description, availability)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [category_id, make, model, year, mileage, price, description, availability]
    );
    return result.rows[0];
};

const updateVehicle = async (id, updates) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
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
    }

    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.category_id !== undefined) {
        fields.push(`category_id = $${paramCount++}`);
        values.push(updates.category_id);
    }
    if (updates.make !== undefined) {
        fields.push(`make = $${paramCount++}`);
        values.push(updates.make);
    }
    if (updates.model !== undefined) {
        fields.push(`model = $${paramCount++}`);
        values.push(updates.model);
    }
    if (updates.year !== undefined) {
        fields.push(`year = $${paramCount++}`);
        values.push(updates.year);
    }
    if (updates.mileage !== undefined) {
        fields.push(`mileage = $${paramCount++}`);
        values.push(updates.mileage);
    }
    if (updates.price !== undefined) {
        fields.push(`price = $${paramCount++}`);
        values.push(updates.price);
    }
    if (updates.description !== undefined) {
        fields.push(`description = $${paramCount++}`);
        values.push(updates.description);
    }
    if (updates.availability !== undefined) {
        fields.push(`availability = $${paramCount++}`);
        values.push(updates.availability);
    }

    if (fields.length === 0) {
        return findVehicleById(id);
    }

    values.push(id);
    const result = await pool.query(
        `UPDATE vehicles SET ${fields.join(', ')} WHERE vehicle_id = ${paramCount} RETURNING *`,
        values
    );

    return result.rows[0] || null;
};

const deleteVehicle = async (id) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        const index = db.vehicles.findIndex((v) => v.id === Number(id));
        if (index === -1) return false;
        db.vehicles.splice(index, 1);
        return true;
    }
    
    const result = await pool.query(
        'DELETE FROM vehicles WHERE vehicle_id = $1',
        [id]
    );
    return result.rowCount > 0;
};

export {
    listVehicles,
    findVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
};