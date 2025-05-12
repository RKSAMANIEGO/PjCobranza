import { useState } from 'react'
import './StyleContent.css'
import PropTypes from 'prop-types'

const HeaderSearch = ({tipo, enviarDashCustomer,enviarDashPrestamo,enviarDashPagos,recibirDataSearch, isExported}) => {

    const [isEnableModal, setEnableModal] = useState(false)
    const [search, setSearch] = useState('')


    const handlerBtnRegistrar = ()=>{
        console.log(isEnableModal)
        setEnableModal(true)

        if(tipo==="clientes"){
            enviarDashCustomer(true)
        }
        if(tipo==="prestamos"){
            enviarDashPrestamo(true)
        }
        if(tipo==="pagos"){
            enviarDashPagos(true)
        }
    }

return (
    <section className="wrapper-customers-header">

        <section className="wrapper-customers-button">
            <button  onClick={handlerBtnRegistrar} ><i className="fa fa-plus" aria-hidden="true"></i> Registrar</button>
            <button onClick={isExported}><i className="fa fa-download" aria-hidden="true"></i> Exportar</button>
        </section>

        <label> 
            {tipo === "clientes" &&  <input type="text" placeholder="Buscar por Cliente ó Dni" value={search} onChange={(e)=>setSearch(e.target.value)} />}
            {tipo === "prestamos" && <input type="text" placeholder="Buscar por Cliente o Estado" value={search} onChange={(e)=>setSearch(e.target.value)}/>}
            {tipo === "pagos" && <input type="date" value={search} onChange={(e)=>setSearch(e.target.value)} />}  
            <i className="fa fa-search" aria-hidden="true" onClick={ ()=> recibirDataSearch(search)} ></i> 
        </label>
    </section>
)
}
HeaderSearch.propTypes={
    enviarDashCustomer:PropTypes.func,
    enviarDashPrestamo:PropTypes.func,
    enviarDashPagos:PropTypes.func,
    tipo:PropTypes.oneOf(["clientes","prestamos","pagos"]).isRequired,
    recibirDataSearch:PropTypes.func,
    isExported:PropTypes.func
}

export default HeaderSearch
