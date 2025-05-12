import { Outlet, useLocation } from "react-router-dom"
import Sidebar from "../Components/Sidebar"
import HeaderDashboard from "../Components/HeaderDashboard"
import { useEffect, useState } from "react"
import '../App.css'

const DashBoard = () => {
    
    const [titlePage, setTitlePage]= useState("Inicio");
    const [subTitlePage,setSubTitlePage]=useState('');

    const location = useLocation();


    useEffect(()=>{
        if(location.pathname === "/dashboard"){
            setTitlePage("Inicio");
            setSubTitlePage("");
        }
        if(location.pathname === "/dashboard/clientes"){
            setTitlePage("Clientes");
            setSubTitlePage("");
        }
        if(location.pathname === "/dashboard/prestamos"){
            setTitlePage("Prestamos");
            setSubTitlePage("");
        }
        if(location.pathname === "/dashboard/pagos"){
            setTitlePage("Prestamos");
            setSubTitlePage(" >> Pagos");
        }
    },[location])
    return (
        <section className="container-dashboard-main">
            <Sidebar/>
            <section className="container-dashboard-content">
                <HeaderDashboard titlePage={titlePage+subTitlePage}/>
                <div className="container-dashboard-description">
                    <Outlet/>                  
                </div>   
            </section>
        </section>
    )
}

export default DashBoard
