class OrderInfo {
    private name: string | null = null;
    private userName: string | null = null;
    private subject: ISubject | null = null;
    private url: string | null = null;
    private topic: string | null = null;
    private phone: string | null = null;
    private email: string | null = null;
    private contactOption: 'Телефон' | 'Почта' | 'Telegram' | null = null;
    private date: string | null = null;
    private time: string | null = null;
    private comment: string | null = null;

    getName = () => {
        return this.name;
    }

    getUserName = () => {
        return this.userName;
    }

    getSubject = () => {
        return this.subject;
    }

    getUrl = () => this.url;

    getTopic = () => this.topic;

    getPhone = () => this.phone;

    getEmail = () => this.email;

    getContactOption = () => this.contactOption;

    getDate = () => this.date;

    getTime = () => this.time;

    getComment = () => this.comment;

    getReceipt = () => {
        const userName = this.getUserName() === '*Юзернейм не указан*' ? this.getUserName() : '@' + this.getUserName();
        return `Имя: *${this.getName()}* \nЮзернейм: ${userName} \nПредмет: *${this.getSubject()?.name}* \nЦена: *${this.getSubject()?.price}* \n` +
            `Тема работы: *${this.getTopic() || 'Тема не указана'}* \nТелефон: *${this.getPhone()}* \nПочта: *${this.getEmail()}* \n` +
            `Как связаться: *${this.getContactOption()}* \nДата сдачи: *${this.getDate()}* \nВремя: *${this.getTime()}* \nКомментарий: *${this.getComment()}*`;
    }

    setName = (name: string) => {
        this.name = name;
    }

    setUserName = (userName: string) => {
        this.userName = userName;
    }

    setSubject = (subject: ISubject) => {
        this.subject = subject;
    }

    setUrl = (url: string) => {
        this.url = url;
    }

    setTopic = (topic: string) => {
        this.topic = topic;
    }

    setPhone = (phone: string) => {
        this.phone = phone;
    }

    setEmail = (email: string) => {
        this.email = email;
    }

    setContactOption = (contactOption: 'Телефон' | 'Почта' | 'Telegram') => {
        this.contactOption = contactOption;
    }

    setDate = (date: string) => {
        this.date = date;
    }

    setTime = (time: string) => {
        this.time = time;
    }

    setComment = (comment: string) => {
        this.comment = comment;
    }

}

export default OrderInfo;