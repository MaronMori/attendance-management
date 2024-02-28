import {query} from "@/db";
import {NextResponse} from "next/server";

export async function POST(req: Request, res: Response){
    const data = await req.json()
    const month = data.month
    const year = data.year
    const uId = data.uId

    if(month && year && uId){
        const sql = `
    SELECT *
    FROM attendance
    WHERE MONTH(date) = ? AND YEAR(date) = ? AND uId = ?
    ORDER BY recordId ASC`
        const params = [month, year, uId]
        try {
            const result = await query(sql, params)
            return NextResponse.json({result})
        }catch (error){
            return NextResponse.json({error}, {status: 408})
        }
    }else {
        return NextResponse.json({message: "monthかyearかuIdがありません。"}, {status: 405})
    }
}