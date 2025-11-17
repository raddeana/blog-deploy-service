/**
 * 服务入口文件
 * @author Philip
 */
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import connectMongoDB from './services/mongo.js';
import corsMiddleware from './middlewares/cors.js';
import authorizeMiddleware from './middlewares/authorize.js';
import routes from './routes.js';

const secret = 'PhilipChen';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const baseDir = __dirname.replace(/(\\|\/)server/, '');
const midStatic = express.static(path.join(baseDir, `www${path.sep}static`), {
    maxAge: '30d',
});

// 指定模板引擎
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// 指定模板位置
app.set('views', baseDir + `${path.sep}www`);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(midStatic)

await connectMongoDB();

app.use(cookieParser(secret));
app.use(session({
    secret,
    store: MongoStore.create({
        mongooseConnection: mongoose.connection,
    }),
    saveUninitialized: false,
    httpOnly: true,
    cookie: {
        maxAge: 1000 * 60 * 30
    },
}));

app.use(corsMiddleware);
app.use(authorizeMiddleware);

routes(app);

app.listen(3333);
