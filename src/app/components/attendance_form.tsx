"use client"

import React, {useEffect, useState} from "react";
import {Button} from "@mui/material";
import {auth} from "@/firebaseConfig";
import {useGraphRenewContext} from "@/app/contexts/table_renew";

const changeTimeFormat24 = (time: any)=> {
    let startTime = ""

    if(time.includes("AM")){
        startTime = time.replace("AM", "")
    }else {
        let hour = parseInt(time.split(":")[0], 10)
        if(hour == 12){
            startTime = time.replace("PM", "")
        }else {
            hour += 12
            startTime = `${hour.toString().padStart(2, '0')}${time.substring(time.indexOf(':'))}`.replace("PM", "")
        }
    }

    return startTime
}

export const Attendance_form = () => {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const {isDataChanged, setIsDataChanged} = useGraphRenewContext()

    useEffect(() => {
        setCurrentTime(new Date())

        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => {
            clearInterval(timer)
        }
    }, []);

    const formattedDate = currentTime ? currentTime.toLocaleDateString() : ""
    const formattedTime = currentTime ? currentTime.toLocaleTimeString() : ""

    // 出勤する
    const submitStartTime = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const uId = auth.currentUser?.uid
        const now = new Date();
        const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const time = new Date().toLocaleTimeString()

        const startTime = changeTimeFormat24(time)

        try {
            const response = await fetch("/api/submit_startTime", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({uId, date, startTime})
            })

            if(!response){
                alert("データベースへのリクエストが失敗しました。")
            }else {
                const data = await response.json()
                alert(data.message)
                setIsDataChanged(!isDataChanged)
            }

        }catch (error){
            alert("エラーが起きました。")
            console.log("エラー： " + error)
        }
    }

    //　休憩する（任意）
    const submitBreakStart = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const uId = auth.currentUser?.uid
        const now = new Date();
        const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const time = new Date().toLocaleTimeString()
        const breakStart = changeTimeFormat24(time)

        try {
            const response: Response = await fetch("/api/submit_breakStart", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({uId, date, breakStart})
            })
            if (!response){
                alert("データベースへのリクエストが失敗しました。")
            }else {
                const data = await response.json()
                alert(data.message)
                setIsDataChanged(!isDataChanged)
            }

        }catch (error){
            alert("サーバーエラーが起きました。")
        }
    }

    // 休憩終了
    const submitBreakEnd = async (e: React.MouseEvent<HTMLButtonElement>)=> {
        e.preventDefault()

        const uId = auth.currentUser?.uid
        const now = new Date();
        const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const time = new Date().toLocaleTimeString()
        const breakEnd = changeTimeFormat24(time)

        try {
            const response: Response = await fetch("/api/submit_breakEnd", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({uId, date, breakEnd})
            })
            if (!response){
                alert("データベースへのリクエストが失敗しました。")
            }else {
                const data = await response.json()
                alert(data.message)
                setIsDataChanged(!isDataChanged)
            }

        }catch (error){
            alert("サーバーエラーが起きました。")
        }
    }

    // 退勤する
    const submitEndTime = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const uId = auth.currentUser?.uid
        const now = new Date();
        const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const time = new Date().toLocaleTimeString()
        const endTime = changeTimeFormat24(time)

        try {
            const response = await fetch("/api/submit_endTime", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({uId, date, endTime})
            })

            if(!response){
                alert("データベースへのリクエストが失敗しました。")
            }else {
                const data = await response.json()
                alert(data.message)
                setIsDataChanged(!isDataChanged)
            }

        }catch (error){
            alert("エラーが起きました。")
            console.log("エラー： " + error)
        }
    }

    return(
        <div className={"pt-12 md:pt-32"}>
            <div className={"text-center"}>
                <div className={"text-3xl md:text-6xl"}>{formattedDate}</div>
                <div className={"text-3xl md:text-6xl"}>{formattedTime}</div>
            </div>
            <div className={"flex justify-evenly mt-10"}>
                <Button type={"button"} variant={"contained"} onClick={(e) => submitStartTime(e)}>出勤</Button>
                <Button type={"button"} variant={"outlined"} onClick={(e) => submitBreakStart(e)}>休憩開始</Button>
                <Button type={"button"} variant={"outlined"} onClick={(e) => submitBreakEnd(e)}>休憩終了</Button>
                <Button type={"button"} variant={"contained"}　onClick={(e) => submitEndTime(e)}>退勤</Button>
            </div>
        </div>
    )
}