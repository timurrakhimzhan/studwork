import Contact from "../models/Contact";
import ContactOption from "../models/ContactOption";
import Status, {statuses} from "../models/Status";
import Subject from "../models/Subject";
import WorkType from "../models/WorkType";
import SubjectWorkType from "../models/SubjectWorkType";
import Teacher from "../models/Teacher";
import FeedbackType, {feedbackTypes} from "../models/FeedbackType";
import {
    CALLBACK_EMAIL_OPTION,
    CALLBACK_PHONE_CALL,
    CALLBACK_PHONE_OPTION,
    CALLBACK_TELEGRAM_OPTION, URL_TELEGRAM, URL_WHATSAPP
} from "../../constants";

export default async function seed() {
    await Promise.all([
        fillContactOptions(),
        fillContacts(),
        fillStatuses(),
        fillFeedbackTypes(),
        fillMockSubjectWorkTypes(),
    ])
    await fillTeachers();
}

export async function fillContactOptions() {
    const contactOptionsCount = await ContactOption.count();
    if(!contactOptionsCount) {
        return ContactOption.bulkCreate([
            {name: 'Телефон', callback: CALLBACK_PHONE_OPTION},
            {name: 'Почта', callback: CALLBACK_EMAIL_OPTION},
            {name: 'Этот Telegram аккаунт', callback: CALLBACK_TELEGRAM_OPTION}
        ])
    }
}

export async function fillContacts() {
    const contactsCount = await Contact.count();
    if(!contactsCount) {
        return Contact.bulkCreate([
            {name: 'Позвонить', callback: CALLBACK_PHONE_CALL},
            {name: 'Whatsapp', url: URL_WHATSAPP},
            {name: 'Telegram', url: URL_TELEGRAM}
        ]);
    }
}

export async function fillStatuses() {
    const statusesCount = await Status.count();
    if(!statusesCount) {
        return Status.bulkCreate(statuses.map((status) => ({name: status})));
    }
}

export async function fillFeedbackTypes() {
    const feedbackTypesCount = await FeedbackType.count();
    if(!feedbackTypesCount) {
        return FeedbackType.bulkCreate(feedbackTypes.map(feedbackType => ({name: feedbackType})))
    }
}

export async function fillMockSubjectWorkTypes() {
    const subjectsCount = await Subject.count();
    if(subjectsCount) {
        return;
    }
    const [math, russ, history] = await Subject.bulkCreate([
        {name: 'Математика', mock: true},
        {name: 'Русский язык', mock: true},
        {name: 'История', mock: true},

    ]);

    const [quiz, essay, homework] = await WorkType.bulkCreate([
        {name: 'Контрольная работа', mock: true},
        {name: 'Эссе', mock: true},
        {name: 'Домашняя работа', mock: true}
    ]);

    return SubjectWorkType.bulkCreate([
        {subjectId: math.subjectId, workTypeId: quiz.workTypeId, minPrice: 3000},
        {subjectId: math.subjectId, workTypeId: homework.workTypeId, minPrice: 2000},
        {subjectId: russ.subjectId, workTypeId: essay.workTypeId, minPrice: 2500},
        {subjectId: russ.subjectId, workTypeId: homework.workTypeId, minPrice: 2000},
        {subjectId: history.subjectId, workTypeId: quiz.workTypeId, minPrice: 2700},
        {subjectId: history.subjectId, workTypeId: essay.workTypeId, minPrice: 2500},
        {subjectId: history.subjectId, workTypeId: homework.workTypeId, minPrice: 2200},
    ])
}
//
export async function fillTeachers() {

    const teachersCount = await Teacher.count();
    if(teachersCount) {
        return;
    }
    const subjects = (await Subject.findAll());

    const admin = await Teacher.create({
        mock: true,
        login: 'admin',
        password: 'password',
        isAdmin: true,
        name: 'Тимур Рахимжан',
        subjects,
    });
    await admin.save();
    await admin.$set('subjects', subjects);

    const mathTeacher = await Teacher.create({
        mock: true,
        login: 'math',
        password: 'password',
        name: 'Математик Математиков',
    });
    await mathTeacher.save();
    await mathTeacher.$set('subjects', subjects.filter((subject) => subject.name === 'Математика'));
}
