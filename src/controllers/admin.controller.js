import { listVehicles, findVehicleById, createVehicle, updateVehicle, deleteVehicle } from '../models/vehicle.model.js';
import { listUsers, findUserById, updateUserById, deleteUserById } from '../models/user.model.js';
import { checkAdmin } from '../middleware/auth.js';

const showAdminVehicles = async (req, res) => {
    try {
        const vehicles = await listVehicles();
        res.render('pages/admin/vehicles', {
            title: 'Manage Vehicles',
            vehicles
        });
    } catch (error) {
        console.error('Error loading admin vehicles:', error);
        req.flash('error', 'Unable to load vehicles.');
        res.redirect('/dashboard');
    }
};

const showAddVehicleForm = async (req, res) => {
    res.render('pages/admin/add-vehicle', {
        title: 'Add Vehicle'
    });
};

const handleAddVehicle = async (req, res) => {
    try {
        const { category_id, make, model, year, mileage, price, description, availability } = req.body;
        
        await createVehicle({
            category_id,
            make,
            model,
            year,
            mileage,
            price,
            description,
            availability
        });

        req.flash('success', 'Vehicle added successfully.');
        res.redirect('/admin/vehicles');
    } catch (error) {
        console.error('Error adding vehicle:', error);
        req.flash('error', 'Unable to add vehicle.');
        res.redirect('/admin/vehicles/add');
    }
};

const showEditVehicleForm = async (req, res) => {
    try {
        const vehicle = await findVehicleById(req.params.id);
        
        if (!vehicle) {
            req.flash('error', 'Vehicle not found.');
            return res.redirect('/admin/vehicles');
        }

        res.render('pages/admin/edit-vehicle', {
            title: 'Edit Vehicle',
            vehicle
        });
    } catch (error) {
        console.error('Error loading edit vehicle form:', error);
        req.flash('error', 'Unable to load vehicle for editing.');
        res.redirect('/admin/vehicles');
    }
};

const handleUpdateVehicle = async (req, res) => {
    try {
        const { category_id, make, model, year, mileage, price, description, availability } = req.body;
        
        const vehicle = await updateVehicle(req.params.id, {
            category_id,
            make,
            model,
            year,
            mileage,
            price,
            description,
            availability
        });

        if (!vehicle) {
            req.flash('error', 'Vehicle not found.');
            return res.redirect('/admin/vehicles');
        }

        req.flash('success', 'Vehicle updated successfully.');
        res.redirect('/admin/vehicles');
    } catch (error) {
        console.error('Error updating vehicle:', error);
        req.flash('error', 'Unable to update vehicle.');
        res.redirect(`/admin/vehicles/${req.params.id}/edit`);
    }
};

const handleDeleteVehicle = async (req, res) => {
    try {
        const deleted = await deleteVehicle(req.params.id);
        
        if (!deleted) {
            req.flash('error', 'Vehicle not found.');
            return res.redirect('/admin/vehicles');
        }

        req.flash('success', 'Vehicle deleted successfully.');
        res.redirect('/admin/vehicles');
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        req.flash('error', 'Unable to delete vehicle.');
        res.redirect('/admin/vehicles');
    }
};

const showAdminUsers = async (req, res) => {
    try {
        const users = await listUsers();
        res.render('pages/admin/users', {
            title: 'Manage Users',
            users
        });
    } catch (error) {
        console.error('Error loading admin users:', error);
        req.flash('error', 'Unable to load users.');
        res.redirect('/dashboard');
    }
};

const handleDeleteUser = async (req, res) => {
    try {
        const deleted = await deleteUserById(req.params.id);
        
        if (!deleted) {
            req.flash('error', 'User not found.');
            return res.redirect('/admin/users');
        }

        req.flash('success', 'User deleted successfully.');
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error deleting user:', error);
        req.flash('error', 'Unable to delete user.');
        res.redirect('/admin/users');
    }
};

export {
    showAdminVehicles,
    showAddVehicleForm,
    handleAddVehicle,
    showEditVehicleForm,
    handleUpdateVehicle,
    handleDeleteVehicle,
    showAdminUsers,
    handleDeleteUser
};