"use client"

import {auth, firebaseDB} from "@/firebaseConfig";
import {Button, FormControl, FormLabel, LinearProgress, Paper, TextField} from "@mui/material";
import React, {useState} from "react";
import {createUserWithEmailAndPassword} from "@firebase/auth";
import {Header} from "@/app/components/header";
import {useRouter} from "next/navigation";
import {bold} from "next/dist/lib/picocolors";
import {addDoc, collection} from "@firebase/firestore";

export default function Create_account(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [lastName, setLastName] = useState("")
    const [firstName, setFirstName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        if(password !== confirmPassword){
            setIsLoading(false)
            return alert("パスワードが確認用パスワードと一致しません。")
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)

            const user = userCredential.user;
            if (user) {
                try {
                    const docRef = await addDoc(collection(firebaseDB, "users"),{
                        lastName: lastName,
                        firstName: firstName,
                        uId : user.uid,
                        createdAt: new Date()
                    })
                    alert("アカウント作成が完了しました。ログインしてください。")
                    router.push("/")
                }catch (error){
                    alert(error)
                }
            }else {
                alert("アカウント認証の作成でエラーが起きました。")
            }

        }catch (error: any){
            if(error.code.includes("auth/email-already-in-use")){
                alert("メールアドレスが既に使用されています。")
            }else {
                alert("アカウント作成時にエラーが起きました。" + "\n" + error)
            }
        }
        setIsLoading(false)
    }

    return (
        <div className={"h-full"}>
            <Header type={"login"}/>
            <main className={"flex justify-center h-full"}>
                <Paper elevation={5} className={"w-11/12 md:w-1/2 my-40 py-10 px-12 md:px-24"}>
                    <form className={"flex justify-center"} onSubmit={(e) => handleSubmit(e)}>
                        <FormControl className={"w-full flex-col space-y-4"}>
                            <FormLabel sx={{fontSize: "24px", fontWeight: "bold"}}>アカウント作成</FormLabel>
                            <TextField label={"メールアドレス"} required={true} value={email}
                                       onChange={(e) => setEmail(e.target.value)}></TextField>
                            <TextField label={"パスワード"} required={true} value={password}
                                       onChange={(e) => setPassword(e.target.value)}></TextField>
                            <TextField label={"確認用パスワード"} required={true} value={confirmPassword}
                                       onChange={(e) => setConfirmPassword(e.target.value)}></TextField>
                            <div className={"flex space-x-2 justify-between"}>
                                <TextField label={"苗字"} required={true} value={lastName}
                                           onChange={(e) => setLastName(e.target.value)}></TextField>
                                <TextField label={"名前"} required={true} value={firstName}
                                           onChange={(e) => setFirstName(e.target.value)}></TextField>
                            </div>
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