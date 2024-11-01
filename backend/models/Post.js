import mongoose from 'mongoose';
const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            requierd: true,
        },
        text: {
            type: String,
            requierd: true,
            unique: true,
        },
        tags: {
            type: Array,
            default: [],
        },
        viewsCount: {
            type: Number,
            default: 0,
        },
        //* Связь между двумя таблицами
        //Автор статьи будет ссылаться на модель User.                     (Если захочу в будущем сказать что нужен пользователь: то ты должен по id ссылаемся на модель User и оттуда вытаскиваем пользователя)
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        //? необязательное поле
        imageUrl: String,
    },

    //Схема автоматические - при создании любой сущности,               должна прикрутить Дату создания и обновление
    {
        timestamps: true,
    },
);
export default mongoose.model('Post', PostSchema);

//
