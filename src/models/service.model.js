import { getDb, pool, useMemoryStorage } from '../config/db.js';

const createServiceRequest = async ({ user_id, vehicle_id, service_type, notes }) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        const request = {
            id: db.nextRequestId++,
            user_id: Number(user_id),
            vehicle_id: Number(vehicle_id),
            service_type,
            notes: notes || null,
            status: 'Submitted',
            employee_notes: null,
            created_at: new Date().toISOString()
        };
        db.serviceRequests.push(request);
        return request;
    }
    
    const result = await pool.query(
        `INSERT INTO service_requests (user_id, vehicle_id, service_type, notes, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [user_id, vehicle_id, service_type, notes, 'Submitted', new Date().toISOString()]
    );
    return result.rows[0];
};

const findServiceRequestsByUser = async (userId) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        return db.serviceRequests
            .filter((r) => r.user_id === Number(userId))
            .map((r) => {
                const vehicle = db.vehicles.find((v) => v.id === r.vehicle_id);
                return { ...r, vehicle: vehicle || null };
            })
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    const result = await pool.query(
        `SELECT sr.*, v.id as vehicle_id, v.year, v.make, v.model
         FROM service_requests sr
         LEFT JOIN vehicles v ON sr.vehicle_id = v.id
         WHERE sr.user_id = $1
         ORDER BY sr.created_at DESC`,
        [userId]
    );
    
    return result.rows.map((r) => ({
        id: r.id,
        user_id: r.user_id,
        vehicle_id: r.vehicle_id,
        service_type: r.service_type,
        notes: r.notes,
        status: r.status,
        employee_notes: r.employee_notes,
        created_at: r.created_at,
        vehicle: r.vehicle_id ? {
            id: r.vehicle_id,
            year: r.year,
            make: r.make,
            model: r.model
        } : null
    }));
};

const findAllServiceRequests = async () => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        return db.serviceRequests
            .map((r) => {
                const vehicle = db.vehicles.find((v) => v.id === r.vehicle_id);
                const user = db.users.find((u) => u.id === r.user_id);
                return { ...r, vehicle: vehicle || null, user: user || null };
            })
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    const result = await pool.query(
        `SELECT sr.*, v.id as vehicle_id, v.year, v.make, v.model,
                u.id as user_id, u.name as user_name, u.email as user_email
         FROM service_requests sr
         LEFT JOIN vehicles v ON sr.vehicle_id = v.id
         LEFT JOIN users u ON sr.user_id = u.id
         ORDER BY sr.created_at DESC`
    );
    
    return result.rows.map((r) => ({
        id: r.id,
        user_id: r.user_id,
        vehicle_id: r.vehicle_id,
        service_type: r.service_type,
        notes: r.notes,
        status: r.status,
        employee_notes: r.employee_notes,
        created_at: r.created_at,
        vehicle: r.vehicle_id ? {
            id: r.vehicle_id,
            year: r.year,
            make: r.make,
            model: r.model
        } : null,
        user: r.user_id ? {
            id: r.user_id,
            name: r.user_name,
            email: r.user_email
        } : null
    }));
};

const findServiceRequestById = async (id) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        const r = db.serviceRequests.find((req) => req.id === Number(id));
        if (!r) return null;
        
        const vehicle = db.vehicles.find((v) => v.id === r.vehicle_id);
        const user = db.users.find((u) => u.id === r.user_id);
        return { ...r, vehicle: vehicle || null, user: user || null };
    }
    
    const result = await pool.query(
        `SELECT sr.*, v.id as vehicle_id, v.year, v.make, v.model,
                u.id as user_id, u.name as user_name, u.email as user_email
         FROM service_requests sr
         LEFT JOIN vehicles v ON sr.vehicle_id = v.id
         LEFT JOIN users u ON sr.user_id = u.id
         WHERE sr.id = $1`,
        [id]
    );
    
    if (result.rows.length === 0) return null;
    
    const r = result.rows[0];
    return {
        id: r.id,
        user_id: r.user_id,
        vehicle_id: r.vehicle_id,
        service_type: r.service_type,
        notes: r.notes,
        status: r.status,
        employee_notes: r.employee_notes,
        created_at: r.created_at,
        vehicle: r.vehicle_id ? {
            id: r.vehicle_id,
            year: r.year,
            make: r.make,
            model: r.model
        } : null,
        user: r.user_id ? {
            id: r.user_id,
            name: r.user_name,
            email: r.user_email
        } : null
    };
};

const updateServiceRequestStatus = async (id, status, employeeNotes = null) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        const request = db.serviceRequests.find((r) => r.id === Number(id));
        if (!request) return null;
        
        request.status = status;
        if (employeeNotes !== null) {
            request.employee_notes = employeeNotes;
        }
        return request;
    }
    
    const result = await pool.query(
        `UPDATE service_requests
         SET status = $1, employee_notes = $2
         WHERE id = $3
         RETURNING *`,
        [status, employeeNotes, id]
    );
    return result.rows[0] || null;
};

const deleteServiceRequest = async (id) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        const index = db.serviceRequests.findIndex((r) => r.id === Number(id));
        if (index === -1) return false;
        db.serviceRequests.splice(index, 1);
        return true;
    }
    
    const result = await pool.query(
        'DELETE FROM service_requests WHERE id = $1',
        [id]
    );
    return result.rowCount > 0;
};

export {
    createServiceRequest,
    findServiceRequestsByUser,
    findAllServiceRequests,
    findServiceRequestById,
    updateServiceRequestStatus,
    deleteServiceRequest
};