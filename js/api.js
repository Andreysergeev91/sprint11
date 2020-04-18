export default class Api {
    constructor(baseUrl, options) {
        this.options = options;
        this.baseUrl = baseUrl;
    }

    _getResponseData(res) {
        if (!res.ok) {
            return Promise.reject(`Ошибка: ${res.status}`);
        }
        return res.json();
    }

    getInitialCards() {
        return fetch(`${this.baseUrl}/cards`, {
                'headers': this.options.headers
            })
            .then(res => {
                return this._getResponseData(res);
            })
    }

    getUserInformation() {
        return fetch(`${this.baseUrl}/users/me`, {
                'headers': {
                    authorization: this.options.headers.authorization
                }
            })
            .then(res => {
                return this._getResponseData(res);
            });

    }

    editUserInformation(name, about) {
        return fetch(`${this.baseUrl}/users/me`, {
                'method': 'PATCH',
                'headers': this.options.headers,
                body: JSON.stringify({
                    'name': name,
                    'about': about,
                })
            })
            .then(res => {
                return this._getResponseData(res);
            });

    }

    addNewCard(name, link) {
        return fetch(`${this.baseUrl}/cards`, {
                'method': 'POST',
                'headers': this.options.headers,
                body: JSON.stringify({
                    'name': name,
                    'link': link,
                })
            })
            .then(res => {
                return this._getResponseData(res);
            });

    }

    deleteCard(cardId) { 
         return fetch(`${this.baseUrl}/cards/${cardId}`, {
             'method': 'DELETE',
             'headers': this.options.headers,
         });
     }
}