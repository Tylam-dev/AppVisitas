import { useEffect, useState } from "react"
import { db } from "../../firebase"
import { collection, getDocs } from "firebase/firestore"
import { getCoreRowModel, useReactTable, flexRender, getFilteredRowModel, getSortedRowModel,getPaginationRowModel } from "@tanstack/react-table"
import dayjs from "dayjs"
import { IoMdRefresh } from "react-icons/io";
import { MdOutlineKeyboardArrowUp, MdKeyboardArrowDown, MdKeyboardArrowRight,MdKeyboardArrowLeft } from "react-icons/md";
import { VisitaInfo } from "../VisitaInfo/Index"

const VisitasRealizadasTable = () => {
    const [actualizar, setActualizar] = useState(false)
    const [rowSelected, setRowSelected] = useState({})
    const [infoDataScreen, setInfoDataScreen] = useState(false)
    const [filtering, setFiltering] = useState('')
    const [sorting, setSorting] = useState([])
    const [data, setData] = useState([])
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    })
    useEffect(() => {
        const fetchData = async () => {
            try {
                const request = await getDocs(collection(db,"visitas_realizadas"))
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
            header:'FECHA DE VISITA',
            accessorFn: row => {const timestamp = row.fin_visita;
                const milisegundos = timestamp.nanoseconds / 1000000
                const fecha = dayjs(timestamp.seconds * 1000 + milisegundos)
                const tiempoFormateado = fecha.format('DD-MM-YYYY HH:mm')
                return tiempoFormateado;
                }
        },
        {
            header: 'NOMBRES',
            accessorKey: 'nombre'
        },
        {
            header: "DIRECCION",
            accessorKey: 'direccion'
        },
        {
            header: "PROBLEMA",
            accessorKey: 'problema'
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
            header: 'VISITA',
            accessorFn: row => (row.visita)? "SI":"NO"
        },
        {
            header: 'HORA DE INICIO',
            accessorFn: row => {
                if(row.inicio_visita === null){
                    return null
                }else{
                    const timestamp = row.inicio_visita;
                    const milisegundos = timestamp.nanoseconds / 1000000
                    const fecha = dayjs(timestamp.seconds * 1000 + milisegundos)
                    const tiempoFormateado = fecha.format('DD-MM-YYYY HH:mm')
                    return tiempoFormateado; 
                }
            
            }
        },
        {
            header: 'HORA DE TERMINO',
            accessorFn: row => {
                if(row.fin_visita === null){
                    return null
                }else{
                    const timestamp = row.fin_visita;
                    const milisegundos = timestamp.nanoseconds / 1000000
                    const fecha = dayjs(timestamp.seconds * 1000 + milisegundos)
                    const tiempoFormateado = fecha.format('DD-MM-YYYY HH:mm')
                    return tiempoFormateado;
                }
                }
        },
        {
            header: 'CONEXION',
            accessorKey: 'conexion'
        },
        {
            header: 'TECNICOS',
            accessorKey: 'tecnicos'
        }
    ]
    const table = useReactTable({
        data, 
        columns, 
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state:{
            pagination,
            sorting,
            globalFilter: filtering
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
        onPaginationChange: setPagination
    })
    return(
        <>
        {(infoDataScreen)? <VisitaInfo setInfoDataScreen={setInfoDataScreen} rowSelected={rowSelected}/>:""}
        <div className="w-full h-full">
            <div className="w-full max-h-3/4 flex justify-between">
                <input type="text" value={filtering} onChange={(e) => {setFiltering(e.target.value)}} placeholder="Buscar" className="self-center focus:outline-tertiary rounded-md border-quinary border-2"/>
                <button className="rounded-md hover:bg-quaternary" onClick={() => {setActualizar(!actualizar)}}><IoMdRefresh className="w-10 h-10 text-quinary hover:text-primary  hover:animate-spin "/></button>
            </div>
            
            <table className="w-full max-h-3/4 text-xs border-collapse border-quinary border-solid border-2 text-center">
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    
                        <tr  key={headerGroup.id} >
                            {
                                headerGroup.headers.map(header => {
                                    const colSiempreShow = <th className={"bg-quinary text-primary"} key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                            >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {
                                            {asc: <MdOutlineKeyboardArrowUp className="w-1/3 h-1/3"/>, desc: <MdKeyboardArrowDown className="w-1/3 h-1/3"/>}[header.column.getIsSorted() ?? null]
                                        } 
                                    </th>
                                     const colNoSiempreShow = <th className={"bg-quinary text-primary hidden lg:table-cell"} key={header.id}
                                     onClick={header.column.getToggleSortingHandler()}
                                             >
                                         {
                                            flexRender(header.column.columnDef.header, header.getContext())
                                        }
                                        {
                                            {asc: <MdOutlineKeyboardArrowUp className="w-1/3 h-1/3"/>, desc: <MdKeyboardArrowDown className="w-1/3 h-1/3"/>}[header.column.getIsSorted() ?? null]
                                        } 
                                     </th>
                                    switch (header.id) {
                                        case "id":
                                            return(colNoSiempreShow);
                                        case "direccion":
                                            return(colNoSiempreShow);
                                        case "telefono":
                                            return(colNoSiempreShow);
                                        case "HORA DE INICIO":
                                            return(colNoSiempreShow);
                                        case "HORA DE TERMINO":
                                            return(colNoSiempreShow);
                                        case "conexion":
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
                <tbody className="" >
                {
                    table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="hover:bg-quaternary hover:text-primary even:bg-[#BFAA8F] even:text-quinary" onClick={()=>{setRowSelected({...rowSelected, ...row.original}), setInfoDataScreen(true)}}>
                            {row.getVisibleCells().map((cell) => {
                                const cellSiempreShow = <td className="max-w-16 h-12 truncate" key={cell.id}>
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
                                    case "HORA DE INICIO":
                                        return(cellNoSiempreShow);
                                    case "HORA DE TERMINO":
                                        return(cellNoSiempreShow);
                                    case "telefono":
                                        return(cellNoSiempreShow);
                                    case "conexion":
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
            <div className="flex justify-center">
                <button className="flex justify-center items-center w-1/6" onClick={()=> table.previousPage()} disabled={!table.getCanPreviousPage()}><MdKeyboardArrowLeft className="h-10 w-10" /></button>
                <p className="flex justify-center items-center">{`${pagination.pageIndex} / ${table.getPageCount() - 1}`}</p>
                <button className="flex justify-center items-center w-1/6" onClick={()=> table.nextPage()} disabled={!table.getCanNextPage()}><MdKeyboardArrowRight className="h-10 w-10"/></button>
            </div>
        </div>
        </>
    )
}
export {VisitasRealizadasTable}