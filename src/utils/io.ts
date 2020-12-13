import fs from 'fs';

export const readFile = (path: string) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (error, content) => {
            if(error || !content) {
                reject(`No such file: ${path}`)
            }
            resolve(JSON.parse(content.toString()));
        })
    })
}

export const writeFile = (path: string, data: string) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, err => err ? reject(err) : resolve(null));
    })
}