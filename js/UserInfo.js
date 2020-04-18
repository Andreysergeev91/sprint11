export default class UserInfo {
    constructor(name, job, avatar) {

        /*
            Можно лучше: в конструктор UserInfo передаются элементы, лучше так же запомнить
            их, чтобы не передавать их дополнительно в метод updateUserInfo

            this.nameElement = name;
            this.jobElement = job;
        
            тогда в метод updateUserInfo передавать ничего оне придется
            updateUserInfo() {
                this.nameElement.textContent = this.name;
                this.jobElement.textContent = this.job;

            }
        */

        this.nameElement = name;
        this.jobElement = job;
        this.avatarElement = avatar;
    }

    setUserInfo(user, about, avatar) {
        this.name = user;
        this.job = about;
        this.avatar=avatar;
    }

    updateUserInfo() {
        this.nameElement.textContent = this.name;
        this.jobElement.textContent = this.job;
        this.avatarElement.style.backgroundImage=`url(${this.avatar})`;

    }
}