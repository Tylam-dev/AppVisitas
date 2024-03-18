
import { IoIosLogOut } from "react-icons/io";
import { IoMdMenu } from "react-icons/io"
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
// import { Auth } from "../../Auth/Index";
const NavBar = ({setOnAside, onAside}) => {
    const navigate = useNavigate()
    const authContext = useContext(AuthContext)
    const salir = () => {
        signOut(auth).then(() => {
                navigate('/login')
              }).catch((error) => {

              });
    }
    return(
        <nav className="h-12 absolute z-20  w-full bg-quinary flex justify-between">
            <button onClick={() => setOnAside(!onAside)}className="flex justify-center w-14 text-primary hover:bg-quaternary">
                <IoMdMenu className="h-full w-10"/>
            </button>
            
            <div className="flex flex-row gap-5">
                <span className="flex items-center text-primary">{authContext.user.nombre}</span>
                <button 
                onClick={() => salir()}
                className="flex items-center justify-center gap-2 mr-4 text-primary text-xl hover:bg-quaternary">Salir <IoIosLogOut className="h-1/2 w-6" /></button>
            </div>
            
        </nav>
    )
}
export {NavBar}