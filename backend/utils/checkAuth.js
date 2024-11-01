import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    console.log('req.headers.authorization: ', req.headers.authorization);
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            // Если токен есть нужно расшифровываем его
            const decoded = jwt.verify(token, 'secret');

            //Расшифровали токен и вшиваем в req чтобы можно было вытащить id
            req.userId = decoded._id;

            next();
        } catch (err) {
            return res.status(403).json({
                message: 'Токен не расшифрован',
            });
        }
    } else {
        return res.status(403).json({
            message: 'Токена нету',
        });
    }
};

//
