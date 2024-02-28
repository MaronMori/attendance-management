import {query} from "@/db";
import {NextResponse} from "next/server";

export async function POST (req: Request){
    const request = await req.json()
    const uId = request.uId
    const date = request.date
    const breakEnd = request.breakEnd

    // 休憩が終了されているかどうか確認
    const checkBreak =`
    SELECT recordId, breakStart, breakEnd, endTime
    FROM attendance
    WHERE uId = ? AND date = ?
    ORDER BY recordId DESC LIMIT 1
    `
    const checkParams = [uId, date]

    try {
        const checkBreakEndResult: any = await query(checkBreak, checkParams)
        const recordId = checkBreakEndResult[0].recordId
        if(checkBreakEndResult.length > 0 && checkBreakEndResult[0].endTime !== null){
            return NextResponse.json({message: "退勤済みもしくは出勤していません。"})
        } else if(checkBreakEndResult.length > 0 && checkBreakEndResult[0].breakEnd !== null){
            return NextResponse.json({message: "既に休憩は終了しています。"})
        }else if(checkBreakEndResult > 0 && checkBreakEndResult[0].breakStart == null){
            return NextResponse.json({message: "休憩を開始していません。"})
        }else {
            try {
                // 休憩を終了
                const sql = `
            UPDATE attendance
            SET breakEnd = ?
            WHERE recordId = ? AND uId = ? AND date = ?`
                const params = [breakEnd, recordId, uId, date]
                const result = await query(sql, params)
                return NextResponse.json({message: "休憩を終了しました。"})
            }catch (error){
                return NextResponse.json({message: "休憩を終了しようとしましたがエラーが起きました。", error: error})
            }
        }
    }catch (error){
        return NextResponse.json({message: "休憩開始済みかを確認中にエラーが起きました。"})
    }
}