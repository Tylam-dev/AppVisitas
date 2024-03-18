import { useState, useEffect } from "react"
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { getCoreRowModel, useReactTable, flexRender, getFilteredRowModel, getSortedRowModel, getPaginationRowModel } from "@tanstack/react-table"
import { MenuCliente} from "../MenuCliente/Index"
import { CrearVisita } from "../CrearVisita/Index"
import dayjs from "dayjs"
import { MdOutlineKeyboardArrowUp, MdKeyboardArrowDown, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { IoMdRefresh, IoIosAdd} from "react-icons/io";

const VisitasPendientesTable = () => {
    const [actualizar, setActualizar] = useState(false)
    const [data, setData] = useState([])
    const [rowSelected, setRowSelected] = useState({})
    const [filtering, setFiltering] = useState('')
    const [sorting, setSorting] = useState([])
    const [menuClienteScreen, setMenuClienteScreen] = useState(false)
    const [crearVisitaScreen, setCrearVisitaScreen] = useState(false)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    })
    useEffect(() => {
        const fetchData = async () => {
            try {
                const request = await getDocs(collection(db,"visitas_pendientes"))
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
            {(menuClienteScreen)? <MenuCliente setMenuClienteScreen={setMenuClienteScreen} rowSelected={rowSelected} setActualizar={setActualizar} actualizar={actualizar} menuClienteScreen={menuClienteScreen}/>:""}
            {(crearVisitaScreen)? <CrearVisita setCrearVisitaScreen={setCrearVisitaScreen}setActualizar={setActualizar} crearVisitaScreen={crearVisitaScreen} actualizar={actualizar}/>:"" }
            <div className="w-full flex justify-between gap-2">
                <input type="text" value={filtering} onChange={(e) => {setFiltering(e.target.value)}} placeholder="Buscar" className="self-center focus:outline-tertiary rounded-md border-quinary border-2"/>
                <div>
                   <button className="rounded-md hover:bg-quaternary" onClick={() => {setCrearVisitaScreen(true)}}><IoIosAdd className="w-10 h-10 text-quinary hover:text-primary"/></button>
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
                        <tr key={row.id} className="hover:bg-quaternary hover:text-primary bg-primary even:bg-[#BFAA8F] even:text-quinary" onClick={()=>{setRowSelected({...rowSelected, ...row.original}), setMenuClienteScreen(true)}}>
                            {row.getVisibleCells().map((cell) => {
                                const cellSiempreShow = <td className="max-w-20 h-12 truncate" key={cell.id}>
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
export {VisitasPendientesTable}