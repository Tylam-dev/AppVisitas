import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Timestamp} from "firebase/firestore";
import dayjs from "dayjs";
import { AiOutlineLoading } from "react-icons/ai";

const InstalacionInfo = ({setInfoDataScreen, rowSelected}) => {
        const tiempoReal = Timestamp.fromDate(dayjs().$d)
        const [loading, setLoading] = useState(false)
        const transformFecha = (fechaInput) => {
                const milisegundos = fechaInput.nanoseconds / 1000000
                const fecha = dayjs(fechaInput.seconds * 1000 + milisegundos)
                const tiempoFormateado = fecha.format('DD-MM-YYYY HH:mm')
                return tiempoFormateado;
        }
    return(
        <>
            {(() =>{
                if(loading){
                    return(
                        <>
                        <div className="absolute w-screen h-screen bg-black opacity-50 top-0 left-0 z-20 flex justify-center items-center">
                        </div>
                        <AiOutlineLoading className="animate-spin absolute opacity-100 w-1/2 h-1/2 left-20 z-30 text-tertiary"/>
                        <div className="absolute w-screen h-screen bg-black opacity-50 top-0 left-0 z-0"></div>
                        </>
                    )
                }else{
                    return ""
                }
            })()}
        <div className="absolute w-screen h-screen bg-black opacity-50 top-0 left-0 z-10 flex justify-center items-center">
        </div>
        <div className="bg-primary w-3/4 h-4/7 lg:w-1/4 lg:inset-x-1/3  absolute z-10 left-10 top-[10%] rounded-3xl flex flex-col items-center py-2 gap-5">
            <button className="rounded-md hover:bg-quaternary self-end mr-2" onClick={() => {setInfoDataScreen(false)}}><IoClose className="text-quinary hover:text-primary w-10 h-10"/></button>
            <h1 className="text-center text-tertiary text-xl">Informacion de la instalacion</h1>
            <div className="text-quinary flex flex-col px-5 gap-2 text-sm">
                <span className="overflow-hidden"><strong>Nombres:</strong>{`${rowSelected.nombres}`} </span>
                <span><strong>Motivo:</strong>{`${rowSelected.motivo}`}</span>
                <span className="overflow-hidden"><strong>Direccion: </strong>{`${rowSelected.direccion}`}</span>
                <span><strong>Tecnico: </strong>{`${rowSelected.tecnico}`}</span>
                <span><strong>Nodo: </strong>{`${rowSelected.nodo}`}</span>
                <span><strong>Plan: </strong>{`${rowSelected.plan}`}</span>
                <span><strong>Telefono: </strong>{`${rowSelected.telf}`}</span>
                <span><strong>Fecha de ingreso: </strong>{transformFecha(rowSelected.fecha_reporte)}</span>
                <span><strong>Fecha de instalacion: </strong>{transformFecha(rowSelected.fin_visita)}</span>
                <span><strong>Tecnico acompaniante: </strong>{`${rowSelected.tecnico_acompaniante}`}</span>
                <span><strong>Conexion: </strong>{`${rowSelected.conexion}`}</span>
                <span><strong>Equipo: </strong>{`${rowSelected.equipo}`}</span>
                {(() => {
                    if(rowSelected.conexion === "FIBRA"){
                        return (
                        <>
                            <span><strong>Caja: </strong>{`${rowSelected.caja}`}</span>
                            <span><strong>Serial: </strong>{`${rowSelected.serial}`}</span>
                            <span><strong>Cable: </strong>{`${rowSelected.cable} mts`}</span>
                        </>  
                        )
                    }else if(rowSelected.conexion === "INALAMBRICO"){
                        return (
                            <>
                                <span><strong>Sectorial: </strong>{`${rowSelected.sectorial}`}</span>
                                <span><strong>Senial: </strong>{`${rowSelected.senial} dbm`}</span>
                                <span><strong>LAN MAC: </strong>{`${rowSelected.lan_mac} dbm`}</span>
                                <span><strong>Altura: </strong>{`${rowSelected.altura}`}</span>
                            </>  
                            )
                    }
                })()}
                <span><strong>Coordenadas: </strong>{`${rowSelected.coordenadas}`}</span>
                <span><strong>Zona: </strong>{`${rowSelected.zona}`}</span>
                <span><strong>Nota: </strong>{`${rowSelected.nota}`}</span>
                
            </div>
        </div>
        </>
        
    )
}

export {InstalacionInfo}