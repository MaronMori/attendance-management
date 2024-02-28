"use client"

import React, {createContext, useContext, useState} from "react";

interface ContextValues {
    isDataChanged: boolean,
    setIsDataChanged: (isChanged: boolean) => void
}

const GraphRenewContext = createContext<ContextValues>({
    isDataChanged: false,
    setIsDataChanged: () => {}
})


interface GraphRenewProps {
    children: any
}
export const GraphRenewProvider:React.FC<GraphRenewProps> = ({children}) => {
    const [isDataChanged, setIsDataChanged] = useState(false)

    const value = {isDataChanged, setIsDataChanged}
    return (
        <GraphRenewContext.Provider value={value}>
            {children}
        </GraphRenewContext.Provider>
    )
}

export const useGraphRenewContext = () => useContext(GraphRenewContext)