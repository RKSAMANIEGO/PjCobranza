import { Link, useNavigate } from 'react-router-dom'
import './Sidebar.css'
import Logo from './Logo'

const Sidebar = ( ) => {
    const navega =useNavigate();

    //CERRAR SESSION
    const handlerIsClosedSession =()=>{
        localStorage.clear();
        navega('/');
    }
    return (
        <div className='wrapper-sidebar-main'>
            <input type='checkbox' id="hamburgueza"/>
            <label className='isOpenHamburgueza' htmlFor='hamburgueza' > &#8801; </label>

            <section className="container-sidebar">
                <Logo/>    
                <ul>
                    <li className='short' ><Link to="/dashboard"  className='dashboard home' style={{ color: 'white', textDecoration:"none"}}><div><i className="fa-solid fa-house"></i> Inicio</div> <hr/></Link></li>
                    <li className='mediana'><Link to="/dashboard/clientes" className='dashboard clientes' style={{ color: 'white',textDecoration:"none"}}><div><i className="fa-solid fa-users"></i> Clientes</div><hr/></Link></li>
                    <li className='large' ><Link to="/dashboard/prestamos" className='dashboard prestamos' style={{ color: 'white',textDecoration:"none"}}><div><i className="fa-solid fa-money-bill"></i>Prestamos</div> <hr/></Link></li>
                </ul>
                <i className="fa-solid fa-right-from-bracket" onClick={handlerIsClosedSession}></i>
                <label className='isCloseHamburgueza' htmlFor='hamburgueza' > &#215; </label>
                
            </section>
        </div>
    )
}

export default Sidebar
