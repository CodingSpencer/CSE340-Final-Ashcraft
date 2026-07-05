import bcrypt from 'bcrypt';

const state = {
    initialized: false,
    users: [],
    nextId: 1
};

const initializeDemoData = async () => {
    if (state.initialized) {
        return;
    }

    const hashedPassword = await bcrypt.hash('password123', 10);
    state.users.push({
        id: state.nextId++,
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        roleName: 'admin',
        createdAt: new Date().toISOString()
    });

    state.initialized = true;
};

const getDb = async () => {
    await initializeDemoData();
    return state;
};

export { getDb };
export default { getDb };
