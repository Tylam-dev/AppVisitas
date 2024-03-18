import { useState } from "react"
import { VisitasRealizadasTable } from "../VisitasRealizadasTable/Index"
import { VisitasPendientesTable } from "../VisitasPendientesTable/Index"
import { VisitasEnProcesoTable } from "../VisitasEnProceso/Index"

const VisitasMenu = () => {
    const [tableScreen, setTableScreen] = useState('Pendientes')
    const botones = ['Pendientes','En proceso', 'Realizadas']
    return(
        <div className="w-full h-full  pt-12 lg:px-12 px-2 flex flex-col gap-5">
            <h1 className="text-6xl pt-5 text-quinary">Visitas</h1>
            <div className="flex justify-start flex-wrap w-full gap-2 lg:w-1/3">
                {
                    botones.map((e, index) => (
                        <button key={index} onClick={() => setTableScreen(e)} className={`rounded-md ${(tableScreen === e) && "bg-tertiary text-primary"} w-1/4 ${(tableScreen != e) && "hover:text-secondary"}`}>{e}</button>
                    ))
                }
            </div>
            {(tableScreen === 'Pendientes')? <VisitasPendientesTable/>:""}
            {(tableScreen === 'En proceso')? <VisitasEnProcesoTable/>:""}
            {(tableScreen === 'Realizadas')? <VisitasRealizadasTable/>:""}
        </div>
    )
}

export {VisitasMenu}