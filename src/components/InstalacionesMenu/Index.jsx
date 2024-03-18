import { useState } from "react"
import { InstalacionesTable } from "../InstalacionesTable/Index"


const InstalacionesMenu = () => {
    const [tableScreen, setTableScreen] = useState('Instalaciones')
    const botones = ['Instalaciones','Graficos']
    return(
        <div className="w-full h-full  pt-12 lg:px-12 px-2 flex flex-col gap-5">
            <h1 className="text-6xl pt-5 text-quinary">Instalaciones</h1>
            <div className="flex justify-start flex-wrap w-full gap-2 lg:w-1/3">
                {
                    botones.map((e, index) => (
                        <button key={index} onClick={() => setTableScreen(e)} className={`rounded-md ${(tableScreen === e) && "bg-tertiary text-primary"} w-1/4`}>{e}</button>
                    ))
                }
            </div>
            {(tableScreen === 'Instalaciones')? <InstalacionesTable/>:""}
            {(tableScreen === 'Graficos')? "":""}
        </div>
    )
}

export {InstalacionesMenu}