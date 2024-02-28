import {Header} from "@/app/components/header";
import {Paper} from "@mui/material";
import {Timeline} from "@/app/components/timeline";
import {Attendance_form} from "@/app/components/attendance_form";
import {FirebaseAuthProvider} from "@/app/contexts/firebase_auth";
import {GraphRenewProvider} from "@/app/contexts/table_renew";

export default function Attendance() {

    return(
        <FirebaseAuthProvider>
            <GraphRenewProvider>
                <div className={"h-full"}>
                    <Header type="logout"/>
                    <main className={"flex justify-center pt-20 h-full"}>
                        <Paper className={"px-4 max-w-80 md:max-w-full md:px-10 justify-evenly space-x-4 py-10 w-full mx-4 my-4"} sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' }, // xsサイズで縦並び、mdサイズで横並び
                            gap: 2, // 要素間の間隔
                        }}>
                            <Timeline/>
                            <Attendance_form/>
                        </Paper>
                    </main>
                </div>
            </GraphRenewProvider>
        </FirebaseAuthProvider>
    )
}