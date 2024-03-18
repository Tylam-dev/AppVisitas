import { useState, useEffect } from "react"
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { getCoreRowModel, useReactTable, flexRender, getFilteredRowModel, getSortedRowModel, getPaginationRowModel } from "@tanstack/react-table"
import dayjs from "dayjs"
import { InstalacionInfo } from "../InstalacionInfo/Index";
import { MdOutlineKeyboardArrowUp, MdKeyboardArrowDown, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { IoMdRefresh} from "react-icons/io";

const InstalacionesTable = () => {
    const [actualizar, setActualizar] = useState(false)
    const [data, setData] = useState([])
    const [rowSelected, setRowSelected] = useState({})
    const [filtering, setFiltering] = useState('')
    const [sorting, setSorting] = useState([])
    const [infoDataScreen, setInfoDataScreen] = useState(false)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    })
    useEffect(() => {
        const fetchData = async () => {
            try {
                const request = await getDocs(collection(db,"instalaciones"))
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
                const tiempoFormateado = fecha.format('DD-MM-YYYY')
                return tiempoFormateado;
                }
        },
        {
            header:'FECHA DE INSTALACION',
            accessorFn: row => {const timestamp = row.fin_visita;
                const milisegundos = timestamp.nanoseconds / 1000000
                const fecha = dayjs(timestamp.seconds * 1000 + milisegundos)
                const tiempoFormateado = fecha.format('DD-MM-YYYY')
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
            header: "EQUIPO",
            accessorKey: 'equipo'
        },
        {
            header: "TECNICO",
            accessorKey: 'tecnico'
        },
        {
            header: "TECNICO ACOMPANIANTE",
            accessorKey: 'tecnico_acompaniante'
        },
        {
            header: "VENDEDOR",
            accessorKey: 'vendedor'
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
            accessorKey: 'telefono'
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
        onGlobalFilterChange: setFiltering,
        onSortingChange: setSorting,
        onPaginationChange: setPagination
    })
    return(
        <>
        <div className="w-full h-full">
            {(infoDataScreen)? <InstalacionInfo setInfoDataScreen={setInfoDataScreen} rowSelected={rowSelected} setActualizar={setActualizar} actualizar={actualizar}/>:""}
            <div className="w-full flex justify-between gap-2">
                <input type="text" value={filtering} onChange={(e) => {setFiltering(e.target.value)}} placeholder="Buscar" className="self-center focus:outline-tertiary rounded-md border-quinary border-2"/>
                <div>
                    <button className="rounded-md hover:bg-quaternary" onClick={() => {setActualizar(!actualizar)}}><IoMdRefresh className="w-10 h-10 text-quinary hover:text-primary"/></button> 
                </div>
                
            </div>
            <table className="w-full max-h-4/5 text-xs border-collapse border-quinary border-solid border-2 text-center">
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} >
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
                                     const colNoSiempreShow = <th className={" bg-quinary text-primary hidden lg:table-cell"} key={header.id}
                                     onClick={header.column.getToggleSortingHandler()}
                                             >
                                         {flexRender(header.column.columnDef.header, header.getContext())}
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
                                        case "plan":
                                            return(colNoSiempreShow);
                                        case "tecnico_acompaniante":
                                            return(colNoSiempreShow);
                                        case "equipo":
                                            return(colNoSiempreShow);
                                        case "tecnico":
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
                        <tr key={row.id} className="hover:bg-quaternary hover:text-primary bg-primary even:bg-[#BFAA8F] even:text-quinary" onClick={()=>{setRowSelected({...rowSelected, ...row.original}), setInfoDataScreen(true)}}>
                            {row.getVisibleCells().map((cell) => {
                                const cellSiempreShow = <td className="max-w-12 h-12 truncate" key={cell.id}>
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
                                    case "telefono":
                                        return(cellNoSiempreShow);
                                    case "plan":
                                        return(cellNoSiempreShow);
                                    case "tecnico_acompaniante":
                                        return(cellNoSiempreShow);
                                    case "equipo":
                                        return(cellNoSiempreShow);
                                    case "tecnico":
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
export {InstalacionesTable}