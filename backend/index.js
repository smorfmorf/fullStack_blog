import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import 'colors';
import dotenv from 'dotenv';
dotenv.config();
import multer from 'multer';

import cors from 'cors';

import { registerValidation, loginValidation, postCreateValidation } from './validation.js';
import { UserController, PostController } from './controllers/index.js';
import { checkAuth, handleValidateErrors } from './utils/index.js';

mongoose
    .connect(
        'mongodb+srv://mazaka:max0011@cluster0.jeztvrr.mongodb.net/mazakaBD?retryWrites=true&w=majority',
    )
    .then(() => {
        console.log('Connect');
    })
    .catch((err) => console.error('DB error', err));

//вся логика express в app
const app = express();
const PORT = process.env.PORT || 4444;

const storage = multer.diskStorage({
    //1 Когда происходит загрузка файла, возвращает путь файла
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    //2 перед сохраниением файла, объясняем как назвать файл
    filename: (_, file, cb) => {
        console.log('file_multer: ', file);
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

//Когда придет запрос на /uploads - тогда идем в папку uploads и ищем там файл
app.use('/uploads', express.static('uploads'));
app.use(cors());

//* читаем json запросы которые приходят через post (req.body)
app.use(express.json());

//! морган позволяет делать логирование внутри консоли - пишет какие запросы ушли, пришли и тд       (чтобы видели что приходит)
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//single - позволяет загружать один файл изображения (image) на сервер при отправке запроса (ждет файл image с картинкой).
app.post('/upload', upload.single('image'), (req, res) => {
    //multer - когда файл загружается парсит данные и сохраняет загруженный файл в объекте req.file
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});
// Запрос на регистрацию -> валидация(проверка) -> выполнение (req,res) => { }
app.post('/auth/register', registerValidation, handleValidateErrors, UserController.register);
app.post('/auth/login', loginValidation, handleValidateErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/posts/popular', PostController.popularPosts);
app.get('/posts/new', PostController.getNewPosts);

app.get('/tags', PostController.getTags);
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidateErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
    '/posts/:id',
    checkAuth,
    postCreateValidation,
    handleValidateErrors,
    PostController.update,
);

app.listen(PORT, (err) => {
    if (err) {
        return console.error(err);
    }
    console.log(`http://localhost:${PORT}`.blue.bold);
});

//
