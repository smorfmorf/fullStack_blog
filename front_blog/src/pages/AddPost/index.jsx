import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../redux/authSlice';
import axios from '../../axios';

export const AddPost = () => {
    const { id } = useParams();

    const navigate = useNavigate();
    const isAuth = useSelector(selectAuth);
    console.log('isAuth: ', isAuth);
    const [isLoading, setISLoading] = React.useState(false);

    const [imageUrl, setImageUrl] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [text, setText] = React.useState('');
    const [tags, setTags] = React.useState('');
    console.log('tags: ', tags);
    const inputFileRef = React.useRef(null);

    const isEditing = Boolean(id);
    React.useEffect(() => {
        if (id) {
            axios.get('/posts/' + id).then(({ data }) => {
                setTitle(data.title);
                setText(data.text);
                setImageUrl(data.imageUrl);
                setTags(data.tags.join(','));
            });
        }
    }, []);

    // передаем post на сервак
    async function onSumbit() {
        try {
            setISLoading(true); // загрузка отправки

            const fields = {
                title,
                text,
                imageUrl,
                tags,
            };

            //если создание стать то post, редакирование patch
            // const { data } = await axios.post('/posts', fields);

            const { data } = isEditing
                ? await axios.patch(`/posts/${id}`, fields)
                : await axios.post('/posts', fields);

            //если редактирование ответ с записью не вернется, если не редактирование то вернется ответ с записью и там вытаскиваем _id
            const _id = isEditing ? id : data._id;

            navigate(`/posts/${_id}`);
        } catch (err) {
            console.log(err);
        }
    }

    const handleChangeFile = async () => {
        try {
            // FormData - специальный формат который позволяет вшить картинку и отправлять ее на сервер
            const formData = new FormData();
            const file = inputFileRef.current.files[0];
            formData.append('image', file);
            const { data } = await axios.post('/upload', formData);

            setImageUrl(data.url);
        } catch (err) {
            alert('Ошибка загрузки файла!');
            console.warn(err);
        }
    };

    const onClickRemoveImage = () => {
        setImageUrl('');
    };

    const onChange = React.useCallback((value) => {
        setText(value);
    }, []);

    const options = React.useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '400px',
            autofocus: true,
            placeholder: 'Введите текст...',
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
            },
        }),
        [],
    );

    // если обновить выкидывает со страницы тк еще не атроризован поэтому проверяем токен (запрос идет но на момент рендера приложения еще не авторизован).
    if (!window.localStorage.getItem('token') && !isAuth) {
        return <Navigate to="/" />;
    }

    return (
        <Paper style={{ padding: 30 }}>
            <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
                Загрузить превью
            </Button>
            {/* на этот эл будем вешать обработчик событий */}
            <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />

            {imageUrl && (
                <>
                    <Button variant="contained" color="error" onClick={onClickRemoveImage}>
                        Удалить
                    </Button>
                    <img
                        className={styles.image}
                        src={`http://localhost:4444${imageUrl}`}
                        alt="Uploaded"
                    />
                </>
            )}

            <br />
            <br />
            <TextField
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                classes={{ root: styles.title }}
                variant="standard"
                placeholder="Заголовок статьи..."
                fullWidth
            />
            <TextField
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                classes={{ root: styles.tags }}
                variant="standard"
                placeholder="Тэги"
                fullWidth
            />
            <SimpleMDE
                className={styles.editor}
                value={text}
                onChange={onChange}
                options={options}
            />
            <div className={styles.buttons}>
                <Button onClick={onSumbit} size="large" variant="contained">
                    {isEditing ? 'Сохранить' : 'Опубликовать'}
                </Button>
                <Link to="/">
                    <Button size="lLinkrge">Отмена</Button>
                </Link>
            </div>
        </Paper>
    );
};
