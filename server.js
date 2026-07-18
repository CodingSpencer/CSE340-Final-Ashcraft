import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// 1. Import the layouts package
import expressLayouts from 'express-ejs-layouts'; 

import accountRoutes from './src/routes/account.routes.js';
import inventoryRoutes from './src/routes/inventory.routes.js';
import rentalRoutes from './src/routes/rental.routes.js';
import reviewRoutes from './src/routes/review.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import { authContextMiddleware, flashMiddleware, sessionMiddleware } from './src/config/session.js';
import { initializeDemoData } from './src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// 2. Tell Express to use the layout middleware
app.use(expressLayouts); 
// 3. Set the default layout file (points to src/views/layouts/layout.ejs)
app.set('layout', 'layouts/layout'); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('dist'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(sessionMiddleware);
app.use(flashMiddleware);
app.use(authContextMiddleware);

app.get('/', (req, res) => {
  // 4. Remove the .ejs extension here (Express adds it automatically based on your view engine)
  res.render('pages/index', { title: 'Home' });
});

app.use('/', accountRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/', rentalRoutes);
app.use('/', reviewRoutes);
app.use('/', adminRoutes);

// Initialize database on startup
if (process.env.NODE_ENV !== 'test') {
    // Initialize demo data if needed
    initializeDemoData().catch((err) => {
        console.error('Error initializing demo data:', err);
    });
    
    app.listen(3000, () => {
        console.log('Server is running on: http://localhost:3000');
    });
}

export default app;