import bcrypt from 'bcrypt';

const state = {
    initialized: false,
    users: [],
    categories: [],
    vehicles: [],
    vehicleImages: [],
    reviews: [],
    serviceRequests: [],
    contactMessages: [],
    nextUserId: 1,
    nextCategoryId: 1,
    nextVehicleId: 1,
    nextImageId: 1,
    nextReviewId: 1,
    nextRequestId: 1,
    nextMessageId: 1
};

const initializeDemoData = async () => {
    if (state.initialized) {
        return;
    }

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
        { category_id: 1, make: 'Toyota', model: 'Corolla', year: 2022, mileage: 25000, price: 22000.00, description: 'Excellent commuter car, great gas mileage for driving around campus or town.', availability: true },
        { category_id: 2, make: 'Chevrolet', model: 'Silverado 1500', year: 2018, mileage: 75000, price: 31000.00, description: 'Perfect for hauling gear or navigating Idaho winters. Four-wheel drive and well maintained.', availability: true },
        { category_id: 3, make: 'Honda', model: 'CR-V', year: 2021, mileage: 40000, price: 26500.00, description: 'Spacious interior and all-wheel drive capabilities. A reliable choice for students and families alike.', availability: true },
        { category_id: 4, make: 'Chrysler', model: 'Pacifica', year: 2019, mileage: 60000, price: 24000.00, description: 'Comfortable seating for seven with stow-and-go capabilities. Freshly detailed.', availability: false },
        { category_id: 1, make: 'Ford', model: 'Mustang', year: 2023, mileage: 12000, price: 35000.00, description: 'Sporty and fast. Garage kept, one previous owner, and in pristine condition.', availability: true },
        { category_id: 3, make: 'Jeep', model: 'Wrangler', year: 2017, mileage: 85000, price: 27500.00, description: 'Trail-ready with upgraded off-road tires and a removable hardtop.', availability: true },
        { category_id: 2, make: 'Toyota', model: 'Tacoma', year: 2020, mileage: 52000, price: 33000.00, description: 'Highly dependable mid-size truck with a composite bed and excellent resale value.', availability: true },
        { category_id: 1, make: 'Hyundai', model: 'Elantra', year: 2016, mileage: 110000, price: 10500.00, description: 'Budget-friendly option with a clean Carfax. Recently serviced with new brake pads.', availability: true }
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
            availability: v.availability
        });
    });

    // Seed Vehicle Images 
    const vehicleImageData = [
        { vehicle_id: 1, image_path: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500' }, // Corolla
        { vehicle_id: 2, image_path: 'https://images.unsplash.com/photo-1598463282245-0d306b86411d?w=500' }, // Silverado
        { vehicle_id: 3, image_path: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=500' }, // CR-V
        { vehicle_id: 4, image_path: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=500' }, // Minivan
        { vehicle_id: 5, image_path: 'https://images.unsplash.com/photo-1584345604476-8aa5e58b943fad?w=500' }, // Mustang
        { vehicle_id: 6, image_path: 'https://images.unsplash.com/photo-1502877338535-7de6e104561e?w=500' }, // Wrangler
        { vehicle_id: 7, image_path: 'https://images.unsplash.com/photo-1551830820-330a41b9968d?w=500' }, // Tacoma
        { vehicle_id: 8, image_path: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500' }  // Elantra
    ];

    vehicleImageData.forEach((img) => {
        state.vehicleImages.push({
            id: state.nextImageId++,
            vehicle_id: img.vehicle_id,
            image_path: img.image_path
        });
    });

    state.initialized = true;
};

const getDb = async () => {
    await initializeDemoData();
    return state;
};

export { getDb };
export default { getDb };
