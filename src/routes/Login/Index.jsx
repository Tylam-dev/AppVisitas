import { useContext, useEffect, useState } from "react"
import { auth } from "../../firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../Context/AuthContext"
const Login = () => {
    const navigate = useNavigate()
    const authContext = useContext(AuthContext)
    useEffect(() => {
        if(authContext.isAuth === true){
            navigate('/home')
        }
    },[])
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [isWrongUser, setIsWrongUser] = useState(false)
    function LogInAccount(event){
        event.preventDefault()
        signInWithEmailAndPassword(auth, user, password)
        .then((userCredential) => {
            setIsWrongUser(false)
            authContext.getUser()
            navigate('/home')
        })
        .catch((error) => {
            setIsWrongUser(true)
        });
    }
    return(        
        <>
        <div className="bg-[#FAE1C0] w-screen h-screen absolute z-0 flex justify-center items-center">
            <form onSubmit={LogInAccount} className="flex flex-col justify-center gap-5 items-center border-2 h-1/3 w-3/4 pt-2 rounded-3xl bg-[#332D27] lg:w-2/5 lg:h-2/5">
                <div className="flex space-x-2">
                    <span className="text-[#FAE1C0] text-md lg:text-3xl">Usuario: </span><input onChange={e => {setUser(e.target.value)}} className="border-2 rounded-md" type="text" />
                </div>
                <div className="flex space-x-2">
                    <span className="text-[#FAE1C0] text-md lg:text-3xl">Contrasenia: </span><input onChange={e => {setPassword(e.target.value)}} className="border-2 rounded-md" type="password" />
                </div>
                {(isWrongUser)? <p className="text-[#E30224]">Usuario o constrasenia incorrecta</p>:""}
                <button className="bg-[#8A0015] text-[#FAE1C0] h-10 w-40 lg:w-1/2 lg:mt-4 rounded-xl hover:bg-[#E30224] text-xl" type="submit">Iniciar Sesion</button>
            </form>
        </div>
        </>
        
    )
}

export{Login}