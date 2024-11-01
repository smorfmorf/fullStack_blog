import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegister, selectAuth } from '../../redux/authSlice';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

export const Registration = () => {
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
            fullName: 'Maxim',
            email: 'mmmm0@mail.ru',
            password: '12345',
        },
        model: 'onChange',
    });

    // будет выполняться в том случае если валидация прошла успешно
    async function onSubmit(data) {
        const res = await dispatch(fetchRegister(data));

        if (!res.payload) {
            window.alert(`Ошибка регистрации ${res}`);
            throw new Error('Ошибка регистрации');
        }

        if ('token' in res.payload) {
            window.localStorage.setItem('token', res.payload.token);
        }
    }

    if (isAuth) {
        return <Navigate to={'/login'} />;
    }

    return (
        <Paper classes={{ root: styles.root }}>
            <Typography classes={{ root: styles.title }} variant="h5">
                Создание аккаунта
            </Typography>
            <div className={styles.avatar}>
                <Avatar sx={{ width: 100, height: 100 }} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    {...register('fullName', { required: 'Укажите полное имя' })}
                    helperText={errors.fullName?.message}
                    error={Boolean(errors.fullName?.message)}
                    className={styles.field}
                    label="Полное имя"
                    fullWidth
                />
                <TextField
                    {...register('email', { required: 'Укажите почту' })}
                    helperText={errors.email?.message}
                    error={Boolean(errors.email?.message)}
                    className={styles.field}
                    label="E-Mail"
                    fullWidth
                />
                <TextField
                    {...register('password', { required: 'Укажите пароль' })}
                    helperText={errors.password?.message}
                    error={Boolean(errors.password?.message)}
                    className={styles.field}
                    label="Пароль"
                    fullWidth
                />
                <Button
                    disabled={!isValid}
                    type="submit"
                    size="large"
                    variant="contained"
                    fullWidth>
                    Зарегистрироваться
                </Button>
            </form>
        </Paper>
    );
};
