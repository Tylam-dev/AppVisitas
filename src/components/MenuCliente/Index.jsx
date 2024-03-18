
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { Timestamp, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import dayjs from "dayjs";
import { FaTools } from "react-icons/fa";
import { FaFolderClosed } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { AiOutlineLoading } from "react-icons/ai";

const MenuCliente = ({setMenuClienteScreen, rowSelected, setActualizar, actualizar, menuClienteScreen}) => {  
    
    const authContext = useContext(AuthContext)
    const tecnicos = ["EDGAR JIMENEZ", "LUIS ROSADO", "SERGIO ROMAN", "KEVIN HARO", "SOLO"]
    const problemas = [
        'ROUTER DANIADO','ONU DANIADA','ONU QUEMADA','ANTENA DANIADA','ANTENA QUEMADA','MALA FRECUENCIA','MAL ENGANCHADO','PROBLEMA GENERAL','EQUIPO DESALINEADO','FIBRA DANIADA','RESET',	'ENERGIA','CABLES MAL','MUCHOS CONECTADOS','QUERIA CAMBIO DE CONTRASENIA','CONTRASENIA','INTERNO','CABLE DANIADO','POE QUEMADO'
    ]
    const solucion = [
        'FRECUENCIA',	'SOLUCION GENERAL',	'ALINEACION',	'CAMBIO ROUTER',	'CAMBIO ONU',	'CAMBIO POE',	 'CONFIGURACION',	'ENERGIA',	'CAMBIO CABLE',	'ROUTER RESET',	'ANTENA RESET',	'CABLES CAMBIADOS',	'CAMBIO CONTRASENIA',	'INTERNO',	'CAMBIO DE ANTENA',	'CAMBIO DE SECTORIAL'
    ]
    const tiempoReal = Timestamp.fromDate(dayjs().$d)
    const [loading, setLoading] = useState(false)
    const [visitaNecesaria, setVisitaNecesaria] = useState(null)
    const [visitaTomada, setVisitaTomada] = useState({...rowSelected})
    const [errorMessage, setErrorMessage] = useState(false)
    const enviardatos = (event) => {
        event.preventDefault()
        if(checkEmptyInput()){
            sendData(visitaTomada)
        }else{
            setErrorMessage(true)
        }
    }
    const sendData = async(data) => {
        setLoading(true)
        if(visitaNecesaria){
            try {
                await setDoc(doc(db, "en_proceso", String(data.id)), data)
                await deleteDoc(doc(db, "visitas_pendientes", String(data.id)))
                setActualizar(!actualizar)
                setLoading(false)
                setMenuClienteScreen(!menuClienteScreen)
            } catch (error) {
                console.error(error)
            }
        }else{
            try {
                await setDoc(doc(db, "visitas_realizadas", String(data.id)), data)
                await deleteDoc(doc(db, "visitas_pendientes", String(data.id)))
                setActualizar(!actualizar)
                setMenuClienteScreen(!menuClienteScreen)
            } catch (error) {
                console.error(error)
            }
        }
        
    }
    const checkEmptyInput = () => {
        if(visitaNecesaria){
            if(visitaTomada.tecnico_acompaniante === null){
                return false
            }else{return true}
        }else{
            const checkInputs = (visitaTomada.problema && visitaTomada.solucion && visitaTomada.zona)? true: false
            return checkInputs
        }
    }
    const deleteVisita = async() => {
        setLoading(true)
        try {
        await deleteDoc(doc(db, "visitas_pendientes", String(visitaTomada.id)))
        await deleteDoc(doc(db, "index_visitas", String(visitaTomada.id)))
        setActualizar(!actualizar)
        setLoading(false)
        setMenuClienteScreen(false)
        } catch (error) {
            console.error(error)
        }
        
    }
    const saveVisita = async(data) => {
        setLoading(true)
        try {
        await setDoc(doc(db, "visitas_pendientes", String(data.id)),data)
        setActualizar(!actualizar)
        setLoading(false)
        setMenuClienteScreen(false)
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
                    <AiOutlineLoading className="animate-spin absolute opacity-100 w-1/2 h-1/2 left-20 z-30 lg:left-80 lg:top-40 text-tertiary"/>
                    <div className="absolute w-screen h-screen bg-black opacity-50 top-0 left-0 z-0"></div>
                    </>
                )
            }else{
                return ""
            }
        })()}
            <div className="absolute w-screen h-screen bg-black opacity-50 top-0 left-0 z-0">
            </div>
        <form onSubmit={enviardatos} className="bg-primary w-3/4 h-4/7  h-5/7 lg:w-1/4 lg:inset-x-1/3 absolute z-10 left-10 top-[10%] rounded-3xl flex flex-col items-center py-2 gap-5">
            <button className="rounded-md hover:bg-quaternary self-end mr-2" onClick={() => {setMenuClienteScreen(false)}}><IoClose className="text-quinary hover:text-primary w-10 h-10"/></button>

            <h1 className="text-center text-tertiary text-xl">{(visitaNecesaria)? "Estas seguro que quieres tomar este reporte?":"Estas seguro que el reporte no necesita visita?"}</h1>
            <p className="text-quaternary text-sm text-center">{(visitaNecesaria)? "Toma el reporte cuando te dirijas donde el cliente":"Si no necesita visita, llena los campos"}</p>
            <div className="text-quinary flex flex-col px-5 gap-2 text-sm w-full">
                <span className="overflow-hidden"><strong>Nombres: </strong>{`${rowSelected.nombres}`}</span>
                <span className="overflow-hidden"><strong>Direccion: </strong>{`${rowSelected.direccion}`}</span>
                <span><strong>Motivo: </strong>{`${rowSelected.motivo}`}</span>
                <span><strong>Visita: </strong> 
                    <select onChange={(e) => {
                        if(e.target.value === 'si'){
                            setVisitaNecesaria(true)
                            setVisitaTomada({...rowSelected, inicio_visita: tiempoReal, visita: true})
                        }else if(e.target.value === 'no'){
                            setVisitaNecesaria(false)
                            setVisitaTomada({...rowSelected, visita: false, fin_visita:tiempoReal})
                        }
                    }}>
                        <option ></option>
                        <option value="si">SI</option>
                        <option value="no">NO</option>
                    </select>
                </span>
                <span><strong>Nodo: </strong>{` ${rowSelected.nodo}`}</span>
                <span><strong>Telefono: </strong>{` ${rowSelected.telefono}`}</span>

                {(visitaNecesaria)? <span><strong>Tecnico Acompaniante</strong>
                    <select 
                    onChange={(e) => {setVisitaTomada({...visitaTomada, tecnico: authContext.user, tecnico_acompaniante: e.target.value })}}>
                        <option></option>
                        {tecnicos.map((e, index) => ( 
                            <option key={index} value={e}>{e}</option>
                        ))}
                    </select>
                </span>:''}
                {(visitaNecesaria)? 
                    '':<span>Problema: 
                    <select onChange={(e) => {setVisitaTomada({...visitaTomada, problema: e.target.value})}}>
                        <option></option>
                    {
                        (problemas.map((e, index) => (
                        <option key={index} value={e}>{e}</option>
                        )))
                    }
                    </select>
                </span>
                }
                {(visitaNecesaria)? '':<span>Solucion: 
                    <select onChange={(e) => {setVisitaTomada({...visitaTomada, solucion: e.target.value})}}>
                    <option></option>
                    {
                        (solucion.map((e, index) => (
                        <option key={index} value={e}>{e}</option>
                        )))
                    }
                    </select>
                    </span>
                }
                {(visitaNecesaria)? '':<span>Zona: 
                    <select onChange={(e) => {setVisitaTomada({...visitaTomada, zona: e.target.value})}}>
                        <option></option>
                        <option value="RURAL">RURAL</option>
                        <option value="URBANA">URBANA</option>
                    </select>
                    </span>
                }
                <span><strong>Nota: </strong><input type="text" value={visitaTomada.nota} onChange={(e) => {setVisitaTomada({...visitaTomada, nota: e.target.value})}}></input></span>
            </div>
                <p className="text-tertiary text-center">{(errorMessage)? "Todos los campos deben ser llenados":""}</p>
                <div className="flex justify-around w-full">
                    <button className="rounded-md bg-quinary hover:bg-tertiary text-primary flex items-center justify-center text-xl  hover:text-primary w-1/4" type='submit'>{(visitaNecesaria)? <FaTools className="h-3/4 w-1/2"/>:<FaFolderClosed className="h-3/4 w-1/2"/> }</button>
                    <button className="rounded-md bg-secondary hover:bg-tertiary text-primary flex items-center justify-center text-xl  hover:text-primary w-1/4" type="button" onClick={() => {saveVisita(visitaTomada)}}><FaSave className="h-full w-1/2"/></button>
                    <button className="rounded-md bg-tertiary hover:bg-tertiary text-primary flex items-center justify-center text-xl  hover:text-primary w-1/4" type="button" onClick={() => deleteVisita()}><MdDelete className="h-full w-1/2"/></button>
                </div>
                
        </form>
        </>
        
    )
}

export {MenuCliente}