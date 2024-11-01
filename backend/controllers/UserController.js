import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';

export const register = async (req, res) => {
    try {
        const password = req.body.password;
        //шифруем пароль, salt-(соль алгоритм шифрования пароля)
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        //Создаем пользователя (документ) с помощью MongoDB,                                         в который через POST передаем параметры.
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        //создаем пользователя в MongoDB - сохраняем документ
        const user = await doc.save();

        //создаем токен если у пользователя есть такой id этого хватит, чтобы работать с проверкой авторизован, кто это и тд.
        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret',
            { expiresIn: '30d' },
        );

        //деструктурируем пароль: чтобы его не отправлять, а пользователя получаем из документа,    тк в user лежит всякие поля от MongoDB.
        const { passwordHash, ...userData } = user._doc;

        res.json({ ...userData, token });
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'Ошибка регистрации' });
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(404).json({
                message: 'Неверный логин или пароль',
            });
        }
        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret',
            { expiresIn: '30d' },
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({ ...userData, token });
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'Не удалось авторизироваться' });
    }
};

export const getMe = async (req, res) => {
    try {
        //ищем в БД пользователя по id
        const user = await UserModel.findById(req.userId);
        console.log('user: ', user);

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const { passwordHash, ...userData } = user._doc;

        res.json(userData);
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'Нет доступа' });
    }
};

//
