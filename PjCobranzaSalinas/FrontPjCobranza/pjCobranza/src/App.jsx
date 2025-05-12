import './App.css'
import Login from './Page/Login'
import DashBoard from './Page/DashBoard'
import DashboardHome from './Components/DashboardHome'
import DashBoardCustomer from './Components/DashBoardCustomer'
import {BrowserRouter  as Router, Routes, Route } from 'react-router-dom'
import DashboardPrestamo from './Components/DashboardPrestamo'
import DashboardPago from './Components/DashboardPago'
import PrivateRoute from './utils/PrivateRoute'


function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element= {<Login/>}/>

        <Route path='/dashboard' element={
          <PrivateRoute>
              <DashBoard/>
          </PrivateRoute>
          }>

            <Route index  element={<DashboardHome/>} />
            <Route path="clientes" element={<DashBoardCustomer/>} />
            <Route path="prestamos" element={<DashboardPrestamo/>} />
            <Route path="pagos" element={<DashboardPago/>}/>

        </Route>
      </Routes>
    </Router>
  )
}

export default App
