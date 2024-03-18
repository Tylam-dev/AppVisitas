import { Timestamp, collection, doc, setDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import dayjs from "dayjs";
import { FaAddressBook } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { AiOutlineLoading } from "react-icons/ai";

const CrearVisita = ({crearVisitaScreen, setCrearVisitaScreen, setActualizar, actualizar}) => {
    const tiempoReal = Timestamp.fromDate(dayjs().$d)
    const opciones = {
        motivo: ["RETIRO", "NO TIENE INTERNET", "INTERNET INESTABLE", "INSTALACION"],
        nodo: ["GUAYAQUIL", "LIBERTAD", "PLAYAS"],
        receptor: ["PABLO LINO", "CARLOS BARRERO"],
        vendedor: ["JULIO GOMEZ", "MARIA LOPEZ"],
        medio: ["CHAT", "LLAMADA", "OFICINA"],
        plan: ["BASICO 1", "BASICO 2"],
        conexion: ["FIBRA", "INALAMBRICO"],
        razon: ["NO DESEA EL SERVICIO"]
    }
    const createSelect = (op) => {
        const crearOpciones = () =>{
            return (op.map((e, index) => (
                <option key={index} value={e}>{e}</option>
            )))
        }
        switch (op) {
            case opciones.motivo:
                return(
                    <select onChange={(e) => {setVisitaData({...visitaData, motivo: e.target.value, fecha_ingreso: tiempoReal})}}>
                        <option value={null}></option>
                        {crearOpciones()}
                    </select>
                )
            case opciones.nodo:
                return(
                    <select onChange={(e) => {setVisitaData({...visitaData, nodo: e.target.value})}}>
                        <option value={null}></option>
                        {crearOpciones()}
                    </select>
                )
            case opciones.receptor:
                return(
                    <select onChange={(e) => {setVisitaData({...visitaData, receptor: e.target.value})}}>
                        <option value={null}></option>
                        {crearOpciones()}
                    </select>
                )
            case opciones.vendedor:
                return(
                    <select onChange={(e) => {setVisitaData({...visitaData, vendedor: e.target.value})}}>
                        <option value={null}></option>
                        {crearOpciones()}
                    </select>
                )
            case opciones.medio:
                return(
                    <select onChange={(e) => {setVisitaData({...visitaData, medio: e.target.value})}}>
                        <option value={null}></option>
                        {crearOpciones()}
                    </select>
                )
            case opciones.razon:
                return(
                    <select onChange={(e) => {setVisitaData({...visitaData, razon: e.target.value})}}>
                        <option value={null}></option>
                        {crearOpciones()}
                    </select>
                )
            case opciones.plan:
            return(
                <select onChange={(e) => {setVisitaData({...visitaData, plan: e.target.value})}}>
                    <option value={null}></option>
                    {crearOpciones()}
                </select>
            )
            case opciones.conexion:
            return(
                <select onChange={(e) => {setVisitaData({...visitaData, conexion: e.target.value})}}>
                    <option value={null}></option>
                    {crearOpciones()}
                </select>
            )
        }
    }
    const [errorMessage, setErrorMessage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [visitaData, setVisitaData] = useState({})
    const [hora, setHora] = useState("")
    const [fecha, setFecha] = useState("")
    useEffect(() => {
        const fechaData = new Date(`${fecha} ${hora}`)
        const df = Timestamp.fromDate(fechaData)
        setVisitaData({
            ...visitaData,
            fecha_reporte: df
        })
    },[hora,fecha])
    useEffect(() => {
        const getLength = async() => {
            try{
                const query = await getDocs(collection(db, 'index_visitas'))
                const idsDocumentos = []
                query.forEach((doc) => {
                    idsDocumentos.push(Number(doc.id))})
                setVisitaData({...visitaData, id: Math.max(...idsDocumentos) + 1})
            }
            catch(error){
                console.error(error)
            }
        }
        getLength()
    },[])
    const dataWillSend = (event) => {
        event.preventDefault()
        if(checkEmptyInput()){
            sendData(visitaData)
        }else{
            setErrorMessage(true)
        }
    }
    const sendData = async(data) => {
        setLoading(true)
        try {
            await setDoc(doc(db, "visitas_pendientes", String(data.id)), data)
            await setDoc(doc(db, "index_visitas", String(data.id)),{id: data.id})
            setActualizar(!actualizar)
            setLoading(false)
            setCrearVisitaScreen(!crearVisitaScreen)
        } catch (error) {
            console.error(error)
        }
        
    }
    const checkEmptyInput = () => {
        if(visitaData.motivo === "INSTALACION"){
            const check = (visitaData.conexion && visitaData.direccion && visitaData.fecha_reporte && visitaData.nombres && visitaData.motivo && visitaData.vendedor && visitaData.medio && visitaData.plan && visitaData.conexion)? true:false
            return check
        }else if(visitaData.motivo === "RETIRO"){
            const check = (visitaData.conexion && visitaData.direccion && visitaData.fecha_reporte && visitaData.nombres && visitaData.motivo && visitaData.nodo && visitaData.receptor && visitaData.medio && visitaData.plan && visitaData.conexion && visitaData.razon)? true:false
            return check
        }else{
            const check = (visitaData.conexion && visitaData.direccion && visitaData.fecha_reporte && visitaData.nombres && visitaData.motivo && visitaData.nodo && visitaData.receptor && visitaData.medio && visitaData.plan && visitaData.conexion)? true:false
            return check
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
                    <AiOutlineLoading className="animate-spin absolute opacity-100 w-1/2 h-1/2 left-20 lg:left-80 lg:top-40 z-30 text-tertiary"/>
                    <div className="absolute w-screen h-screen bg-black opacity-50 top-0 left-0 z-0"></div>
                    </>
                )
            }else{
                return ""
            }
        })()}
            <div className="absolute w-screen h-screen bg-black opacity-50 top-0 left-0 z-0">
        </div>
        <form onSubmit={dataWillSend} className="bg-primary w-3/4 h-5/7 lg:w-1/4 lg:inset-x-1/3 absolute z-10 rounded-3xl flex flex-col py-2 gap-4 top-[10%] left-12">
            <button onClick={() => {setCrearVisitaScreen(!crearVisitaScreen)}} className="rounded-md hover:bg-quaternary self-end mr-2" ><IoClose className="text-quinary hover:text-primary w-10 h-10"/></button>
            <h1 className="text-center text-tertiary text-3xl">Crear Visita</h1>
            <div className="text-quinary flex flex-col px-5 gap-2 text-md">
                <span><strong>Nombres: </strong><input onChange={(e) => {setVisitaData({...visitaData, nombres: e.target.value})}} type="text"/></span>

                <span><strong>Motivo: </strong>{createSelect(opciones.motivo)}</span>

                <span><strong>Direccion: </strong><input onChange={(e) => {setVisitaData({...visitaData, direccion: e.target.value})}} type="text"/></span>

                <span><strong>Fecha: </strong><input onChange={(e) => {setFecha(e.target.value)}} type="date"/><input onChange={(e) => {setHora(e.target.value)}} type="time"/></span>

                <span><strong>Medio: </strong>{createSelect(opciones.medio)}</span>

                <span><strong>Plan: </strong>{createSelect(opciones.plan)}</span>

                <span><strong>Conexion: </strong>{createSelect(opciones.conexion)}</span>

                <span><strong>Telefono: </strong><input onChange={(e) => {setVisitaData({...visitaData, telf: e.target.value})}} type="text"/></span>

                {(() => {
                    if(visitaData.motivo === "INSTALACION"){
                        return (<span><strong>Vendedor :</strong>{createSelect(opciones.vendedor)}</span>)
                    }else if(visitaData.motivo === "RETIRO"){
                        return(
                        <>
                            <span><strong>Nodo: </strong>{createSelect(opciones.nodo)}</span>
                            <span><strong>Receptor :</strong>{createSelect(opciones.receptor)}</span>
                            <span><strong>Razon :</strong>{createSelect(opciones.razon)}</span>
                        </>
                        )
                    }
                    else{
                        return(
                        <>
                        <span><strong>Nodo: </strong>{createSelect(opciones.nodo)}</span>
                        <span><strong>Receptor :</strong>{createSelect(opciones.receptor)}</span>
                        </>)
                    }
                })()}

                <span><strong>Nota: </strong><input value={visitaData.nota} onChange={(e) => {setVisitaData({...visitaData, nota: e.target.value})}} type="text"/> </span>
            </div>
            <p className="text-tertiary text-center">{(errorMessage)? "Todos los campos deben ser llenados":""}</p>
            <div className="w-full flex justify-center">
                <button className="rounded-md bg-quaternary hover:bg-tertiary text-primary flex items-center justify-center text-xl w-1/4 " type='submit'><FaAddressBook className="h-3/5 w-3/5"/></button>
            </div>
        </form>
        </>
        
    )
}

export {CrearVisita}