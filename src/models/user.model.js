import bcrypt from 'bcrypt';
import { getDb, pool, useMemoryStorage } from '../config/db.js';

const buildUserSession = (user) => {
    const name = (user.firstname || user.name || '') + ' ' + (user.lastname || '');
    return {
        id: user.user_id || user.id,
        name: name.trim() || 'Unknown',
        email: user.email,
        password: user.password,
        roleName: user.role || user.roleName || 'customer'
    };
};

const findUserByEmail = async (email) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        return db.users.find((user) => user.email.toLowerCase() === String(email).toLowerCase()) || null;
    }
    
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email.toLowerCase()]
    );
    return result.rows[0] ? buildUserSession(result.rows[0]) : null;
};

const findUserById = async (id) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        return db.users.find((user) => user.id === Number(id) || user.user_id === Number(id)) || null;
    }
    
    const result = await pool.query(
        'SELECT * FROM users WHERE user_id = $1',
        [id]
    );
    return result.rows[0] ? buildUserSession(result.rows[0]) : null;
};

const createUser = async (name, email, password, roleName = 'Customer') => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        const user = {
            id: db.nextUserId++,
            name,
            email: email.toLowerCase(),
            password,
            roleName,
            createdAt: new Date().toISOString()
        };
        db.users.push(user);
        return buildUserSession(user);
    }
    
    // Split name into firstname and lastname
    const nameParts = name.split(' ');
    const firstname = nameParts[0] || name;
    const lastname = nameParts.slice(1).join(' ') || '';
    
    const result = await pool.query(
        `INSERT INTO users (firstname, lastname, email, password, role, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [firstname, lastname, email.toLowerCase(), password, roleName, new Date().toISOString()]
    );
    return buildUserSession(result.rows[0]);
};

const listUsers = async () => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        return db.users.map(buildUserSession);
    }
    
    const result = await pool.query('SELECT * FROM users');
    return result.rows.map(buildUserSession);
};

const updateUserById = async (id, updates) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        const user = db.users.find((item) => item.id === Number(id));
        if (!user) return null;
        Object.assign(user, updates);
        return buildUserSession(user);
    }

    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.name !== undefined) {
        fields.push(`name = $${paramCount++}`);
        values.push(updates.name);
    }
    if (updates.email !== undefined) {
        fields.push(`email = $${paramCount++}`);
        values.push(updates.email.toLowerCase());
    }
    if (updates.password !== undefined) {
        fields.push(`password = $${paramCount++}`);
        values.push(updates.password);
    }
    if (updates.roleName !== undefined) {
        fields.push(`roleName = $${paramCount++}`);
        values.push(updates.roleName);
    }

    if (fields.length === 0) {
        return findUserById(id);
    }

    values.push(id);
    const result = await pool.query(
        `UPDATE users SET ${fields.join(', ')} WHERE user_id = ${paramCount} RETURNING *`,
        values
    );

    return result.rows[0] ? buildUserSession(result.rows[0]) : null;
};

const deleteUserById = async (id) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        const index = db.users.findIndex((user) => user.id === Number(id) || user.user_id === Number(id));
        if (index === -1) return false;
        db.users.splice(index, 1);
        return true;
    }
    
    const result = await pool.query(
        'DELETE FROM users WHERE user_id = $1',
        [id]
    );
    return result.rowCount > 0;
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