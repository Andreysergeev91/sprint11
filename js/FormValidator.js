export default class FormValidator {
    constructor(form) {
        this.form = form;
        this.form.addEventListener('input', () => {
            this.setEventListeners();
        });
    }

    words = {
        validationLenght: 'Должно быть от 2 до 30 символов',
        urlValidation: 'Здесь должна быть ссылка'

    };

    checkInputValidity(input, errorElement) {
        const {
            validationLenght
        } = this.words;
        const {
            urlValidation
        } = this.words;

        if (input.validity.valueMissing) {
            errorElement.classList.add("error-message_type_active");

            errorElement.textContent = validationLenght;
            return
        }
        if (input.validity.tooShort) {
            errorElement.textContent = validationLenght;
            errorElement.classList.add("error-message_type_active");
            return
        }
        if (input.value.length >= 30 && !(input.type === "url")) {
            errorElement.textContent = validationLenght;
            errorElement.classList.add("error-message_type_active");
            return
        }
        if (input.validity.typeMismatch) {
            errorElement.textContent = urlValidation;
            errorElement.classList.add("error-message_type_active");
            return
        } else {
            errorElement.classList.remove("error-message_type_active");

        }

    }

    setSubmitButtonState() {
        const inputone = this.form.querySelector('input:first-of-type');
        const inputtwo = this.form.querySelector('input:last-of-type');
        const button = this.form.querySelector('button');

        if (inputone.validity.valueMissing || inputone.validity.tooShort || inputone.value.length > 30) {
            button.setAttribute('disabled', true);
            button.classList.add("button-inactive");
            return
        }
        if (inputtwo.validity.valueMissing || inputtwo.validity.tooShort || inputtwo.value.length > 30 && !(inputtwo.type === "url")) {
            button.setAttribute('disabled', true);
            button.classList.add("button-inactive");
            return
        }
        if (inputtwo.validity.typeMismatch) {
            button.setAttribute('disabled', true);
            button.classList.add("button-inactive");
            return
        } else {
            button.removeAttribute('disabled');
            button.classList.remove("button-inactive");
        }
    }


    setEventListeners() {
        this.checkInputValidity(this.form.querySelector('input:first-of-type'), this.form.querySelector('p:first-of-type'))
        this.checkInputValidity(this.form.querySelector('input:last-of-type'), this.form.querySelector('p:last-of-type'))
        this.setSubmitButtonState();
    }
}