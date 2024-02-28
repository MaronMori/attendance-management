"use client"

import React, {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {onAuthStateChanged, User} from "@firebase/auth";
import {auth} from "@/firebaseConfig";

interface AuthContextType{
    user: User | null
}

const AuthContext = createContext<AuthContextType>({user: null})

interface AuthProps {
    children : any
}
export const FirebaseAuthProvider:React.FC<AuthProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if(currentUser){
                setUser(currentUser)
            }else{
                alert("ログアウトしました。")
                router().push("/")
            }
        })

        return () => unsubscribe();
    }, []);

    const value = {user};

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext)