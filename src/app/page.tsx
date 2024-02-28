"use client"

import {auth} from "@/firebaseConfig";
import {Button, FormControl, FormLabel, LinearProgress, Paper, TextField} from "@mui/material";
import React, {useState} from "react";
import { signInWithEmailAndPassword} from "@firebase/auth";
import {useRouter} from "next/navigation";
import {Header} from "@/app/components/header";

export default function Login_Page(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
                alert("ログインしました。" )
            })
            setIsLoading(false)
            router.push("/attendance")
        }catch (error: any){
            setIsLoading(false)
            if(error.code.includes("auth/invalid-credential")){
                alert("メールアドレスか、パスワードが間違っています。")
            }else if(error.code.includes("auth/too-many-requests")){
                alert("連続で複数回ログインに失敗したため、一時的にログインができなくなりました。しばらく経った後にもう一度ログインしてください。")
            } else {
                alert(error)
            }
        }
    }

    return (
        <div className={"h-full"}>
            <Header type={"create"}/>
            <main className={"flex justify-center h-full"}>
                <Paper elevation={5} className={"w-11/12 md:w-1/2 h-80 mt-40 py-10 px-12 md:px-24"}>
                    <form className={"flex justify-center"} onSubmit={(e) => handleSubmit(e)}>
                        <FormControl className={"w-full flex-col space-y-4"}>
                            <FormLabel sx={{fontSize: "24px", fontWeight: "bold"}}>ログイン</FormLabel>
                            <TextField label={"メールアドレス"} value={email} required={true}
                                       onChange={(e) => setEmail(e.target.value)}></TextField>
                            <TextField label={"パスワード"} value={password} required={true}
                                       onChange={(e) => setPassword(e.target.value)}></TextField>
                            <Button type={"submit"}>Login</Button>
                        </FormControl>
                    </form>
                    <div>
                        {isLoading && <LinearProgress/>}
                    </div>
                </Paper>
            </main>
        </div>
    )
}