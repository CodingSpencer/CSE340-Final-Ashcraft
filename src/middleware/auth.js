/**
 * Middleware to require authentication for protected routes.
 * Redirects to login page if user is not authenticated.
 * Sets res.locals.isLoggedIn = true for authenticated requests.
 */
const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
        res.locals.user = req.session.user;
        return next();
    }

    req.flash('error', 'You must be logged in to access that page.');
    return res.redirect('/login');
};

/**
 * Middleware factory to require a specific role for route access.
 *
 * @param {string} roleName - The role name required (for example: 'admin', 'customer')
 * @returns {Function} Express middleware function
 */
const requireRole = (roleName) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        if (req.session.user.roleName !== roleName) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/dashboard');
        }

        res.locals.isLoggedIn = true;
        res.locals.user = req.session.user;
        return next();
    };
};

/**
 * Middleware to require employee role.
 */
const checkEmployee = requireRole('employee');

/**
 * Middleware to require admin (owner) role.
 */
const checkAdmin = requireRole('admin');

export { requireLogin, requireRole, checkEmployee, checkAdmin };
