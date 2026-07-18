import { getDb } from '../config/db.js';
import { updateVehicle } from './vehicle.model.js';

/**
 * Check if a vehicle has any active/pending rental that overlaps with the given date range.
 */
const hasDateOverlap = async (vehicleId, startDate, endDate, excludeRentalId = null) => {
    const db = await getDb();
    const start = new Date(startDate);
    const end = new Date(endDate);

    return db.rentals.some((r) => {
        // Exclude completed/cancelled rentals and optionally a specific rental ID
        if (r.status === 'completed' || r.status === 'cancelled') return false;
        if (excludeRentalId && r.id === Number(excludeRentalId)) return false;
        if (r.vehicle_id !== Number(vehicleId)) return false;

        const existingStart = new Date(r.start_date);
        const existingEnd = new Date(r.end_date);

        // Overlap: one range starts before the other ends and vice versa
        return start <= existingEnd && end >= existingStart;
    });
};

/**
 * Get all blocked date ranges for a vehicle (active/pending rentals).
 * Returns an array of { start_date, end_date } objects.
 */
const findBlockedDates = async (vehicleId) => {
    const db = await getDb();
    return db.rentals
        .filter((r) => {
            if (r.status === 'completed' || r.status === 'cancelled') return false;
            return r.vehicle_id === Number(vehicleId);
        })
        .map((r) => ({
            start_date: r.start_date,
            end_date: r.end_date
        }));
};

const createRental = async ({ user_id, vehicle_id, start_date, end_date }) => {
    const db = await getDb();

    // Check for date overlap before creating
    const overlap = await hasDateOverlap(vehicle_id, start_date, end_date);
    if (overlap) {
        throw new Error('This vehicle is already rented during the requested dates.');
    }

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
};

const findRentalsByUser = async (userId) => {
    const db = await getDb();
    return db.rentals
        .filter((r) => r.user_id === Number(userId))
        .map((r) => {
            const vehicle = db.vehicles.find((v) => v.id === r.vehicle_id);
            return { ...r, vehicle: vehicle || null };
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

const findAllRentals = async () => {
    const db = await getDb();
    return db.rentals
        .map((r) => {
            const vehicle = db.vehicles.find((v) => v.id === r.vehicle_id);
            const user = db.users.find((u) => u.id === r.user_id);
            return { ...r, vehicle: vehicle || null, user: user || null };
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

const findRentalById = async (id) => {
    const db = await getDb();
    const rental = db.rentals.find((r) => r.id === Number(id));
    if (!rental) return null;

    const vehicle = db.vehicles.find((v) => v.id === rental.vehicle_id);
    const user = db.users.find((u) => u.id === rental.user_id);
    return { ...rental, vehicle: vehicle || null, user: user || null };
};

const updateRentalStatus = async (id, status) => {
    const db = await getDb();
    const rental = db.rentals.find((r) => r.id === Number(id));
    if (!rental) return null;

    rental.status = status;

    // If cancelled or completed, make vehicle available again
    if (status === 'cancelled' || status === 'completed') {
        // Only set availability to true if there are no other active/pending rentals
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