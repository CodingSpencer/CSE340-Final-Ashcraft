import { getDb, pool, useMemoryStorage } from '../config/db.js';

const listCategories = async () => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        return db.categories.map((cat) => ({
            id: cat.id,
            category_id: cat.id,
            category_name: cat.category_name
        }));
    }
    
    const result = await pool.query('SELECT * FROM categories ORDER BY category_name');
    return result.rows.map((row) => ({
        id: row.category_id,
        category_id: row.category_id,
        category_name: row.category_name
    }));
};

const findCategoryById = async (id) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        return db.categories.find((cat) => cat.id === Number(id)) || null;
    }
    
    const result = await pool.query(
        'SELECT * FROM categories WHERE category_id = $1',
        [id]
    );
    return result.rows[0] || null;
};

const createCategory = async (categoryName) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        const category = {
            id: db.nextCategoryId++,
            category_name: categoryName
        };
        db.categories.push(category);
        return category;
    }
    
    const result = await pool.query(
        'INSERT INTO categories (category_name) VALUES ($1) RETURNING *',
        [categoryName]
    );
    return result.rows[0];
};

const updateCategory = async (id, categoryName) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        const category = db.categories.find((cat) => cat.id === Number(id));
        if (!category) return null;
        category.category_name = categoryName;
        return category;
    }
    
    const result = await pool.query(
        'UPDATE categories SET category_name = $1 WHERE category_id = $2 RETURNING *',
        [categoryName, id]
    );
    return result.rows[0] || null;
};

const deleteCategory = async (id) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        const index = db.categories.findIndex((cat) => cat.id === Number(id));
        if (index === -1) return false;
        db.categories.splice(index, 1);
        return true;
    }
    
    const result = await pool.query(
        'DELETE FROM categories WHERE category_id = $1',
        [id]
    );
    return result.rowCount > 0;
};

export {
    listCategories,
    findCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};