"use client"

import {Button, Paper} from "@mui/material";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {signOut} from "@firebase/auth";
import {auth, firebaseDB} from "@/firebaseConfig";
import {useRouter} from "next/navigation";
import {collection, getDoc, getDocs, where} from "@firebase/firestore";
import {query} from "@firebase/firestore";

interface HeaderProps {
    type: "login" | "create" | "logout"}

export const Header:React.FC<HeaderProps> = ({type}) => {
    const [lastName, setLastName] = useState("")
    const [firstName, setFirstName] = useState("")
    const router = useRouter()
    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        await signOut(auth).then(() => router.push("/"))
    }
    // データベースの接続確認ハンドラー
    // const handleConnectionCheck = async (e: React.MouseEvent<HTMLButtonElement>) => {
    //     e.preventDefault()
    //     try {
    //         const request = await fetch("api/test_connection_db", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type" : "application/json",
    //             },
    //         })
    //         if(!request.ok){
    //             alert("接続できませんでした。")
    //             console.log(request)
    //         }else {
    //             alert("接続できました。")
    //             console.log(request)
    //         }
    //     }catch (error){
    //         alert(error)
    //     }
    //
    // }

    const fetchUserName = async () => {
        const collectionRef = collection(firebaseDB, "users")
        const q = query(collectionRef, where("uId", "==", auth.currentUser?.uid))

        const snapShot = await getDocs(q)
        snapShot.forEach((doc) => {
            const userData = doc.data()
            setLastName(userData.lastName)
            setFirstName(userData.firstName)
        });    }

    useEffect(() => {
        if(auth.currentUser){
            fetchUserName()

        }


    }, [auth.currentUser]);

    if(type=="login"){
        return (
            <div className={"fixed w-full"}>
                <Paper className={"flex justify-between py-2"} sx={{backgroundColor: "#9DB2BF"}}>
                    <h1 className={"mt-1 ml-4 text-xl"}>勤怠管理</h1>
                    <ul className={"mr-4"}>
                        <li>
                            <Button type={"button"} sx={{color: "black"}}>
                                <Link href={"/"}>ログイン</Link>
                            </Button>
                        </li>
                    </ul>
                </Paper>
            </div>
        )
    }
    if (type == "create") {
        return (
            <div className={"fixed w-full"}>
                <Paper className={"flex justify-between py-2"} sx={{backgroundColor: "#9DB2BF"}}>
                    <h1 className={"mt-1 ml-4 text-xl"}>勤怠管理</h1>
                    <ul className={"mr-4"}>
                        <li>
                            <Button type={"button"} sx={{color: "black"}}>
                                <Link href={"/create_account"}>アカウント作成</Link>
                            </Button>
                        </li>
                    </ul>
                </Paper>
            </div>
        )
    }
    if(type=="logout"){
        return (
            <div className={"fixed w-full"}>
                <Paper className={"flex justify-between py-2"} sx={{backgroundColor: "#9DB2BF"}}>
                    <h1 className={"mt-1 ml-4 text-xl"}>勤怠管理</h1>
                    <ul className={"mr-4 flex space-x-3"}>
                        <li>
                            <div className={"flex mt-1 space-x-2 mr-8"}>
                                <div>{lastName}</div>
                                <div>{firstName}</div>
                            </div>
                        </li>
                        {/*<li><Button onClick={(e) => handleConnectionCheck(e)}>DB接続確認</Button> </li>*/}
                        <li><Button variant={"contained"}  onClick={(e) => handleLogout(e)}>ログアウト</Button></li>
                    </ul>
                </Paper>
            </div>
        )
    }
}