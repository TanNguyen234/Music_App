import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
const methodOverride = require('method-override');
import moment from 'moment';

//Tạo thông báo
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
//End Tạo thông báo

import * as database from './config/database'
import { systemConfig } from './config/config';
import clientRoutes from './routes/client/index.route';
import adminRoutes from './routes/admin/index.route';

dotenv.config();
database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

//TinyMCE
app.use(
    "/tinymce",
    express.static(path.join(__dirname, "node_modules", "tinymce"))
)
//End TinyMCE

// Thiết lập thư mục public cho file tĩnh
app.use(express.static(path.join(__dirname, 'public')));

// Thiết lập template engine là Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))


//Flash thư viện cho thông báo cho express js
app.use(cookieParser("YSUDGSGDJSGDJ")); //key ngâu nhiên cho tăng tính bảo mật
app.use(session({ cookie: { maxAge: 60000 } })); //Thời gian cookie tồn tại 60000 ml giây
app.use(flash());

// Import routes
clientRoutes(app);
adminRoutes(app);

//App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin
app.locals.moment = moment

//Page 404
app.get('*', (req: Request, res: Response) => {
    res.render('client/pages/errors/404', {
        titlePage: '404 Not Found',
    })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});