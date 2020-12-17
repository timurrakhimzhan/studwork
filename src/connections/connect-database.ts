import {createConnection} from "typeorm";
import ContactOptions from "../database/entities/ContactOptions";
import Order from "../database/entities/Order";
import Subject from "../database/entities/Subject";
import Teacher from "../database/entities/Teacher";
import WorkType from "../database/entities/WorkType";
import WorkTypeToSubject from "../database/entities/WorkTypeToSubject";
import Status from "../database/entities/Status";

const connectDatabase = () => {
    return new Promise((resolve, reject) => {
       createConnection({
           type: 'postgres',
           host: 'localhost',
           port: 5432,
           username: process.env['DB_USERNAME'],
           database: process.env['DB_NAME'],
           password: process.env['DB_PASSWORD'],
           entities: [ContactOptions, Order, Status, Subject, Teacher, WorkType, WorkTypeToSubject],
           synchronize: true,
       }).then((res) => {
            console.log('Database is connected');
            resolve(res);
       }).catch(error => {
           console.log('Error connecting to db', error);
           reject(error);
       });
    });
}

export default connectDatabase;