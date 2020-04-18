export default class Popup {
    constructor(popupElement) {
        this.popupElement = popupElement;
        this.close = this.close.bind(this);
        this.popupElement.querySelector('.popup__close').addEventListener('click', this.close);
    }

    show(event) {
        if (event.target.classList.contains('button')) {
            this.popupElement.classList.add('popup_is-opened');
        }
    }

    close(event) {
        if (event.target.classList.contains('popup__close')) {
            this.popupElement.classList.remove('popup_is-opened');
        }
    }
}