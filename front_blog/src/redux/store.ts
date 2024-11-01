import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import posts from './postsSlice';
import auth from './authSlice';

// cоздаем хранилище redux
const store = configureStore({
    reducer: {
        posts,
        auth,
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
