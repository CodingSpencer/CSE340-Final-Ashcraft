import { listVehicles, findVehicleById } from '../models/vehicle.model.js';
import { listCategories } from '../models/category.model.js';

const showInventory = async (req, res) => {
    try {
        const categoryId = req.query.category || null;
        const vehicles = await listVehicles(categoryId);
        const categories = await listCategories();

        res.render('pages/inventory/index', {
            title: 'Inventory',
            vehicles,
            categories,
            selectedCategory: categoryId
        });
    } catch (error) {
        console.error('Error loading inventory:', error);
        req.flash('error', 'Unable to load inventory at this time.');
        res.redirect('/');
    }
};

const showVehicleDetail = async (req, res) => {
    try {
        const vehicle = await findVehicleById(req.params.id);

        if (!vehicle) {
            req.flash('error', 'Vehicle not found.');
            return res.redirect('/inventory');
        }

        res.render('pages/inventory/detail', {
            title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
            vehicle
        });
    } catch (error) {
        console.error('Error loading vehicle detail:', error);
        req.flash('error', 'Unable to load vehicle details.');
        res.redirect('/inventory');
    }
};

export { showInventory, showVehicleDetail };