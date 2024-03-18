import { MdDeleteOutline } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { Timestamp, setDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import dayjs from "dayjs";
import { MdDoneAll, MdAssignmentReturn } from "react-icons/md";
import { AiOutlineLoading } from "react-icons/ai";
import { useEffect, useState } from "react";

const CompleteVisita = ({setCompleteVisitaScreen, rowSelected, setActualizar, actualizar}) => {
        const tiempoReal = Timestamp.fromDate(dayjs().$d)
        const problemas = [
            'ROUTER DANIADO'
        ]
        const solucion = [
            'CAMBIO EQUIPO'
        ]
        const nodos = [
            "GUAYAQUIL", "LIBERTAD", "PLAYAS"
        ]
        const equipos = [
            "HUAWEI AFV", "MOTOROLA CDF"
        ]
        const [visitaRealizada, setVisitaRealizada] = useState({...rowSelected})
        const [errorMessage, setErrorMessage] = useState(false)
        const [loading, setLoading] = useState(false)
        const checkEmptyInput = () => {
            const checkMotivo = (visitaRealizada.motivo === "NO TIENE INTERNET") || (visitaRealizada.motivo === "INTERNET INESTABLE")
            if(visitaRealizada.motivo === "INSTALACION"){
                if(visitaRealizada.conexion === 'INALAMBRICO'){
                    const checkInputs = (visitaRealizada.nodo && visitaRealizada.equipo && visitaRealizada.lan_mac && visitaRealizada.senial && visitaRealizada.sectorial && visitaRealizada.altura && visitaRealizada.coordenadas && visitaRealizada.zona)? true: false
                    return checkInputs
                }else if(visitaRealizada.conexion === "FIBRA"){
                    const checkInputs = (visitaRealizada.nodo && visitaRealizada.equipo && visitaRealizada.serial && visitaRealizada.cable && visitaRealizada.dbm && visitaRealizada.caja && visitaRealizada.coordenadas && visitaRealizada.zona)? true: false
                    return checkInputs
                }
            }else if (checkMotivo){
                const checkInputs = (visitaRealizada.problema && visitaRealizada.solucion && visitaRealizada.zona && visitaRealizada.coordenadas)? true: false
                return checkInputs
            }else if(visitaRealizada.motivo === "RETIRO"){
                if(visitaRealizada.conexion === 'INALAMBRICO'){
                    const checkInputs = (visitaRealizada.equipo && visitaRealizada.lan_mac && visitaRealizada.coordenadas && visitaRealizada.zona)? true: false
                    return checkInputs
                }else if(visitaRealizada.conexion === "FIBRA"){
                    const checkInputs = (visitaRealizada.equipo && visitaRealizada.serial && visitaRealizada.caja && visitaRealizada.coordenadas && visitaRealizada.zona)? true: false
                    return checkInputs
                }
            }
        }
        const sendData = async(data) => {
            setLoading(true)
            if(visitaRealizada.motivo === "INSTALACION"){
                try {
                    await setDoc(doc(db, "instalaciones", String(data.id)), data)
                    await deleteDoc(doc(db, "en_proceso", String(data.id)))
                    setActualizar(!actualizar)
                    setLoading(false)
                    setCompleteVisitaScreen(false)
                } catch (error) {
                    console.error(error)
                }
            }else if(visitaRealizada.motivo === "RETIRO"){
                try {
                    await setDoc(doc(db, "retiros", String(data.id)), data)
                    await deleteDoc(doc(db, "en_proceso", String(data.id)))
                    setActualizar(!actualizar)
                    setCompleteVisitaScreen(false)
                } catch (error) {
                    console.error(error)
                }
            }else{
                try {
                await setDoc(doc(db, "visitas_realizadas", String(data.id)), data)
                await deleteDoc(doc(db, "en_proceso", String(data.id)))
                setActualizar(!actualizar)
                setCompleteVisitaScreen(false)
                } catch (error) {
                console.error(error)
                }
            }
        }
        const onSubmit = (event) => {
            event.preventDefault()
            if(checkEmptyInput()){
                sendData(visitaRealizada)
            }else{
                setErrorMessage(true)
            }
        }
        const transformFecha = (fechaInput) => {
                const milisegundos = fechaInput.nanoseconds / 1000000
                const fecha = dayjs(fechaInput.seconds * 1000 + milisegundos)
                const tiempoFormateado = fecha.format('DD-MM-YYYY HH:mm')
                return tiempoFormateado;
        }
        const returnVisitaPendiente = async(data) => {
            setLoading(true)
            try {
                await setDoc(doc(db, "visitas_pendientes", String(data.id)), data)
                await deleteDoc(doc(db, "en_proceso", String(data.id)))
                setActualizar(!actualizar)
                setLoading(false)
                setCompleteVisitaScreen(false)
            } catch (error) {
                console.error(error)
            }
        }
    return(
        <>
            {(() =>{
                if(loading){
                    return(
                        <>
                        <div className="absolute w-screen h-screen bg-black opacity-50 top-0 left-0 z-20 flex justify-center items-center">
                        </div>
                        <AiOutlineLoading className="animate-spin absolute opacity-100 w-1/2 lg:left-80 lg:top-40 h-1/2 left-20 z-30 text-tertiary"/>
                        <div className="absolute w-screen h-screen bg-black opacity-50 top-0 left-0 z-0"></div>
                        </>
                    )
                }else{
                    return ""
                }
            })()}
        <div className="absolute w-screen h-screen bg-black opacity-50 top-0 left-0 z-10 flex justify-center items-center">
        </div>
        <form onSubmit={onSubmit} className="bg-primary w-3/4 h-4/7 lg:w-1/4 lg:inset-x-1/3 absolute z-10 left-10 top-[10%] rounded-3xl flex flex-col items-center py-2 gap-5">
            <button className="rounded-md hover:bg-quaternary self-end mr-2" onClick={() => {setCompleteVisitaScreen(false)}}><IoClose className="text-quinary hover:text-primary w-10 h-10"/></button>
            <h1 className="text-center text-tertiary text-xl">Datos de la visita</h1>
            <div className="text-quinary flex flex-col px-5 gap-2 text-sm">
                <span className="overflow-hidden"><strong>Nombres:</strong>{`${rowSelected.nombres}`} </span>
                <span><strong>Motivo:</strong>{`${rowSelected.motivo}`}</span>
                <span className="overflow-hidden"><strong>Direccion: </strong>{`${rowSelected.direccion}`}</span>
                <span><strong>Tecnico: </strong>{`${rowSelected.tecnico}`}</span>
                <span><strong>Inicio: </strong>{transformFecha(visitaRealizada.inicio_visita)}</span>
                {/* campos de instalacion */}
                {(() => {
                    const checkMotivo = (visitaRealizada.motivo === "NO TIENE INTERNET") || (visitaRealizada.motivo === "INTERNET INESTABLE")
                    if(checkMotivo){
                        return (
                          <>
                        <span><strong>Nodo: </strong>{`${rowSelected.nodo}`}</span>
                        <span><strong>Problema:</strong>
                            <select onChange={(e) => {setVisitaRealizada({...visitaRealizada, problema: e.target.value})}}>
                                <option></option>
                                {
                                    problemas.map((e, index) => (
                                    <option key={index} value={e}>{e}</option>
                                    ))
                                }
                            </select>
                        </span>
                        <span>Solucion: 
                            <select onChange={(e) => {setVisitaRealizada({...visitaRealizada, solucion: e.target.value, fin_visita: tiempoReal})}}>
                            <option></option>
                            {
                                (solucion.map((e, index) => (
                                <option key={index} value={e}>{e}</option>
                                )))
                            }
                            </select>
                        </span>
                        </>  
                        )
                    }else if(visitaRealizada.motivo === "INSTALACION"){
                        return(
                         <>
                        <span onChange={(e) => {setVisitaRealizada({...visitaRealizada, nodo: e.target.value, fin_visita: tiempoReal})}}><strong>Nodo: </strong>
                            <select>
                                <option></option>
                                {nodos.map((nodo, index) => (
                                    <option key={index} value={nodo}>{nodo}</option>
                                ))}
                            </select>
                        </span>
                        <span onChange={(e) => {setVisitaRealizada({...visitaRealizada, equipo: e.target.value})}}><strong>Equipo: </strong>
                            <select>
                                <option></option>
                                {equipos.map((equipo, index) => (
                                    <option key={index} value={equipo}>{equipo}</option>
                                ))}
                            </select>
                        </span>
                        {(() => {
                            if(visitaRealizada.conexion === "INALAMBRICO"){
                                return(
                                    <>
                                    <span><strong>LAN MAC: </strong><input onChange={(e) => {setVisitaRealizada({...visitaRealizada, lan_mac: e.target.value})}} type="text"/></span>
                                    <span><strong>SENIAL: </strong><input onChange={(e) => {setVisitaRealizada({...visitaRealizada, senial: e.target.value})}} type="text"/></span>
                                    <span><strong>SECTORIAL: </strong><input onChange={(e) => {setVisitaRealizada({...visitaRealizada, sectorial: e.target.value})}} type="text"/></span>
                                    <span><strong>ALTURA: </strong><input onChange={(e) => {setVisitaRealizada({...visitaRealizada, altura: e.target.value})}} type="text"/> mts</span>
                                    </>
                                )
                            }else{
                                return(
                                <>
                                  <span><strong>SERIAL: </strong><input onChange={(e) => {setVisitaRealizada({...visitaRealizada, serial: e.target.value})}} type="text"/></span>
                                    <span><strong>CABLE: </strong><input onChange={(e) => {setVisitaRealizada({...visitaRealizada, cable: e.target.value})}} type="number"/>mts</span>
                                    <span><strong>DBM: </strong><input onChange={(e) => {setVisitaRealizada({...visitaRealizada, dbm: e.target.value})}} type="text"/></span>
                                    <span><strong>CAJA: </strong><input onChange={(e) => {setVisitaRealizada({...visitaRealizada, caja: e.target.value})}} type="text"/></span>   
                                </>
                                )
                            }
                        })()}
                        </>   
                        )
                    } else if(visitaRealizada.motivo === "RETIRO"){
                        return(
                            <>
                                <span><strong>Nodo: </strong>{`${rowSelected.nodo}`}</span>
                                <span onChange={(e) => {setVisitaRealizada({...visitaRealizada, equipo: e.target.value})}}><strong>Equipo: </strong>
                                    <select>
                                        <option></option>
                                        {equipos.map((equipo, index) => (
                                            <option key={index} value={equipo}>{equipo}</option>
                                        ))}
                                    </select>
                                </span>
                                {(() => {
                            if(visitaRealizada.conexion === "INALAMBRICO"){
                                return(
                                    <>
                                    <span><strong>LAN MAC: </strong><input onChange={(e) => {setVisitaRealizada({...visitaRealizada, lan_mac: e.target.value})}} type="text"/></span>
                                    </>
                                )
                            }else{
                                return(
                                <>
                                  <span><strong>SERIAL: </strong><input onChange={(e) => {setVisitaRealizada({...visitaRealizada, serial: e.target.value})}} type="text"/></span>
                                    <span><strong>CAJA: </strong><input onChange={(e) => {setVisitaRealizada({...visitaRealizada, caja: e.target.value})}} type="text"/></span>   
                                </>
                                )
                            }
                        })()}
                            </>
                        )
                    }
                })()}
                <span><strong>Coordenadas: </strong><input onChange={(e) => {setVisitaRealizada({...visitaRealizada, coordenadas: e.target.value})}} type="text"/></span>
                <span><strong>Zona: </strong>
                    <select onChange={(e) => {setVisitaRealizada({...visitaRealizada, zona: e.target.value})}}>
                        <option></option>
                        <option value="RURAL">RURAL</option>
                        <option value="URBANA">URBANA</option>
                    </select>
                </span>
                <span><strong>Nota: </strong><input value={visitaRealizada.nota} onChange={(e) => setVisitaRealizada({...visitaRealizada, nota:e.target.value})}></input></span>
                
            </div>
                <p className="text-tertiary text-center">{(errorMessage)? "Todos los campos deben ser llenados":""}</p>
                <div className="w-full flex justify-around">
                <button className="rounded-md bg-quinary hover:bg-tertiary text-primary flex items-center justify-center text-xl w-1/4 " type='submit'><MdDoneAll className="h-3/5 w-3/5"/></button>
                <button onClick={() => returnVisitaPendiente(visitaRealizada)} className="rounded-md bg-tertiary hover:bg-tertiary text-primary flex items-center justify-center text-xl w-1/4 " type='button'><MdAssignmentReturn className="h-3/5 w-3/5"/></button>
                </div>
                
        </form>
        </>
        
    )
}

export {CompleteVisita}