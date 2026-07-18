import { getDb, pool, useMemoryStorage } from '../config/db.js';
import { updateVehicle } from './vehicle.model.js';

/**
 * Check if a vehicle has any active/pending rental that overlaps with the given date range.
 */
const hasDateOverlap = async (vehicleId, startDate, endDate, excludeRentalId = null) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        return db.rentals.some((r) => {
            if (r.status === 'completed' || r.status === 'cancelled') return false;
            if (excludeRentalId && r.id === Number(excludeRentalId)) return false;
            if (r.vehicle_id !== Number(vehicleId)) return false;

            const existingStart = new Date(r.start_date);
            const existingEnd = new Date(r.end_date);

            return start <= existingEnd && end >= existingStart;
        });
    }
    
    let query = `
        SELECT id FROM rentals 
        WHERE status IN ('pending', 'active')
        AND vehicle_id = $1
        AND NOT (start_date >= $2 OR end_date <= $3)
    `;
    let params = [vehicleId, endDate, startDate];
    
    if (excludeRentalId) {
        query += ' AND id != $4';
        params.push(excludeRentalId);
    }
    
    const result = await pool.query(query, params);
    return result.rowCount > 0;
};

/**
 * Get all blocked date ranges for a vehicle (active/pending rentals).
 * Returns an array of { start_date, end_date } objects.
 */
const findBlockedDates = async (vehicleId) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        return db.rentals
            .filter((r) => {
                if (r.status === 'completed' || r.status === 'cancelled') return false;
                return r.vehicle_id === Number(vehicleId);
            })
            .map((r) => ({
                start_date: r.start_date,
                end_date: r.end_date
            }));
    }
    
    const result = await pool.query(
        `SELECT start_date, end_date FROM rentals
         WHERE status IN ('pending', 'active')
         AND vehicle_id = $1`,
        [vehicleId]
    );
    
    return result.rows;
};

const createRental = async ({ user_id, vehicle_id, start_date, end_date }) => {
    const db = await getDb();
    
    // Check for date overlap before creating
    const overlap = await hasDateOverlap(vehicle_id, start_date, end_date);
    if (overlap) {
        throw new Error('This vehicle is already rented during the requested dates.');
    }

    if (useMemoryStorage) {
        const rental = {
            id: db.nextRentalId++,
            user_id: Number(user_id),
            vehicle_id: Number(vehicle_id),
            start_date,
            end_date,
            status: 'pending',
            created_at: new Date().toISOString()
        };
        db.rentals.push(rental);

        // Set vehicle as unavailable
        await updateVehicle(vehicle_id, { availability: false });

        return rental;
    }

    const result = await pool.query(
        `INSERT INTO rentals (user_id, vehicle_id, start_date, end_date, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [user_id, vehicle_id, start_date, end_date, 'pending', new Date().toISOString()]
    );

    // Set vehicle as unavailable
    await updateVehicle(vehicle_id, { availability: false });

    return result.rows[0];
};

const findRentalsByUser = async (userId) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        return db.rentals
            .filter((r) => r.user_id === Number(userId))
            .map((r) => {
                const vehicle = db.vehicles.find((v) => v.id === r.vehicle_id);
                return { ...r, vehicle: vehicle || null };
            })
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    const result = await pool.query(
        `SELECT r.*, v.vehicle_id, v.year, v.make, v.model,
                u.user_id, u.firstname, u.lastname, u.email
         FROM rentals r
         LEFT JOIN vehicles v ON r.vehicle_id = v.vehicle_id
         LEFT JOIN users u ON r.user_id = u.user_id
         WHERE r.user_id = $1
         ORDER BY r.created_at DESC`,
        [userId]
    );
    
    return result.rows.map((r) => ({
        id: r.rental_id,
        user_id: r.user_id,
        vehicle_id: r.vehicle_id,
        start_date: r.start_date,
        end_date: r.end_date,
        status: r.status,
        created_at: r.created_at,
        vehicle: r.vehicle_id ? {
            id: r.vehicle_id,
            year: r.year,
            make: r.make,
            model: r.model
        } : null
    }));
};

const findAllRentals = async () => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        return db.rentals
            .map((r) => {
                const vehicle = db.vehicles.find((v) => v.id === r.vehicle_id);
                const user = db.users.find((u) => u.id === r.user_id);
                return { ...r, vehicle: vehicle || null, user: user || null };
            })
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    const result = await pool.query(
        `SELECT r.*, v.vehicle_id, v.year, v.make, v.model,
                u.user_id, u.firstname, u.lastname, u.email
         FROM rentals r
         LEFT JOIN vehicles v ON r.vehicle_id = v.vehicle_id
         LEFT JOIN users u ON r.user_id = u.user_id
         ORDER BY r.created_at DESC`
    );
    
    return result.rows.map((r) => ({
        id: r.rental_id,
        user_id: r.user_id,
        vehicle_id: r.vehicle_id,
        start_date: r.start_date,
        end_date: r.end_date,
        status: r.status,
        created_at: r.created_at,
        vehicle: r.vehicle_id ? {
            id: r.vehicle_id,
            year: r.year,
            make: r.make,
            model: r.model
        } : null,
        user: r.user_id ? {
            id: r.user_id,
            name: r.firstname + ' ' + r.lastname,
            email: r.email
        } : null
    }));
};

const findRentalById = async (id) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        const rental = db.rentals.find((r) => r.id === Number(id));
        if (!rental) return null;

        const vehicle = db.vehicles.find((v) => v.id === rental.vehicle_id);
        const user = db.users.find((u) => u.id === rental.user_id);
        return { ...rental, vehicle: vehicle || null, user: user || null };
    }
    
    const result = await pool.query(
        `SELECT r.*, v.vehicle_id, v.year, v.make, v.model, v.image_path,
                u.user_id, u.firstname, u.lastname, u.email
         FROM rentals r
         LEFT JOIN vehicles v ON r.vehicle_id = v.vehicle_id
         LEFT JOIN users u ON r.user_id = u.user_id
         WHERE r.rental_id = $1`,
        [id]
    );
    
    if (result.rows.length === 0) return null;
    
    const r = result.rows[0];
    return {
        id: r.rental_id,
        user_id: r.user_id,
        vehicle_id: r.vehicle_id,
        start_date: r.start_date,
        end_date: r.end_date,
        status: r.status,
        created_at: r.created_at,
        vehicle: r.vehicle_id ? {
            id: r.vehicle_id,
            year: r.year,
            make: r.make,
            model: r.model,
            image_path: r.image_path
        } : null,
        user: r.user_id ? {
            id: r.user_id,
            name: r.firstname + ' ' + r.lastname,
            email: r.email
        } : null
    };
};

const updateRentalStatus = async (id, status) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        const rental = db.rentals.find((r) => r.id === Number(id));
        if (!rental) return null;

        rental.status = status;

        // If cancelled or completed, make vehicle available again
        if (status === 'cancelled' || status === 'completed') {
            const otherActive = db.rentals.some((r) => {
                if (r.id === Number(id)) return false;
                if (r.status === 'completed' || r.status === 'cancelled') return false;
                return r.vehicle_id === rental.vehicle_id;
            });
            if (!otherActive) {
                await updateVehicle(rental.vehicle_id, { availability: true });
            }
        }

        return rental;
    }
    
    const rental = await findRentalById(id);
    if (!rental) return null;

    const result = await pool.query(
        `UPDATE rentals
         SET status = $1
         WHERE id = $2
         RETURNING *`,
        [status, id]
    );

    // If cancelled or completed, make vehicle available again
    if (status === 'cancelled' || status === 'completed') {
        const otherActive = await pool.query(
            `SELECT id FROM rentals
             WHERE status IN ('pending', 'active')
             AND vehicle_id = $1
             AND id != $2`,
            [rental.vehicle_id, id]
        );
        
        if (otherActive.rowCount === 0) {
            await updateVehicle(rental.vehicle_id, { availability: true });
        }
    }

    return result.rows[0];
};

const cancelRental = async (id) => {
    return updateRentalStatus(id, 'cancelled');
};

export {
    createRental,
    findRentalsByUser,
    findAllRentals,
    findRentalById,
    updateRentalStatus,
    cancelRental,
    findBlockedDates,
    hasDateOverlap
};