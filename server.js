import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import accountRoutes from './src/routes/account.routes.js';
import { authContextMiddleware, flashMiddleware, sessionMiddleware } from './src/config/session.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(sessionMiddleware);
app.use(flashMiddleware);
app.use(authContextMiddleware);

app.get('/', (req, res) => {
  res.render('pages/home/index', { title: 'Home' });
});

app.use('/', accountRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

export default app;