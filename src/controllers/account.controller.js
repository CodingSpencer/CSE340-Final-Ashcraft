import bcrypt from 'bcrypt';

import {
    createUser,
    findUserByEmail,
    verifyPassword
} from '../models/user.model.js';

const showLoginForm = (req, res) => {
    res.render('pages/auth/login', {
        title: 'Login'
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        req.flash('error', 'Please enter both email and password.');
        return res.redirect('/login');
    }

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            roleName: user.roleName || 'customer'
        };

        req.flash('success', 'Login successful.');
        return res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Unable to log in right now.');
        return res.redirect('/login');
    }
};

const showRegisterForm = (req, res) => {
    res.render('pages/auth/register', {
        title: 'Register'
    });
};

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/register');
    }

    try {
        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            req.flash('error', 'An account with that email already exists.');
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser(name, email, hashedPassword);

        // Auto-login the user after registration
        req.session.user = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            roleName: newUser.roleName || 'customer'
        };

        req.flash('success', 'Registration successful. Welcome to Cougar Car Rental!');
        return res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Unable to create account right now.');
        return res.redirect('/register');
    }
};

const logout = (req, res) => {
    req.flash('success', 'You have been logged out.');
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};

export default { login, logout, register, showLoginForm, showRegisterForm };