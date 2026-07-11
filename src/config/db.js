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
        { vehicle_id: 1, image_path: 'https://picsum.photos/seed/toyota-corolla-2022/600/400' },
        { vehicle_id: 1, image_path: 'https://picsum.photos/seed/toyota-corolla-2022-2/600/400' },
        { vehicle_id: 2, image_path: 'https://picsum.photos/seed/chevy-silverado-2018/600/400' },
        { vehicle_id: 2, image_path: 'https://picsum.photos/seed/chevy-silverado-2018-2/600/400' },
        { vehicle_id: 3, image_path: 'https://picsum.photos/seed/honda-crv-2021/600/400' },
        { vehicle_id: 3, image_path: 'https://picsum.photos/seed/honda-crv-2021-2/600/400' },
        { vehicle_id: 4, image_path: 'https://picsum.photos/seed/chrysler-pacifica-2019/600/400' },
        { vehicle_id: 4, image_path: 'https://picsum.photos/seed/chrysler-pacifica-2019-2/600/400' },
        { vehicle_id: 5, image_path: 'https://picsum.photos/seed/ford-mustang-2023/600/400' },
        { vehicle_id: 5, image_path: 'https://picsum.photos/seed/ford-mustang-2023-2/600/400' },
        { vehicle_id: 6, image_path: 'https://picsum.photos/seed/jeep-wrangler-2017/600/400' },
        { vehicle_id: 6, image_path: 'https://picsum.photos/seed/jeep-wrangler-2017-2/600/400' },
        { vehicle_id: 7, image_path: 'https://picsum.photos/seed/toyota-tacoma-2020/600/400' },
        { vehicle_id: 7, image_path: 'https://picsum.photos/seed/toyota-tacoma-2020-2/600/400' },
        { vehicle_id: 8, image_path: 'https://picsum.photos/seed/hyundai-elantra-2016/600/400' },
        { vehicle_id: 8, image_path: 'https://picsum.photos/seed/hyundai-elantra-2016-2/600/400' }
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
