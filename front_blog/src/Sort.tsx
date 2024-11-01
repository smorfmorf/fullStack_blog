//@ts-nocheck
import React from 'react';
export enum SortProperyEnum {
    RATING_DESC = 'rating',
    RATING_ASC = '-rating',
    TITLE_DESC = 'title',
    TITLE_ASC = '-title',
    PRICE_DESC = 'price',
    PRICE_ASC = '-price',
}
type SortItem = {
    name: string;
    sortProperty: SortProperyEnum;
};

// Делаем согласованость чтобы были в списке Компонента Sort одинаковые значение сортировки и в Redux.
export const list: SortItem[] = [
    { name: 'популярности (DESC)', sortProperty: SortProperyEnum.RATING_DESC },
    { name: 'популярности  (ASC)', sortProperty: SortProperyEnum.RATING_ASC },
    { name: 'цене (DESC)', sortProperty: SortProperyEnum.PRICE_DESC },
    { name: 'цене (ASC)', sortProperty: SortProperyEnum.PRICE_ASC },
    { name: 'алфавиту (DESC)', sortProperty: SortProperyEnum.TITLE_DESC },
    { name: 'алфавиту (ASC)', sortProperty: SortProperyEnum.TITLE_ASC },
];
function Sort() {
    const [user, setUser] = React.useState();
    const [open, setOpen] = React.useState(true); //pop-up открыт
    const sortRef = React.useRef<HTMLDivElement>(null);

    const [sortType, setSortType] = React.useState({
        name: 'популярности',
        sortProperty: SortProperyEnum.PRICE_DESC, //price
    });
    console.log('sortType: ', sortType);

    const onClickListItem = (obj: SortItem) => {
        setSortType(obj);
        setOpen(false);
    };

    // При подписки на события: делаем какой-то addEventListener, и когда компонент размонтируется                   Cобытие останется и более того, когда мы вмонтируем этот компонент повторно будет подвешена новая слежка             (их станет две). Поэтому слежки нужно подчищать, когда компонент будет демонтирован.
    React.useEffect(() => {
        const handleClickOutSide = (event) => {
            console.log(event.composedPath());
            // если кликаем не на sortRef, то закрываем попап
            if (!event.composedPath().includes(sortRef.current)) {
                setOpen(false);
                console.log('click outside');
            }
        };

        document.body.addEventListener('click', handleClickOutSide);
        //returned function will be callden on component unmount
        return () => {
            console.log('Sort UnMount');
            document.body.removeEventListener('click', handleClickOutSide);
        };
    }, []);

    return (
        <div className="sort relative" ref={sortRef}>
            <div className="sort__label flex gap-1 ">
                <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M10 5C10 5.16927 9.93815 5.31576 9.81445 5.43945C9.69075 5.56315 9.54427 5.625 9.375 5.625H0.625C0.455729 5.625 0.309245 5.56315 0.185547 5.43945C0.061849 5.31576 0 5.16927 0 5C0 4.83073 0.061849 4.68424 0.185547 4.56055L4.56055 0.185547C4.68424 0.061849 4.83073 0 5 0C5.16927 0 5.31576 0.061849 5.43945 0.185547L9.81445 4.56055C9.93815 4.68424 10 4.83073 10 5Z"
                        fill="gray"
                    />
                </svg>
                <b className="cursor-default font-bold">Сортировка по:</b>
                <span onClick={() => setOpen(!open)} className="cursor-pointer text-orange-600">
                    {sortType.name}
                </span>
            </div>
            {open && (
                <div className="bg-white w-[260px] py-2 shadow-black shadow-md mt-4 absolute right-0 z-10 ">
                    <ul>
                        {list.map((obj, index) => (
                            <li
                                key={index}
                                onClick={() => onClickListItem(obj)}
                                className={`px-5 py-3 cursor-pointer hover:bg-[#fe5f1e0d] ${
                                    sortType.sortProperty === obj.sortProperty
                                        ? 'text-orange-600 bg-[#fe5f1e0d]'
                                        : ''
                                } `}>
                                {obj.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Sort;
