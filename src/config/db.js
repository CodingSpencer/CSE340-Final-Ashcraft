import bcrypt from 'bcrypt';

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
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
            ca: process.env.NODE_ENV === 'production' ? process.env.DB_CERT : undefined
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
        const vehicleData = [
            { category_id: 1, make: 'Toyota', model: 'Corolla', year: 2022, mileage: 25000, price: 22000.00, description: 'Excellent commuter car, great gas mileage for driving around campus or town.', availability: true, image_path: '/assets/imgs/vehicles/Toyota_Corolla.jpg' },
            { category_id: 2, make: 'Chevrolet', model: 'Silverado 1500', year: 2018, mileage: 75000, price: 31000.00, description: 'Perfect for hauling gear or navigating Idaho winters. Four-wheel drive and well maintained.', availability: true, image_path: '/assets/imgs/vehicles/Chevrolet_Silverado.jpg' },
            { category_id: 3, make: 'Honda', model: 'CR-V', year: 2021, mileage: 40000, price: 26500.00, description: 'Spacious interior and all-wheel drive capabilities. A reliable choice for students and families alike.', availability: true, image_path: '/assets/imgs/vehicles/Honda_CR-V.jpg' },
            { category_id: 4, make: 'Chrysler', model: 'Pacifica', year: 2019, mileage: 60000, price: 24000.00, description: 'Comfortable seating for seven with stow-and-go capabilities. Freshly detailed.', availability: false, image_path: '/assets/imgs/vehicles/Chrysler_Pacifica.jpg' },
            { category_id: 1, make: 'Ford', model: 'Mustang', year: 2023, mileage: 12000, price: 35000.00, description: 'Sporty and fast. Garage kept, one previous owner, and in pristine condition.', availability: true, image_path: '/assets/imgs/vehicles/Ford_Mustang.jpg' },
            { category_id: 3, make: 'Jeep', model: 'Wrangler', year: 2017, mileage: 85000, price: 27500.00, description: 'Trail-ready with upgraded off-road tires and a removable hardtop.', availability: true, image_path: '/assets/imgs/vehicles/Jeep_Wrangler.jpg' },
            { category_id: 2, make: 'Toyota', model: 'Tacoma', year: 2020, mileage: 52000, price: 33000.00, description: 'Highly dependable mid-size truck with a composite bed and excellent resale value.', availability: true, image_path: '/assets/imgs/vehicles/Toyota_Tacoma.jpg' },
            { category_id: 1, make: 'Hyundai', model: 'Elantra', year: 2016, mileage: 110000, price: 10500.00, description: 'Budget-friendly option with a clean Carfax. Recently serviced with new brake pads.', availability: true, image_path: '/assets/imgs/vehicles/Hyundai_Elantra.jpg' }
        ];

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
        const userCheck = await pool.query('SELECT COUNT(*) FROM users');
        if (parseInt(userCheck.rows[0].count) > 0) {
            return;
        }

        // --- Seed Users ---
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        await pool.query(
            'INSERT INTO users (name, email, password, roleName, createdAt) VALUES ($1, $2, $3, $4, $5)',
            ['Admin User', 'admin@example.com', hashedPassword, 'admin', new Date().toISOString()]
        );
        
        await pool.query(
            'INSERT INTO users (name, email, password, roleName, createdAt) VALUES ($1, $2, $3, $4, $5)',
            ['Employee User', 'employee@example.com', hashedPassword, 'employee', new Date().toISOString()]
        );
        
        await pool.query(
            'INSERT INTO users (name, email, password, roleName, createdAt) VALUES ($1, $2, $3, $4, $5)',
            ['Customer User', 'customer@example.com', hashedPassword, 'customer', new Date().toISOString()]
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
        const vehicleData = [
            { category_id: 1, make: 'Toyota', model: 'Corolla', year: 2022, mileage: 25000, price: 22000.00, description: 'Excellent commuter car, great gas mileage for driving around campus or town.', availability: true, image_path: '/assets/imgs/vehicles/Toyota_Corolla.jpg' },
            { category_id: 2, make: 'Chevrolet', model: 'Silverado 1500', year: 2018, mileage: 75000, price: 31000.00, description: 'Perfect for hauling gear or navigating Idaho winters. Four-wheel drive and well maintained.', availability: true, image_path: '/assets/imgs/vehicles/Chevrolet_Silverado.jpg' },
            { category_id: 3, make: 'Honda', model: 'CR-V', year: 2021, mileage: 40000, price: 26500.00, description: 'Spacious interior and all-wheel drive capabilities. A reliable choice for students and families alike.', availability: true, image_path: '/assets/imgs/vehicles/Honda_CR-V.jpg' },
            { category_id: 4, make: 'Chrysler', model: 'Pacifica', year: 2019, mileage: 60000, price: 24000.00, description: 'Comfortable seating for seven with stow-and-go capabilities. Freshly detailed.', availability: false, image_path: '/assets/imgs/vehicles/Chrysler_Pacifica.jpg' },
            { category_id: 1, make: 'Ford', model: 'Mustang', year: 2023, mileage: 12000, price: 35000.00, description: 'Sporty and fast. Garage kept, one previous owner, and in pristine condition.', availability: true, image_path: '/assets/imgs/vehicles/Ford_Mustang.jpg' },
            { category_id: 3, make: 'Jeep', model: 'Wrangler', year: 2017, mileage: 85000, price: 27500.00, description: 'Trail-ready with upgraded off-road tires and a removable hardtop.', availability: true, image_path: '/assets/imgs/vehicles/Jeep_Wrangler.jpg' },
            { category_id: 2, make: 'Toyota', model: 'Tacoma', year: 2020, mileage: 52000, price: 33000.00, description: 'Highly dependable mid-size truck with a composite bed and excellent resale value.', availability: true, image_path: '/assets/imgs/vehicles/Toyota_Tacoma.jpg' },
            { category_id: 1, make: 'Hyundai', model: 'Elantra', year: 2016, mileage: 110000, price: 10500.00, description: 'Budget-friendly option with a clean Carfax. Recently serviced with new brake pads.', availability: true, image_path: '/assets/imgs/vehicles/Hyundai_Elantra.jpg' }
        ];

        for (const v of vehicleData) {
            await pool.query(
                'INSERT INTO vehicles (category_id, make, model, year, mileage, price, description, availability, image_path) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                [v.category_id, v.make, v.model, v.year, v.mileage, v.price, v.description, v.availability, v.image_path]
            );
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