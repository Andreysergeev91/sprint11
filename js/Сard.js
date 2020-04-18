export default class Card {
    /*
        Можно лучше: owner также передать в конструктор
        constructor(cardData, openImageCallback, apiElement, owner) {
    */
    constructor(cardData, openImageCallback, apiElement) {
        this.cardData = cardData;

        /*
            Можно лучше: 
            - showPopupImage также привязать к классу через bind, а в функцию openImageCallback передавать
            не событие, а ссылку на изображение
        */
        this.like = this.like.bind(this);
        this.remove = this.remove.bind(this);
        this.openImageCallback = openImageCallback;
        this.apiElement = apiElement;
    }

    /* Можно лучше: в конструктор класса передаются данные карточки - cardData, передавать их отдельно в метод create не нужно
       В методе  create данные должны браться из this.cardData
    */
    create(name, link, arrLength, owner, cardId) {
        this.cardInfo = {
            name,
            link,
            arrLength,
            owner,
            cardId
        };
        const placeCard = document.createElement("div");
        placeCard.classList.add("place-card");
        placeCard.insertAdjacentHTML('beforeend', `
            <div class="place-card__image">
            <button class="place-card__delete-icon"></button>
            </div>
            <div class="place-card__description">
                <h3 class="place-card__name"></h3>
                <div class="place-card__like-container">
                <button class="place-card__like-icon"></button>
                <p class="place-card__like-counter"></p>
                </div>
            </div>`);
        placeCard.querySelector(".place-card__name").textContent = name;
        placeCard.querySelector(".place-card__image").style.backgroundImage = `url(${link})`;
        placeCard.querySelector(".place-card__like-counter").textContent = arrLength;
        /*
            Можно лучше: не нужно хардкодить id пользовавателя, нужно передать в конструктор id пользователя который
            который был получен с сервера
        */
        if (!(owner == '667509cf291e8fa0a1c09965')) {
            placeCard.querySelector('.place-card__image').removeChild(placeCard.querySelector('.place-card__delete-icon'));
        }
        this.setEventListeners(placeCard);

        return placeCard;
    }

    like() {
        if (event.target.classList.contains('place-card__like-icon')) {
            event.target.classList.toggle('place-card__like-icon_liked');
        }
    }

    remove() {
        const card = event.target.closest('.place-card');

        if (event.target.classList.contains('place-card__delete-icon')) {

            this.apiElement.deleteCard(this.cardInfo.cardId).then(() => {
                card.parentNode.removeChild(card);

            }).catch(err => console.log(err));

        }
    }

    showPopupImage() {
        this.openImageCallback(event);
    }

    setEventListeners(div) {
        div.querySelector('.place-card__like-icon').addEventListener('click', this.like);
        if (!!(div.querySelector('.place-card__delete-icon'))) {
            div.querySelector('.place-card__delete-icon').addEventListener('click', this.remove);
        }
        div.addEventListener('click', () => {
            this.showPopupImage();
        });
    }
}