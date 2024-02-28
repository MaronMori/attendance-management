"use client"

import {
    Button,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import React, {useEffect, useState} from "react";
import {useGraphRenewContext} from "@/app/contexts/table_renew";
import {auth} from "@/firebaseConfig";

interface AttendanceData {
    date: string;
    startTime: string;
    breakStart?: string;
    breakEnd?: string;
    endTime: string;
    totalHours: string;
}

export const Timeline =  () => {
    const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([])
    const {isDataChanged, setIsDataChanged} = useGraphRenewContext()
    const uId = auth.currentUser?.uid
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [isFetching, setIsFetching] = useState(false)

    const fetchData = async (month: number, year: number) => {
        try {
            const response = await fetch("api/get_table_data", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({month, year, uId})
            })
            if (!response.ok) {
                throw new Error('データの取得に失敗しました。');
            }
            const data = await response.json();
            return data;
        }catch (error){
            console.log("errorを表示" + error)
            return false
        }
    }

    useEffect(() => {
        setIsFetching(true)
        if(uId){
            fetchData(currentMonth, currentYear).then((data) => {
                    if(data){
                        setAttendanceData(data.result)
                    }else {
                        console.log("データの取得に失敗しました。" )
                    }
                }
            )
        }
        setIsFetching(false)
    }, [isDataChanged, currentMonth, currentYear, uId]);

    const handlePreviousMonth = () => {
        setCurrentMonth(prev => prev === 1 ? 12 : prev -1);
        if(currentMonth === 1) setCurrentYear(prev => prev -1)
    }

    const handleNextMonth = () => {
        setCurrentMonth(prev => prev === 12 ? 1 : prev + 1);
        if (currentMonth === 12) setCurrentYear(prev => prev + 1);
    };

    if(isFetching || uId == undefined){
        return (
            <CircularProgress />
        )
    }

    return(
        <div>
            <div className={"flex justify-center"}>
                <div className={"flex"}>
                    <Button type={"button"} onClick={() => handlePreviousMonth()}><ArrowLeftIcon /></Button>
                    <div className={"text-2xl"}>
                        {currentYear}年{currentMonth}月
                    </div>
                    <Button type={"button"} onClick={() => handleNextMonth()}><ArrowRightIcon /></Button>
                </div>
            </div>
            <div>
                <TableContainer component={Paper} sx={{maxHeight:"500px", overflow: "scroll"}}>
                    <Table stickyHeader={true}>
                        <TableHead>
                            <TableRow>
                                <TableCell>出勤日</TableCell>
                                <TableCell>出勤時刻</TableCell>
                                <TableCell>休憩開始時刻</TableCell>
                                <TableCell>休憩終了時刻</TableCell>
                                <TableCell>退勤時刻</TableCell>
                                <TableCell>合計就労時間</TableCell>
                            </TableRow>
                        </TableHead>
                        {attendanceData && attendanceData[0] !== undefined &&
                            <TableBody >
                                {attendanceData.map((data, index) =>(
                                    <TableRow key={index}>
                                        <TableCell>{data.date.split("T")[0]}</TableCell>
                                        <TableCell>{data.startTime}</TableCell>
                                        <TableCell>{data.breakStart ? data.breakStart : ''}</TableCell>
                                        <TableCell>{data.breakEnd ? data.breakEnd : ''}</TableCell>
                                        <TableCell>{data.endTime}</TableCell>
                                        <TableCell>{data.totalHours}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        }
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}