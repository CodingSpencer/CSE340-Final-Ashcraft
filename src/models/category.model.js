import { getDb } from '../config/db.js';

const listCategories = async () => {
    const db = await getDb();
    return db.categories;
};

const findCategoryById = async (id) => {
    const db = await getDb();
    return db.categories.find((cat) => cat.id === Number(id)) || null;
};

const createCategory = async (categoryName) => {
    const db = await getDb();
    const category = {
        id: db.nextCategoryId++,
        category_name: categoryName
    };
    db.categories.push(category);
    return category;
};

const updateCategory = async (id, categoryName) => {
    const db = await getDb();
    const category = db.categories.find((cat) => cat.id === Number(id));
    if (!category) return null;
    category.category_name = categoryName;
    return category;
};

const deleteCategory = async (id) => {
    const db = await getDb();
    const index = db.categories.findIndex((cat) => cat.id === Number(id));
    if (index === -1) return false;
    db.categories.splice(index, 1);
    return true;
};

export {
    listCategories,
    findCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};