// с помощью createSlice создаем якобы редьюсер(slice),createAsyncThunk-для асинхроного запроса/экшена
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';
// 1 параметр - название экшена, далее нужно отправить этот запрос на бек (чтобы отправить асинхроный экшн - useDispatch())
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const { data } = await axios.get('/posts');

    return data;
});

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
    const { data } = await axios.get('/tags');

    return data;
});

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {
    const { data } = await axios.delete(`/posts/${id}`);

    return data;
});

const initialState = {
    posts: {
        items: [],
        status: 'loading',
    },
    tags: {
        items: [],
        status: 'loading',
    },
};

const postsSlice = createSlice({
    name: 'posts',
    initialState: initialState,

    // методы для обновления state
    reducers: {},

    // reduxToolkit - позволяет отловить состояние запроса pending и fulfilled и rejected (он делает запрос и говорит щас загрузка и загрузка завершилась, теперь эти действия нужно отловить в redux и их обновлять в нашем state)
    extraReducers:
        // в нем описываем состояние асинхроного экшена(запроса) => 3 Cценария:
        (builder) => {
            // получение статьей
            builder.addCase(fetchPosts.pending, (state, action) => {
                state.posts.items = [];
                state.posts.status = 'loading';
            });
            builder.addCase(fetchPosts.fulfilled, (state, action) => {
                console.log('action: ', action.payload);
                state.posts.items = action.payload;
                state.posts.status = 'loaded';
            });
            builder.addCase(fetchPosts.rejected, (state, action) => {
                console.log('action: ', action.payload);
                state.posts.items = [];
                state.posts.status = 'error';
            });
            // получение тегов
            builder.addCase(fetchTags.pending, (state, action) => {
                state.tags.items = [];
                state.tags.status = 'loading';
            });
            builder.addCase(fetchTags.fulfilled, (state, action) => {
                console.log('action: ', action.payload);
                state.tags.items = action.payload;
                state.tags.status = 'loaded';
            });
            builder.addCase(fetchTags.rejected, (state, action) => {
                console.log('action: ', action.payload);
                state.tags.items = [];
                state.tags.status = 'error';
            });
            // удаление статьи
            builder.addCase(fetchRemovePost.pending, (state, action) => {
                console.log('actionDelete: ', action);
                state.posts.items = state.posts.items.filter((obj) => obj._id !== action.meta.arg);
            });
        },
});

export const {} = postsSlice.actions;
export default postsSlice.reducer;
