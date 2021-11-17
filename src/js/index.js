import "../pages/index.css";
import Card from "./Сard";
import CardList from "./СardList";
import Api from "./api";
import FormValidator from "./FormValidator";
import Popup from "./Popup";
import UserInfo from "./UserInfo";

const placesList = document.querySelector('.places-list');
const popupAddForm = document.querySelector('.popup__form_type_add-card');
const popupAddCard = new Popup(document.querySelector('.popup_type_add-card'));
const popupEdit = new Popup(document.querySelector('.popup_type_edit'));
const userInfo = new UserInfo(document.querySelector('.user-info__name'), document.querySelector('.user-info__job'), document.querySelector('.user-info__photo'));
const formEditValidation = new FormValidator(popupEdit.popupElement.querySelector('.popup__form_type_edit'));
const formAddCardvalidation = new FormValidator(popupAddForm);
const isDev = NODE_ENV === 'development';


const buttonAdd = document.querySelector('.user-info__button');

const buttonEdit = document.querySelector('.button-edit');

function openImageCallback(event) {
    if (event.target.classList.contains('place-card__image')) {
        const clonePlaceCard = event.target.parentNode.cloneNode(true);
        const imagePopup = clonePlaceCard.querySelector('.place-card__image');
        const imagePopupClose = document.createElement('button');
        clonePlaceCard.removeChild(clonePlaceCard.lastChild);
        clonePlaceCard.classList.toggle('place-card-opened');
        imagePopup.classList.remove('place-card__image');
        imagePopup.classList.add('place-card-opened__image');
        imagePopup.appendChild(imagePopupClose);
        imagePopupClose.classList.add('place-card-opened__delete-icon');
        imagePopupClose.classList.add('place-card__delete-icon');
        document.querySelector('.places-list').appendChild(clonePlaceCard);
        clonePlaceCard.querySelector('.place-card__delete-icon').addEventListener('click', () => {
            clonePlaceCard.parentNode.removeChild(clonePlaceCard);
        });
    }
}

const api = new Api(isDev ? 'http://nomoreparties.co/cohort9' : 'https://nomoreparties.co/cohort9', {

    headers: {
        authorization: '2d226d6f-a322-47bc-a2db-869e1d9f78b6',
        'Content-Type': 'application/json'
    }
});

/*
    Можно лучше: не обязательно передавать apiElement, внутри функции api возьмется из внешней области видимости
    const createCardElement = (cardData) => {
        return new Card(cardData, openImageCallback, api);
    };

    а чтобы не хардкодить owner в классе Card можно сделать так:
    let owner = undefined;   //объявляем глобальную переменную, в неё запишем id когда получим его с сервера

    const createCardElement = (cardData) => { 
        return new Card(cardData, openImageCallback, api, owner); // <= передаем owner в конструктор Card
    };

    //ниже когда мы делаем 
    Promise.all([
        api.getUserInformation(),
        api.getInitialCards()
    ])
    .then((values) => {
        const [userData, initialCards] = values;
        owner = userData._id;            // <= записываем id в переменную owner которая будет 
                                         // использоваться при создании карточки и передаваться в её конструктор
                                         // Обратить внимание - значение в переменную owner нужно записать до вызова отрисовки карточек
        cards.render(initialCards);      // отрисовываем карточки, при вызове их создании им будет передаваться id пользователя который получен


    Получилось немного сложно, но даже так решение не самое изящное т.к. для передачи значения используется глобальная переменная
    Более лучшим решением было бы передавать все полученные данные пользователя в класс UserInfo, в классе UserInfo
    сделать метод getUserInfo который возвращает данные пользователя и уже этот метод как колбэк передавать в конструктор
    класса Card. В классе Card при отрисовке данных пользователя вызывается переданный ему колбэк и по полученным от него данным проверяется
    принадлежит ли карточка текущему пользователю.
*/

const
    createCardElement = (cardData, apiElement = api) => {
        return new Card(cardData, openImageCallback, apiElement);
    };

const cards = new CardList(placesList, createCardElement);

Promise.all([
        api.getUserInformation(),
        api.getInitialCards()
    ])
    .then((values) => {
        const [userData, initialCards] = values;
        cards.render(initialCards);
        userInfo.setUserInfo(userData.name, userData.about, userData.avatar);
        userInfo.updateUserInfo();
    })
    .catch((err) => {
        console.log(err);
    });


buttonAdd.addEventListener('click', function (event) {
    const {
        popupElement
    } = popupAddCard;
    popupAddCard.show(event, popupElement);
})



popupAddForm.addEventListener('submit', function () {
    event.preventDefault();
    api.addNewCard(document.forms.new.elements.name.value, document.forms.new.elements.link.value).then((res) => {
        /*
            Можно лучше: в метод addUserCard лучше передавать весь объект карточки целиком, а не отдельные параметры
        */
        cards.addUserCard(res.name, res.link, res.likes.length, res.owner._id, res._id);
        document.forms.new.reset();
        popupAddCard.popupElement.classList.toggle('popup_is-opened');
        popupAddForm.querySelector('button').setAttribute('disabled', true);
        popupAddForm.querySelector('button').classList.add("button-inactive");

    }).catch((err) => console.log(err));
});

buttonEdit.addEventListener('click', function () {
    const {
        popupElement
    } = popupEdit;
    popupEdit.show(event, popupElement);
})

document.querySelector('.popup__form_type_edit').addEventListener('submit', (event) => {
    event.preventDefault();

    const userData = {
        name: document.forms.edit.elements.user.value,
        about: document.forms.edit.elements.about.value
    };


    api.editUserInformation(userData.name, userData.about).then((res) => {
        /*
            Можно лучше: в метод setUserInfo лучше передавать весь объект целиком, а не отдельные параметры
        */
        userInfo.setUserInfo(res.name, res.about, res.avatar);
        userInfo.updateUserInfo();
        event.target.closest(".popup").classList.remove('popup_is-opened');
    }).catch((err) => console.log(err));
});




/*
    Ревью по 9 работе:
    Класс Api создан и необходимые запросы к серверу выполняются. Отлично, что класс Api только возвращает
    промисы с данными и сам не изменяет страницу

    Надо исправить: 
    - при вызове метод editUserInformation не хватает обработки ошибок  // Выполнено
    - по запросам editUserInformation и addNewCard - все изменения на странице должны происходить, только после того, как
   сервер ответил подтверждением, в том числе и закрытие попапа, т.к. если он закроется, то пользователь может решить, что данные сохранились  // Выполнено


    Можно лучше:
    - проверка ответа сервера и преобразование из json
    дублируется во всех методах класса Api, лучше вынести в отдельный метод // Выполнено

    - не нужно передавать в каждый метод url.  Базовый адрес сайта "https://praktikum.tk/cohort9" 
    должен передаваться в конструктор - constructor(baseUrl, options), а в методах                       // Выполнено
    к нему добавляется адрес ендпоинта

    - отрисовывать карточки только после получения данных пользователя, для этого можно применить Promise.all  // Выполнено

    Подсказка как реализовать удаление карточки:
    1. Сделать, чтобы в функции createCardElement также при создании карточки передавался экземпляр
    класса Api
    2. в классе Card в методе  remove вызывать метод класса Api для удаления карточки, не забудте, что со страницы
    она должна удалиться только после ответа сервера

*/

/*
    Отлично, все критические замечания исправлены

    Основное оставшееся проблемное место осталось - id пользователя захардкожен в классе Card.
    Его нужно передавать в конструктор карточки, как это сделать описал выше.

    Так же в карточку данные лучше передавать не через метод create, а через её конструктор
    как это исправить описал в классе CardList

    Приношу извинения, что с прошлым ревью произошла небольшая заминка - вместо отправки на доработку, нажал "принять"
*/






















/*
    Хорошая работа
    Рефакторинг выполнен, необходимые классы созданы и программа продолжает работать без ошибок
    Но есть несколько замечаний:

    Надо исправить: 
    - класс карточки должен отвечать только за саму карточку, 
    попап изображения это другая сущность в программе, поэтому нужно вынести
    открытие попапа, а классу Card передавать функцию которая умеет его открывать
    - метод addUserCard не должен быть обработчиком события и брать
    данные карточки из полей формы напрямую
    - класс CardList  жестко связан с классом Card т.к. самостоятельно создает его экземпляры
    Нужно передавать в конструктор класса CardList функцию, которая умеет создавать экземпляры необходимых
    классов, или передавать уже созданные карточки
    - метод render класса CardList должен использовать метод addUserCard для добавления карточек 
    - popupElement передается в конструктор класса Popup, не нужно передавать его в методы
    снова, доступ к свойству класса осуществляется через ключевое слово this
    - т.к. метод show close класса Popup именно открывает попап
     нужно именно добавлять или удалять класс , а не делать toggle
    - класс UserInfo должен отвечать только за отображение информации в шапке, но не за
    навешивание обработчика на форму 
    - в классе UserInfo в метод передавать данные пользователя как параметры setUserInfo (лучше ввиде обектта с полями name about)
    данные не должны браться напрямую из формы, а метод updateUserInfo отображает эти данные
    - когда код расположен в разных файлах, его нужно 
        заключать в модули, т.к. если файлов будет много, то в разных 
        файлах могут появится функции или переменные с одинаковыми именами,
        они будут переопределять друг друга. Модуль должен предоставлять
        наружу только минимально необходимый api
        Для создании модулей можно воспользоваться IIFE, подробнее:
        https://learn.javascript.ru/closures-module
        https://habr.com/ru/company/ruvds/blog/419997/ 
        Нужно обернуть в модули как минимум содержимое файлов initialCards.js и script.js

    Можно лучше:
    - в конструктор карточки лучше передавать не отдельные параметры, а сразу весь объект 
    - переданные данные в класс карточки лучше запомнить в свойство класса, чтобы использовать их методах 
    - не вызывать методы класса в конструкторе, только инициализация полей
    - навешивание обработчиков событий лучше вынести в отдельный метод и вызывать его в методе create
    - лучше привязать контекст обработчиков событий к контексту. Привязка контекста очень важная тема.
    Нужно обязательно её понимать и уметь применять на практике. Здорово будет если Вы потренируетесь 
    на примере класса Card
    -  массив initialCardsArray лучше передавать не в конструктор, а в метод render
    - у каждого попапа есть кнопка закрытия, можно повесть на неё обработчик здесь в классе Popup
    - методы класса Popup также привязать к контексту через bind
*/


/*
    Отлично, часть замечаний исправлена и код стал гораздо лучше, но осталось ещё несколько

    Надо исправить:
    - когда код расположен в разных файлах, его нужно 
    заключать в модули, т.к. если файлов будет много, то в разных 
    файлах могут появится функции или переменные с одинаковыми именами,
    они будут переопределять друг друга. Модуль должен предоставлять
    наружу только минимально необходимый api
    Для создании модулей можно воспользоваться IIFE, подробнее:
    https://learn.javascript.ru/closures-module
    https://habr.com/ru/company/ruvds/blog/419997/ 
    Нужно обернуть в модули как минимум содержимое файла script.js
    Это не позволит использовать глобальные переменные внутри классов и заставит передавать все явно в конструктор

    - т.к. при исправлении предыдущего замечания нельзя будет обратиться внутри классов
    к объявленным в script.js переменным, то функцию openImageCallback нужно явно передать в конструктор
    при создании экземпляров класса Card

    - в метод setUserInfo передавать данные, а не брать их из формы напрямую в setUserInfo

    Можно лучше: 
    - в конструктор карточки лучше передавать не отдельные параметры, а сразу весь объект
    - переданные в класс данные лучше запомнить в полях Card и использовать их в методе create, а не передавать
    данные ещё раз
    - showPopupImage также привязать к классу через bind, а в функцию openImageCallback передавать
    не событие, а ссылку на изображение
    - в конструктор UserInfo передаются элементы, лучше так же запомнить
    их, чтобы не передавать их дополнительно в метод updateUserInfo

*/

/*
    Осталось последнее замечание

    Надо исправить:
    - метод setUserInfo все ещё берет данные из элементов которые переданы, а нужно
    в метод setUserInfo передавать сами данные , а не элементы из которых они берутся
*/

/*
    Отлично, критические замечания исправлены

    Вот пара ссылок, если захотите углубится в тему ООП:
    - принципы SOLID применяемые для проектирования ООП программ https://ota-solid.now.sh/ ,
    - паттерны проектирования https://refactoring.guru/ru/design-patterns и там же хорошо
    про рефакторинг https://refactoring.guru/ru/refactoring

    Успехов в дальнейшем обучении!
*/
