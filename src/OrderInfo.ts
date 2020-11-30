class OrderInfo {
    private name: string | null = null;
    private userName: string | null = null;
    private subject: ISubject | null = null;
    private url: string | null = null;
    private phone: string | null = null;
    private email: string | null = null;
    private contactOption: 'Телефон' | 'Почта' | null = null;
    private date: string | null = null;
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

    getUrl = () => {
        return this.url;
    }

    getPhone = () => {
        return this.phone;
    }

    getEmail = () => {
        return this.email;
    }

    getContactOption = () => {
        return this.contactOption;
    }

    getDate = () => {
        return this.date;
    }

    getComment = () => {
        return this.comment;
    }

    getReceipt = () => {
        const userName = this.getUserName() === '*Юзернейм не указан*' ? this.getUserName() : '@' + this.getUserName();
        return `Имя: *${this.getName()}* \nЮзернейм: ${userName} \nПредмет: *${this.getSubject()?.name}* \nЦена: *${this.getSubject()?.price}* \n` +
            `Телефон: *${this.getPhone()}* \nПочта: *${this.getEmail()}* \nКак связаться: *${this.getContactOption()}* \n` +
            `Дата сдачи: *${this.getDate()}* \nКомментарий: *${this.getComment()}*`;
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

    setPhone = (phone: string) => {
        this.phone = phone;
    }

    setEmail = (email: string) => {
        this.email = email;
    }

    setContactOption = (contactOption: 'Телефон' | 'Почта') => {
        this.contactOption = contactOption;
    }

    setDate = (date: string) => {
        this.date = date;
    }

    setComment = (comment: string) => {
        this.comment = comment;
    }

}

export default OrderInfo;