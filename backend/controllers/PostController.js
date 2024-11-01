import PostModel from '../models/Post.js';

export const popularPosts = async (req, res) => {
    //.sort({ viewsCount: -1 }): сортирует найденные документы по полю viewsCount от наибольшего к наименьшему
    const posts = await PostModel.find().sort({ viewsCount: -1 }).limit(5);
    return res.json(posts);
};

export const getNewPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().sort({ createdAt: -1 }).limit(5);
        return res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(404).send('Ошибка');
    }
};

export const getTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5);
        console.log('posts: ', posts);

        const tags = posts
            .map((obj) => obj.tags)
            .flat() // разворачивает Двумерный массив в одномерный [1, [2,3]] -> [1,2,3]
            .slice(0, 5); // срез массива до 5 элементов

        res.json(tags);
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'Не удалось получить посты' });
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user');
        res.json(posts.reverse());
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'Не удалось получить статьи' });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            //2ой параметр что хотим обновить (увеличить просмотры)
            {
                $inc: { viewsCount: 1 },
            },
            // параметр для возврата обновленного документа
            { new: true },
        ).populate('user'); // возвращаем всего пользователя, а не только его id

        // если документ не найден
        if (!doc) {
            return res.status(404).json({ message: 'Статья не найдена' });
        }
        res.json(doc);
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'Не удалось получить статьи' });
    }
};

// роунт на создании документа
export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'Не удалось создать статью' });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await PostModel.findOneAndDelete({
            _id: postId,
        });

        if (!post) {
            return res.status(404).json({ message: 'Статья не найдена' });
        }

        res.json({ success: true });
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'Не удалось удалить статью' });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags.split(','),
            },
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'Не удалось обновить статью' });
    }
};

//
