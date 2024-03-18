import { createContext, useEffect, useState, useContext } from "react"
import { auth, db } from "../firebase"
import { onAuthStateChanged } from "firebase/auth"
import { Navigate } from "react-router-dom"
import { getDoc, doc } from "firebase/firestore"

const AuthContext = createContext()

const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState({})
    const [isAuth, setIsAuth] = useState(null)
    const [loadingUser, setLoadingUser] = useState(true)
    useEffect(() => {
        const checkLogging = async () => {
            try {
                await onAuthStateChanged(auth, (user) => {
                    if(user){
                        setIsAuth(true)
                        getUser()
                    }else{
                        setIsAuth(false)
                    }
                })
            } catch (error) {
                
            }
        }
        checkLogging()
    },[])
    const getUser = async() => {
        setLoadingUser(true)
        try{
            const currentUser = await auth.currentUser.email 
            const userData = await getDoc(doc(db, "usuarios", currentUser))
            const usuarioData = userData.data()
            setUser({...usuarioData})
            setLoadingUser(false)
        }catch(error){
            console.log(error)
        }
    }
    return (
        <AuthContext.Provider value={{isAuth, user, getUser, loadingUser}}>
            {children}
        </AuthContext.Provider>
    )
}

const AuthRoutes = (props) => {
    const context = useContext(AuthContext)
    if(context.isAuth === null){
        return(
            <>
            <h1>Cargando</h1>
            </>
        )
    }else if(context.isAuth === false){
        return (<Navigate to="/login"/>)
    }else if (context.isAuth){
        return props.children
    }

}

export {AuthContext, AuthContextProvider, AuthRoutes}