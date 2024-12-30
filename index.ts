import express, { Express } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import * as database from './config/database'
import { systemConfig } from './config/config';
import clientRoutes from './routes/client/index.route';
import adminRoutes from './routes/admin/index.route';

dotenv.config();
database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

// Thiết lập thư mục public cho file tĩnh
app.use(express.static(path.join(__dirname, 'public')));

// Thiết lập template engine là Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAmin

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Import routes
clientRoutes(app);
adminRoutes(app);

//App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAmin

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});