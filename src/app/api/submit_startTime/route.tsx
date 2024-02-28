import {connectionCheck, query} from "@/db";
import {NextResponse} from "next/server";

export async function POST(req: Request, res: Response){
        const request = await req.json()
        const uId = request.uId
        const date = request.date
        const startTime = request.startTime

        // 出勤済みか確認
        try {
                const checkStartTimeResult: any = await query(`
                SELECT recordId, startTime, endTime
                FROM attendance
                WHERE uid = ? AND date = ?
                ORDER BY recordId DESC LIMIT 1`
                    ,[uId, date])
                if (checkStartTimeResult.length > 0 && checkStartTimeResult[0].startTime !== null && checkStartTimeResult[0].endTime == null){
                        return NextResponse.json({message: "既に出勤済みです。"})
                } else{
                        try {
                                const result = await query(`INSERT INTO attendance (uId, date, startTime) VALUES (?, ?, ?)`,
                                    [uId, date, startTime])
                                return Response.json({message: "出勤しました。", result: result})
                        }catch (error){
                                return Response.json({message: "データベースへの記録に失敗しました。", error: error}, {status: 403})
                        }
                }
        }catch (error){
                return NextResponse.json({message: "出勤済みか確認最中にエラーが起きました。"})
        }



}