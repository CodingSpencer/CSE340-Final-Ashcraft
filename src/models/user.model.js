import bcrypt from 'bcrypt';
import { getDb } from '../config/db.js';

const buildUserSession = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    roleName: user.roleName || 'customer'
});

const findUserByEmail = async (email) => {
    const db = await getDb();
    return db.users.find((user) => user.email.toLowerCase() === String(email).toLowerCase()) || null;
};

const findUserById = async (id) => {
    const db = await getDb();
    return db.users.find((user) => user.id === Number(id)) || null;
};

const createUser = async (name, email, password, roleName = 'customer') => {
    const db = await getDb();
    const user = {
        id: db.nextUserId++,
        name,
        email,
        password,
        roleName,
        createdAt: new Date().toISOString()
    };

    db.users.push(user);
    return buildUserSession(user);
};

const listUsers = async () => {
    const db = await getDb();
    return db.users.map((user) => buildUserSession(user));
};

const updateUserById = async (id, updates) => {
    const db = await getDb();
    const user = db.users.find((item) => item.id === Number(id));

    if (!user) {
        return null;
    }

    Object.assign(user, updates);
    return buildUserSession(user);
};

const deleteUserById = async (id) => {
    const db = await getDb();
    const index = db.users.findIndex((user) => user.id === Number(id));

    if (index === -1) {
        return false;
    }

    db.users.splice(index, 1);
    return true;
};

const verifyPassword = async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

export {
    buildUserSession,
    createUser,
    deleteUserById,
    findUserByEmail,
    findUserById,
    listUsers,
    updateUserById,
    verifyPassword
};