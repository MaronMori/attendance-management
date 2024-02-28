import * as mysql from "promise-mysql"
import {NextResponse} from "next/server";

export async function POST(){
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: "attendance"
    })

    try {
        const sql = 'SELECT * FROM attendance';
        const result = await connection.query(sql);
        connection.end();

        return NextResponse.json(result);
    }catch (error){
        return NextResponse.json({error}, {status: 406})
    }
}