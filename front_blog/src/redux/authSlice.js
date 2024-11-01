// с помощью createSlice создаем якобы редьюсер(slice),createAsyncThunk-для асинхроного запроса/экшена
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// делаем авторизацию, инф о пользоватеел получаем из асинхроного экшена
// логинимся, передаем email и пароль (params) в бэк
export const fetchLogin = createAsyncThunk('auth/fetchLogin', async (params) => {
    console.log('params: ', params);
    const { data } = await axios.post('/auth/login', params);
    return data;
});

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
    // наш axios вытащит из localStorage токен и его передаст
    const { data } = await axios.get('/auth/me');
    return data;
});

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
    const { data } = await axios.post('/auth/register', params);
    return data;
});

const initialState = {
    data: null,
    status: 'loading',
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        logout(state, action) {
            state.data = null;
        },
    },
    // reduxToolkit - позволяет отловить состояние запроса pending и fulfilled и rejected (он делает запрос и говорит щас загрузка и загрузка завершилась, теперь эти действия нужно отловить в redux и их обновлять в нашем state)
    extraReducers:
        // в нем описываем состояние асинхроного экшена(запроса) => 3 Cценария:

        (builder) => {
            builder.addCase(fetchLogin.pending, (state, action) => {
                state.data = null;
                state.status = 'loading';
            });
            builder.addCase(fetchLogin.fulfilled, (state, action) => {
                console.log('action: ', action.payload);
                state.data = action.payload;
                state.status = 'loaded';
            });
            builder.addCase(fetchLogin.rejected, (state, action) => {
                console.log('action: ', action.payload);
                state.data = null;
                state.status = 'error';
            });

            builder.addCase(fetchAuthMe.pending, (state, action) => {
                state.data = null;
                state.status = 'loading';
            });
            builder.addCase(fetchAuthMe.fulfilled, (state, action) => {
                console.log('action: ', action.payload);
                state.data = action.payload;
                state.status = 'loaded';
            });
            builder.addCase(fetchAuthMe.rejected, (state, action) => {
                console.log('action: ', action.payload);
                state.data = null;
                state.status = 'error';
            });

            builder.addCase(fetchRegister.pending, (state, action) => {
                state.data = null;
                state.status = 'loading';
            });
            builder.addCase(fetchRegister.fulfilled, (state, action) => {
                console.log('action: ', action.payload);
                state.data = action.payload;
                state.status = 'loaded';
            });
            builder.addCase(fetchRegister.rejected, (state, action) => {
                console.log('action: ', action.payload);
                state.data = null;
                state.status = 'error';
            });
        },
});

// slice
export const selectAuth = (state) => state.auth.data;

export const { logout } = authSlice.actions;
export default authSlice.reducer;
