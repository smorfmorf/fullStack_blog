// создаем middleware на проверку валидации
import { validationResult } from 'express-validator';

export default (req, res, next) => {
    //! проверяем есть ли ошибки в валидаторе (в запросе)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    //* если ошибок нету тогда работаем дальше(к след функции):
    next();
};

//
