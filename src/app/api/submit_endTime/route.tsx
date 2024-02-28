import {query} from "@/db";
import {NextResponse} from "next/server";

export async function POST(req: Request, res: Response) {
    const request = await req.json()
    const uId = request.uId
    const date = request.date
    const endTime = request.endTime

    // 退勤が既にされているかどうか確認
    const checkSql = `
        SELECT breakStart, breakEnd, endTime
        FROM attendance
        WHERE uId = ? AND date = ?
        ORDER BY recordId DESC LIMIT 1;`;
    const checkParams = [uId, date]

    try {
        const checkResult :any = await query(checkSql, checkParams)
        if (checkResult.length > 0 && checkResult[0].endTime !== null) {
            // endTimeがすでに設定されている場合は、エラーメッセージを返す
            return NextResponse.json({message: "既に退勤済みか出勤していません。"});
        } else if (checkResult.length == 0) {
            return NextResponse.json({message: "出勤していません。"})
        } else if(checkResult.length > 0 && checkResult[0].breakStart !== null && checkResult[0].breakEnd == null){
            return NextResponse.json({message: "休憩を終了してください。"})
        }

        let updateSql;
        let updateParams;

        // 休憩時間があるか確認
        try {
            const checkBreak = `
            SELECT recordId, breakStart, breakEnd 
            FROM attendance
            WHERE uId = ? AND date = ?
            ORDER BY recordId DESC LIMIT 1;`;
            const checkBreakPrams = [uId, date];

            const checkBreakResult: any = await query(checkBreak, checkBreakPrams)
            const recordId = checkBreakResult[0].recordId
            if(checkBreakResult.length > 0 && checkBreakResult[0].breakEnd !== null){
                updateSql = `
                UPDATE attendance
                SET endTime = ?, totalHours =  TIMEDIFF(TIMEDIFF(?, startTime), TIMEDIFF(breakEnd, breakStart))
                WHERE recordId = ? AND uId = ? AND date = ?;`
                updateParams = [endTime, endTime, recordId, uId, date]
            }else {
                updateSql = `
            UPDATE attendance
            SET endTime = ?, totalHours = TIMEDIFF(?, startTime)
            WHERE recordId = ? AND uId = ? AND date = ?;`;
                updateParams = [endTime, endTime, recordId, uId, date];
            }
        }catch (error){
            return NextResponse.json({message: "休憩時間の確認でエラーが起きました。"}, {status: 404})
        }
        const result = await query(updateSql, updateParams)
        return NextResponse.json({message: "退勤しました。", result: result}, {status: 200})
    } catch (error) {
        return NextResponse.json({message: "データベースへの記録に失敗しました。",error: error}, {status: 403})
    }

}