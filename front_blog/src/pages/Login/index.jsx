import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import styles from './Login.module.scss';

import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { fetchLogin, selectAuth } from '../../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';

export const Login = () => {
    const dispatch = useDispatch();

    const isAuth = useSelector(selectAuth);
    console.log('isAuth: ', isAuth);

    // register - регистрирует input поля
    // handleSubmit - выполняет функцию если валидация успешна
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            email: 'mmaxim0@mail.ru',
            password: '12345',
        },
        model: 'onChange',
    });

    // ! важно когда логинимся записываем токен в локалСтор чтобы потом передавать токен на сервер для авторизации через axios(в мидлеваре его)
    // будет выполняться в том случае если валидация прошла успешно
    async function onSubmit(data) {
        const res = await dispatch(fetchLogin(data));
        console.log('res: ', res);

        if (!res.payload) {
            throw new Error('Ошибка авторизации');
        }

        if ('token' in res.payload) {
            window.localStorage.setItem('token', res.payload.token);
        }
    }

    if (isAuth) {
        return <Navigate to={'/'} />;
    }
    return (
        <Paper classes={{ root: styles.root }}>
            <Typography classes={{ root: styles.title }} variant="h5">
                Вход в аккаунт
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    label="E-Mail"
                    // ? если email нету, то не нужно вытаскивать message - чтобы js ошибки не было
                    helperText={errors.email?.message}
                    error={Boolean(errors.email?.message)}
                    type="email" //браузерская валидация
                    fullWidth
                    {...register('email', { required: 'Укажите почту' })}
                />
                <TextField
                    className={styles.field}
                    helperText={errors.password?.message}
                    error={Boolean(errors.password?.message)}
                    label="Пароль"
                    type="password"
                    fullWidth
                    {...register('password', { required: 'Укажите пароль' })}
                />
                <Button type="submit" size="large" variant="contained" fullWidth>
                    Войти
                </Button>
            </form>
        </Paper>
    );
};
