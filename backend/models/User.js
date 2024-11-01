//!MVC - (M) это модель, создали модель - пользователя (User.js)

import mongoose from 'mongoose';

//*делаем схему - описываем все свойства юзера
//* в нашей таблицы мы описываем поля
const UserScheme = new mongoose.Schema(
    {
        fullName: {
            type: String,
            requierd: true,
        },
        email: {
            type: String,
            requierd: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            requierd: true,
        },
        //? если не обязательно передаем просто тип, без объекта
        avatarUrl: String,
    },
    //?При создании любой сущности, должны быть создание дата и обновление
    //Схема автоматические - при создании любого юзера должна прикрутить дату создания и обновление этой сущности.
    {
        timestamps: true,
    },
);
export default mongoose.model('User', UserScheme);
