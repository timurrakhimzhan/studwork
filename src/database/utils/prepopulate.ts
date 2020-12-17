import ContactOptions from "../entities/ContactOptions";
import {getConnection} from "typeorm";
import Status from "../entities/Status";

export async function prepopulateContactOptions() {
    return getConnection().createQueryBuilder()
        .insert().into(ContactOptions).values([
            {name: 'Телефон'},
            {name: 'Почта'},
            {name: 'Этот Telegram аккаунт'}
        ]).execute();
}

export async function prepopulateStatuses() {
    return getConnection().createQueryBuilder()
        .insert().into(Status).values([
            {name: 'STATUS_NOT_PAYED'},
            {name: 'STATUS_PAYED'},
            {name: 'STATUS_FINISHED'}
        ]).execute();
}
