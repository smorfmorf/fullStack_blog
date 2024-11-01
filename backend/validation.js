import { body } from 'express-validator';

export const registerValidation = [
    // если в нашем поле будет email тогда пускаем
    body('email', 'неверный формат почты').isEmail(),
    body('password', 'пароль должен быть больше 5 символов').isLength({ min: 5 }),
    body('fullName', 'укажите имя').isLength({ min: 3 }),
    // если запрос придет без аватарки ничего страшного, а если придет проверь является ссылкой или нет.
    body('avatarUrl', 'неверная ссылка на аватарку').optional().isURL(),
];

export const loginValidation = [
    body('email', 'неверный формат почты').isEmail(),
    body('password', 'пароль должен быть больше 5 символов').isLength({ min: 5 }),
];

//валидация на создания статьи
export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 5 }).isString(),
    body('tags', 'Неверный формат тэгов (укажите массив)').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];
