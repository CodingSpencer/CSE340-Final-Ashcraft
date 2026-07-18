import session from 'express-session';

const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'cse340-dev-secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 8,
        sameSite: 'lax'
    }
};

const sessionMiddleware = session(sessionConfig);

const flashMiddleware = (req, res, next) => {
    req.flash = (type, message) => {
        if (!req.session.flashMessages) {
            req.session.flashMessages = [];
        }

        req.session.flashMessages.push({ type, message });
    };

    const originalRender = res.render.bind(res);
    res.render = (view, locals = {}, callback) => {
        const flashMessages = req.session.flashMessages || [];
        req.session.flashMessages = [];

        const mergedLocals = typeof locals === 'function'
            ? { ...res.locals, flashMessages }
            : { ...res.locals, ...locals, flashMessages };

        return originalRender(view, mergedLocals, callback);
    };

    res.locals.flashMessages = req.session.flashMessages || [];
    next();
};

const authContextMiddleware = (req, res, next) => {
    res.locals.user = req.session?.user || null;
    res.locals.isLoggedIn = Boolean(req.session?.user);
    next();
};

export { sessionMiddleware, flashMiddleware, authContextMiddleware };