import express from 'express';
import expressLayouts from 'express-ejs-layouts';

const app = express();

app.use(express.static('public'));

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Use express-ejs-layouts middleware
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

// Routes

// Home page
app.get('/', (req, res) => {
    res.render("pages/index", { 
        title: "Home | Cougar Car Rental",
        user: null
    });
});

app.listen(3000, () => {
  console.log('Server is running on: http://localhost:3000');
});

export default app;