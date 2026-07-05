const showDashboard = (req, res) => {
    res.render('pages/auth/dashboard', {
        title: 'Dashboard',
        user: req.session.user
    });
};

export { showDashboard };