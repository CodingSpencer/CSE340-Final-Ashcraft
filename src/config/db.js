import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import vehicleData from '../../public/assets/json/vehicles.json' with { type: 'json' };
import fs from 'fs';
import path from 'path';

// Check if we should use in-memory storage (for development without database)
const useMemoryStorage = !process.env.DATABASE_URL;

// In-memory state for development
const state = {
    initialized: false,
    users: [],
    categories: [],
    vehicles: [],
    vehicleImages: [],
    reviews: [],
    serviceRequests: [],
    contactMessages: [],
    rentals: [],
    nextUserId: 1,
    nextCategoryId: 1,
    nextVehicleId: 1,
    nextImageId: 1,
    nextReviewId: 1,
    nextRequestId: 1,
    nextMessageId: 1,
    nextRentalId: 1
};

// PostgreSQL pool (only created if DATABASE_URL is set)
let pool = null;
if (!useMemoryStorage) {
    const { Pool } = await import('pg');
    const certPath = path.join(process.cwd(), 'public', 'byuicse-psql-cert.pem');
    const cert = fs.readFileSync(certPath, 'utf8');
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
            ca: fs.readFileSync(path.join(process.cwd(), 'public', 'byuicse-psql-cert.pem')).toString()
        }
    });
}

// Initialize database with demo data
const initializeDemoData = async () => {
    if (state.initialized) {
        return;
    }

    if (useMemoryStorage) {
        // --- Seed Users ---
        const hashedPassword = await bcrypt.hash('password123', 10);
        state.users.push({
            id: state.nextUserId++,
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            roleName: 'admin',
            createdAt: new Date().toISOString()
        });

        state.users.push({
            id: state.nextUserId++,
            name: 'Employee User',
            email: 'employee@example.com',
            password: hashedPassword,
            roleName: 'employee',
            createdAt: new Date().toISOString()
        });

        state.users.push({
            id: state.nextUserId++,
            name: 'Customer User',
            email: 'customer@example.com',
            password: hashedPassword,
            roleName: 'customer',
            createdAt: new Date().toISOString()
        });

        // --- Test User Account ---
        const testHashedPassword = await bcrypt.hash('testpassword123', 10);
        state.users.push({
            id: state.nextUserId++,
            name: 'Test User',
            email: 'test@example.com',
            password: testHashedPassword,
            roleName: 'customer',
            createdAt: new Date().toISOString()
        });

        // --- Seed Categories ---
        const categoryData = [
            { category_name: 'Cars' },
            { category_name: 'Trucks' },
            { category_name: 'SUVs' },
            { category_name: 'Vans' }
        ];

        categoryData.forEach((cat) => {
            state.categories.push({
                id: state.nextCategoryId++,
                category_name: cat.category_name
            });
        });

        // --- Seed Vehicles ---
        const vehicles = vehicleData;

        vehicleData.forEach((v) => {
            state.vehicles.push({
                id: state.nextVehicleId++,
                category_id: v.category_id,
                make: v.make,
                model: v.model,
                year: v.year,
                mileage: v.mileage,
                price: v.price,
                description: v.description,
                availability: v.availability,
                image_path: v.image_path
            });
        });

        // --- Seed Rentals ---
        state.rentals.push({
            id: state.nextRentalId++,
            user_id: 3,
            vehicle_id: 4,
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending',
            created_at: new Date().toISOString()
        });
    } else {
        // PostgreSQL initialization
        const vehicleCheck = await pool.query('SELECT COUNT(*) FROM vehicles');
        if (parseInt(vehicleCheck.rows[0].count) >= 8) {
            return;
        }

        // --- Seed Users ---
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        await pool.query(
            'INSERT INTO users (firstname, lastname, email, password, role, created_at) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING',
            ['Admin', 'User', 'admin@example.com', hashedPassword, 'Owner', new Date().toISOString()]
        );
        
        await pool.query(
            'INSERT INTO users (firstname, lastname, email, password, role, created_at) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING',
            ['Employee', 'User', 'employee@example.com', hashedPassword, 'Employee', new Date().toISOString()]
        );
        
        await pool.query(
            'INSERT INTO users (firstname, lastname, email, password, role, created_at) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING',
            ['Customer', 'User', 'customer@example.com', hashedPassword, 'Customer', new Date().toISOString()]
        );

        // --- Seed Categories ---
        const categories = ['Cars', 'Trucks', 'SUVs', 'Vans'];
        for (const cat of categories) {
            await pool.query(
                'INSERT INTO categories (category_name) VALUES ($1) ON CONFLICT DO NOTHING',
                [cat]
            );
        }

        // --- Seed Vehicles ---
        for (const v of vehicleData) {
            await pool.query(
                'INSERT INTO vehicles (category_id, make, model, year, mileage, price, description, availability) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                [v.category_id, v.make, v.model, v.year, v.mileage, v.price, v.description, v.availability]
            );
            
            // Insert vehicle image if available
            if (v.image_path) {
                await pool.query(
                    'INSERT INTO vehicle_images (vehicle_id, image_path) VALUES (currval(pg_get_serial_sequence(\'vehicles\', \'vehicle_id\')), $1)',
                    [v.image_path]
                );
            }
        }
    }

    state.initialized = true;
};

const getDb = async () => {
    if (useMemoryStorage) {
        return state;
    }
    return {
        query: (text, params) => pool.query(text, params)
    };
};

export { getDb, pool, initializeDemoData, useMemoryStorage };
export default { getDb, pool, initializeDemoData, useMemoryStorage };