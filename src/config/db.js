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

    // --- Seed Vehicle Images ---
    const vehicleImageData = [
        { vehicle_id: 1, image_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/2020_Toyota_Corolla_Ascent_Sport_hybrid_hatchback_%282019-07-06%29_01.jpg/800px-2020_Toyota_Corolla_Ascent_Sport_hybrid_hatchback_%282019-07-06%29_01.jpg' },
        { vehicle_id: 1, image_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/2020_Toyota_Corolla_Ascent_Sport_hybrid_hatchback_%282019-07-06%29_02.jpg/800px-2020_Toyota_Corolla_Ascent_Sport_hybrid_hatchback_%282019-07-06%29_02.jpg' },
        { vehicle_id: 2, image_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/2016_Chevrolet_Silverado_1500_LT_Z71_Crew_Cab.jpg/800px-2016_Chevrolet_Silverado_1500_LT_Z71_Crew_Cab.jpg' },
        { vehicle_id: 2, image_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/2016_Chevrolet_Silverado_1500_LT_Z71_Crew_Cab_front.jpg/800px-2016_Chevrolet_Silverado_1500_LT_Z71_Crew_Cab_front.jpg' },
        { vehicle_id: 3, image_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/2020_Honda_CR-V_EX_AWD_front_view_in_Lunar_Silver_Metallic.jpg/800px-2020_Honda_CR-V_EX_AWD_front_view_in_Lunar_Silver_Metallic.jpg' },
        { vehicle_id: 3, image_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/2020_Honda_CR-V_EX_AWD_rear_view_in_Lunar_Silver_Metallic.jpg/800px-2020_Honda_CR-V_EX_AWD_rear_view_in_Lunar_Silver_Metallic.jpg' },
        { vehicle_id: 4, image_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/2017_Chrysler_Pacifica_Limited_front_right.jpg/800px-2017_Chrysler_Pacifica_Limited_front_right.jpg' },
        { vehicle_id: 4, image_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/2017_Chrysler_Pacifica_Limited_rear_left.jpg/800px-2017_Chrysler_Pacifica_Limited_rear_left.jpg' },
        { vehicle_id: 5, image_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/2015_Ford_Mustang_GT_5.0_Fastback_front.jpg/800px-2015_Ford_Mustang_GT_5.0_Fastback_front.jpg' },
        { vehicle_id: 5, image_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/2015_Ford_Mustang_GT_5.0_Fastback_rear.jpg/800px-2015_Ford_Mustang_GT_5.0_Fastback_rear.jpg' },
        { vehicle_id: 6, image_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/2018_Jeep_Wrangler_Unlimited_Sahara_front.jpg/800px-2018_Jeep_Wrangler_Unlimited_Sahara_front.jpg' },
        { vehicle_id: 6, image_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/2018_Jeep_Wrangler_Unlimited_Sahara_rear.jpg/800px-2018_Jeep_Wrangler_Unlimited_Sahara_rear.jpg' },
        { vehicle_id: 7, image_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/2016_Toyota_Tacoma_TRD_Off_Road_Double_Cab_front_1.jpg/800px-2016_Toyota_Tacoma_TRD_Off_Road_Double_Cab_front_1.jpg' },
        { vehicle_id: 7, image_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/2016_Toyota_Tacoma_TRD_Off_Road_Double_Cab_rear_1.jpg/800px-2016_Toyota_Tacoma_TRD_Off_Road_Double_Cab_rear_1.jpg' },
        { vehicle_id: 8, image_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/2017_Hyundai_Elantra_SE_front.jpg/800px-2017_Hyundai_Elantra_SE_Senior_Editor_review.jpg' },
        { vehicle_id: 8, image_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/2017_Hyundai_Elantra_SE_rear.jpg/800px-2017_Hyundai_Elantra_SE_rear.jpg' }
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
