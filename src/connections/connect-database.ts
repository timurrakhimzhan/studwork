import {Sequelize} from "sequelize-typescript";
import path from "path";

const connectDatabase = () => {
    return new Promise((resolve, reject) => {
        console.log(process.cwd());
        const sequelize = new Sequelize({
            username: process.env['DB_USERNAME'],
            database: process.env['DB_NAME'],
            password: process.env['DB_PASSWORD'],
            dialect: 'postgres',
            host: process.env['REMOTE'] ? process.env['DB_HOST'] : 'localhost',
            port: 5432,
            sync: {
                force: false,
                alter: false,
            },
            models: [path.join(process.cwd(), 'dist/database/models/*.js')],
            logging: false,
        })
        sequelize.authenticate()
            .then(() => sequelize.sync())
            .then(() => console.log('Connected to database'))
            .then(() => resolve(sequelize))
            .catch((error) => console.log('error', error));
    });
}

export default connectDatabase;