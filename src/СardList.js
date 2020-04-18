export default class CardList {
    constructor(container, createCard) {
        this.container = container;
        this.createCard = createCard;
    }

    addUserCard(name, link, arrLength, owner, cardId) {

        /*
            Можно лучше: в классе Card в конструкторе ожидается получение данныех карточки,
            сейчас же они не передаются в конструктор, а передаются через метод create
            Так что лучше сделать так:

            const cardData = {                      //cardData - данные карточки которые передадутся в её конструктор
                name, 
                link, 
                arrLength, 
                owner, 
                cardId
            }

            const card = this.createCard(cardData);  //создали карточку передавая ей в конструктор данные
            const cardElement = card.create();       //создали DOM элемент карточки
            this.container.appendChild(cardElement); //добавили её в контейнер
        
        */

        const card = this.createCard().create(name, link, arrLength, owner, cardId);
        this.container.appendChild(card);
    }

    render(initialCardsArray) {
        initialCardsArray.forEach((item) => {
            this.addUserCard(item.name, item.link, item.likes.length, item.owner._id, item._id);
        });
    }
}