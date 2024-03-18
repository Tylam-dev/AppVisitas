import { Login } from './Login/Index'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Home } from './Home/Index'
import { AuthRoutes, AuthContextProvider } from '../Context/AuthContext'
import { NotFound } from './NotFound/Index'
import { VisitasMenu } from '../components/VisitasMenu/Index'
import { RetirosMenu } from '../components/RetirosMenu/Index'
import {InstalacionesMenu } from '../components/InstalacionesMenu/Index'
function App() {
  return (
    <HashRouter>
      <AuthContextProvider>
        <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route path='/' element={<Navigate to="/home"/>}/>
            <Route path={'/home'} element={
              <AuthRoutes>
                <Home>
                </Home>
              </AuthRoutes>
            }>
              <Route path='visitas' element={<VisitasMenu/>}/>
              <Route path='instalaciones' element={<InstalacionesMenu/>}/>
              <Route path='retiros' element={<RetirosMenu/>}/>
            </Route>
          <Route path='*' element={<NotFound/>}/>
      </Routes>
      </AuthContextProvider>
    </HashRouter>
  )
}


export default App