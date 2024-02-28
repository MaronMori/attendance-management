import {query} from "@/db";
import {NextResponse} from "next/server";

export async function POST (req: Request) {
    const request = await req.json()
    const uId = request.uId
    const date = request.date
    const breakStart = request.breakStart

    // 既に休憩が開始されているか確認
    const checkSql = `
    SELECT recordId, startTime,breakStart, breakEnd, endTime
    FROM attendance
    WHERE uId = ? AND date = ?
    ORDER BY recordId DESC LIMIT 1`
    const checkParams = [uId, date]

    try {
        const checkBreakStartResult: any = await query(checkSql, checkParams)
        const recordId = checkBreakStartResult[0].recordId
        if (checkBreakStartResult.length > 0 && checkBreakStartResult[0].breakStart !== null && checkBreakStartResult[0].breakEnd == null){
            return NextResponse.json({message: "既に休憩を開始しています。"})
        } else if (checkBreakStartResult.length > 0 && checkBreakStartResult[0].breakStart !== null && checkBreakStartResult[0].breakEnd !== null && checkBreakStartResult[0].endTime == null){
            return NextResponse.json({message: "既に休憩は終了しました。"})
        }else if (checkBreakStartResult.length == 0 || checkBreakStartResult[0].startTime !== null && checkBreakStartResult[0].endTime !== null){
            return NextResponse.json({message:　"出勤していません。"})
        } else {
            // 休憩を申請
            try {
                const sql = `
                UPDATE attendance
                SET breakStart = ?
                WHERE recordId = ? AND uId = ? AND date = ?`
                const params = [breakStart, recordId, uId, date]
                const result = await query(sql, params)
                return NextResponse.json({message: "休憩を開始しました。", result: result})
            }catch (error){
                return NextResponse.json({message: "休憩の申請でエラーが起きました。"})
            }

        }
    }catch (error){
        return NextResponse.json({message: "休憩済みか確認最中にエラーが起きました。", error: error})
    }
}