import { useState, useEffect } from "react"
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { getCoreRowModel, useReactTable, flexRender } from "@tanstack/react-table"
import dayjs from "dayjs"
import { IoMdRefresh } from "react-icons/io";
import { CompleteVisita } from "../CompleteVisita/Index";

const VisitasEnProcesoTable = () => {
    const [actualizar, setActualizar] = useState(false)
    const [data, setData] = useState([])
    const [rowSelected, setRowSelected] = useState({})
    const [completeVisitaScreen, setCompleteVisitaScreen] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const request = await getDocs(collection(db,"en_proceso"))
                const datos = []
                request.forEach(doc => datos.push(doc.data()))
                setData(datos)
            } catch (error) {
                console.error("Error fetching users:", error) 
            }
        }
        fetchData()
    },[actualizar])
    const columns = [
        {
            header: 'ID',
            accessorKey: 'id'
        },
        {
            header:'FECHA DEL REPORTE',
            accessorFn: row => {const timestamp = row.fecha_ingreso;
                const milisegundos = timestamp.nanoseconds / 1000000
                const fecha = dayjs(timestamp.seconds * 1000 + milisegundos)
                const tiempoFormateado = fecha.format('DD-MM-YYYY HH:mm')
                return tiempoFormateado;
                }
        },
        {
            header:'FECHA DE INICIO',
            accessorFn: row => {const timestamp = row.inicio_visita;
                const milisegundos = timestamp.nanoseconds / 1000000
                const fecha = dayjs(timestamp.seconds * 1000 + milisegundos)
                const tiempoFormateado = fecha.format('HH:mm')
                return tiempoFormateado;
                }
        },
        {
            header: 'NOMBRES',
            accessorKey: 'nombres'
        },
        {
            header: "DIRECCION",
            accessorKey: 'direccion'
        },
        {
            header: "MOTIVO",
            accessorKey: 'motivo'
        },
        {
            header: 'NODO',
            accessorKey: 'nodo',
        },
        {
            header: 'PLAN',
            accessorKey: 'plan'
        },
        {
            header: 'CONEXION',
            accessorKey: 'conexion'
        },
        {
            header: 'TELEFONO',
            accessorKey: 'telf'
        }
    ]
    const table = useReactTable({data , columns, getCoreRowModel: getCoreRowModel()})
    return(
        <>
        <div className="w-full h-full">
            {(completeVisitaScreen)? <CompleteVisita setCompleteVisitaScreen={setCompleteVisitaScreen} rowSelected={rowSelected} setActualizar={setActualizar} actualizar={actualizar}/>:""}
            <div className="w-full flex justify-end gap-2">
                <button className="rounded-md hover:bg-quaternary" onClick={() => {setActualizar(!actualizar)}}><IoMdRefresh className="w-10 h-10 text-quinary hover:text-primary"/></button>
            </div>
            <table className="w-full max-h-3/4 text-xs border-collapse border-quinary border-solid border-2 text-center">
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                        <tr  key={headerGroup.id} >
                            {
                                headerGroup.headers.map(header => {
                                    const colSiempreShow = <th className={"bg-quinary text-primary"} key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                     const colNoSiempreShow = <th className={"bg-quinary text-primary hidden lg:table-cell"} key={header.id}
                                             >
                                         {flexRender(header.column.columnDef.header, header.getContext())}
                                     </th>
                                    switch (header.id) {
                                        case "id":
                                            return(colNoSiempreShow);
                                        case "direccion":
                                            return(colNoSiempreShow);
                                        case "FECHA DEL REPORTE":
                                            return(colNoSiempreShow);
                                        case "plan":
                                            return(colNoSiempreShow);
                                        default:
                                            return(colSiempreShow);
                                    }
                                })
                            }
                        </tr>
                    ))
                }
                </thead>
                <tbody >
                {
                    table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="hover:bg-quaternary hover:text-primary even:bg-[#BFAA8F] even:text-quinary" onClick={()=>{setRowSelected({...rowSelected, ...row.original}), setCompleteVisitaScreen(true)}}>
                            {row.getVisibleCells().map((cell) => {
                                const cellSiempreShow = <td  key={cell.id} className="max-w-16  h-12 truncate">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                                const cellNoSiempreShow = <td  key={cell.id} className=" hidden lg:table-cell">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                                switch (cell.column.id) {
                                    case "id":
                                        return(cellNoSiempreShow);
                                    case "direccion":
                                        return(cellNoSiempreShow);
                                    case "FECHA DEL REPORTE":
                                        return(cellNoSiempreShow);
                                    case "plan":
                                        return(cellNoSiempreShow);
                                    default:
                                        return(cellSiempreShow);
                                }
                            })}
                        </tr>
                    ))
                }
            </tbody>
            </table>
        </div>
        </>
    )
}
export {VisitasEnProcesoTable}