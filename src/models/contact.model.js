import { getDb, pool, useMemoryStorage } from '../config/db.js';

const createContactMessage = async ({ firstname, lastname, email, message }) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        const contact = {
            id: db.nextMessageId++,
            firstname,
            lastname,
            email,
            message,
            created_at: new Date().toISOString()
        };
        db.contactMessages.push(contact);
        return contact;
    }
    
    const result = await pool.query(
        `INSERT INTO contact_messages (firstname, lastname, email, message, created_at)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [firstname, lastname, email, message, new Date().toISOString()]
    );
    return result.rows[0];
};

const findAllContactMessages = async () => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        return db.contactMessages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    const result = await pool.query(
        'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    return result.rows;
};

const findContactMessageById = async (id) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        return db.contactMessages.find((m) => m.id === Number(id)) || null;
    }
    
    const result = await pool.query(
        'SELECT * FROM contact_messages WHERE id = $1',
        [id]
    );
    return result.rows[0] || null;
};

const deleteContactMessage = async (id) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        const index = db.contactMessages.findIndex((m) => m.id === Number(id));
        if (index === -1) return false;
        db.contactMessages.splice(index, 1);
        return true;
    }
    
    const result = await pool.query(
        'DELETE FROM contact_messages WHERE id = $1',
        [id]
    );
    return result.rowCount > 0;
};

export {
    createContactMessage,
    findAllContactMessages,
    findContactMessageById,
    deleteContactMessage
};