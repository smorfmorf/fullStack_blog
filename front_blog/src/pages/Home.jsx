import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';

import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { fetchPosts, fetchTags } from '../redux/postsSlice';
import { TextField } from '@mui/material';
import { X } from 'lucide-react';
import Sort from '../Sort.tsx';
import { Navigate } from 'react-router-dom';
import { selectAuth } from '../redux/authSlice.js';

export const Home = () => {
    const dispatch = useDispatch();
    const isAuth = useSelector(selectAuth);
    const userData = useSelector((state) => state.auth.data);
    console.log('userData: ', userData);

    const [searchValue, setSearchValue] = React.useState('');
    const [activeTab, setActiveTab] = React.useState(0);

    const { posts, tags } = useSelector((state) => state.posts);

    const isPostsLoading = posts.status === 'loading ' || posts.status === 'error';
    const isTagsLoading = tags.status === 'loading' || tags.status === 'error';

    // получаем все статьи чтобы всегда получать актуальные.
    React.useEffect(() => {
        dispatch(fetchPosts());
        dispatch(fetchTags());
    }, [activeTab]);

    // реализация поиска статьи локально
    const filterPosts = posts.items.filter((el) =>
        el.title.toLowerCase().includes(searchValue.toLowerCase()),
    );

    // Если нет токена и не авторизован - перенаправляем на логин
    // (запрос идет но на момент рендера isAuth еще нету)
    if (!window.localStorage.getItem('token') && !isAuth) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            <Sort />
            <div className="relative">
                <TextField
                    placeholder="Поиск..."
                    variant="filled"
                    fullWidth
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <X
                    onClick={() => setSearchValue('')}
                    className="absolute top-4 right-1 cursor-pointer opacity-60 hover:opacity-100 transition"
                />
            </div>
            <Tabs style={{ marginBottom: 15 }} value={activeTab} aria-label="basic tabs example">
                <Tab
                    label="Все"
                    onClick={() => {
                        setActiveTab(0);
                    }}
                />
                <Tab
                    label="Новые"
                    onClick={() => {
                        setActiveTab(1);
                    }}
                />
                <Tab
                    label="Популярные"
                    onClick={() => {
                        setActiveTab(2);
                    }}
                />
            </Tabs>
            <Grid container spacing={4}>
                <Grid xs={8} item>
                    {(isPostsLoading ? [...Array(5)] : filterPosts).map((obj, index) =>
                        // если статьи загружаются рендерим скелетоны, иначе наши статьи (тк при загрузке изначально в obj будет undefined и выдаст ошибку)
                        isPostsLoading ? (
                            <Post key={index} isLoading={true} />
                        ) : (
                            <Post
                                key={obj._id}
                                id={obj._id}
                                title={obj.title}
                                imageUrl={
                                    obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''
                                }
                                user={obj.user}
                                createdAt={obj.createdAt}
                                viewsCount={obj.viewsCount}
                                commentsCount={3}
                                tags={obj.tags}
                                // имеем ли мы доступ к редактированию статьи или нет
                                // проверяем наш id и сравниваем с id в статьях чтобы мог редачить только кто создал ее
                                isEditable={userData?._id === obj.user._id || userData?.isAdmin}
                            />
                        ),
                    )}
                </Grid>
                <Grid xs={4} item>
                    <TagsBlock items={tags?.items} isLoading={isTagsLoading} />
                    <CommentsBlock
                        items={[
                            {
                                user: {
                                    fullName: 'Елена Аналова',
                                    avatarUrl: 'https://mui.com/static/images/avatar/3.jpg',
                                },
                                text: 'Это тестовый комментарий',
                            },
                            {
                                user: {
                                    fullName: 'Мария Иванова',
                                    avatarUrl: 'https://mui.com/static/images/avatar/4.jpg',
                                },
                                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
                            },
                        ]}
                        isLoading={false}
                    />
                </Grid>
            </Grid>
        </>
    );
};
