import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext"
const Aside = ({onAside, setOnAside}) => {
    const authContext = useContext(AuthContext)
    const positionLi = 'h-16 hover:bg-[#8A0015] flex items-center justify-center'
    const navigate = useNavigate()
    return(
        <aside className={"w-60 bg-quinary h-screen absolute z-10 pt-16 transition transition-ease-in-out " + ((onAside)? "translate-x-0":"-translate-x-full")}>
            <ul className="text-center text-2xl text-primary">
                <li ></li>
                <li onClick={() => {setOnAside(false); navigate('/home/visitas')}} className={`${positionLi}`}>Visitas</li>
                {(() => {
                    if(authContext.user.type === "admin"){
                        return(
                            <>
                                <li onClick={() => {setOnAside(false); navigate('/home/instalaciones')}} className={`${positionLi}`}> Instalaciones</li>
                                <li onClick={() => {setOnAside(false); navigate('/home/retiros')}} className={`${positionLi}`}> Retiros</li>
                            </>
                            
                        )
                    }
                })()}
            </ul>
        </aside>
    )
}

export { Aside }