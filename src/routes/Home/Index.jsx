import { useState, useEffect, useContext } from "react"
import { NavBar } from "../../components/NavBar/Index"
import { Aside } from "../../components/Aside/Index"
import { Outlet, useParams } from "react-router-dom"
import { AuthContext } from "../../Context/AuthContext"
import { AiOutlineLoading } from "react-icons/ai";
const Home = () => {
    const authContext = useContext(AuthContext)
    let {slug} = useParams()
    const [onAside, setOnAside] = useState(false)
    
    return(
        <>
        {(() =>{
            if(authContext.loadingUser){
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
        <NavBar setOnAside={setOnAside} onAside={onAside}/>
        <Aside onAside={onAside} setOnAside={setOnAside}/>
        <div 
        onClick={() => setOnAside(false)}
        className="bg-[#FAE1C0] w-screen h-screen absolute z-0">
        <Outlet/>
        </div>
        </>
    )
}
export {Home}