import mysql, {Pool} from "mysql";

const pool:Pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 3306,
    database: "attendance"
})


export function connectionCheck() {
    return new Promise((resolve, reject) => {
        // ここではデータベースのバージョンを取得する単純なクエリを実行します。
        pool.query('SELECT VERSION()', (error, results) => {
            if (error) {
                reject('データベース接続に失敗しました: ' + error.message);
                return error
            } else {
                resolve('データベース接続が成功しました: ' + results[0]['VERSION()']);
            }
        });
    });
}

export function query(sql: string, params: any[]) {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (error, results) => {
            if (error) {
                reject(error);
                return error;
            }
            resolve(results);
        });
    });
}