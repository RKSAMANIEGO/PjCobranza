import ModalPago from 'react-modal'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
ModalPago.setAppElement("#root")

const ModalPagos = ({isOpen ,onClose,titleModal,codPrestamo,listarPagos,pagoEncontrado}) => {

    const [dataFormPagos,setDataFormPagos]=useState({montoPago:"",metodoPago:"efectivo",prestamo:{prestamoId:codPrestamo}})
    const [codPago,setCodPago]=useState(0);
    //FECHA ACTUAL
    const dateActual = new Date();
    const yearActual = dateActual.getFullYear();
    const monthActual = String(dateActual.getMonth() + 1).padStart(2,"0");
    const dayActual = String(dateActual.getDate()).padStart(2,"0");

    //OBTENIENDO LOS VALORES DEL FORM 
    const handlerInputForm=(e)=>{
        const{name,value} = e.target;
            setDataFormPagos((prevData)=>({
                ...prevData, 
                [name]:value
            }) );
    }

    //ENVIAR FORMULARIO 
    const handlerSendForm =async (e)=>{
        e.preventDefault();
        if(titleModal==="Nuevo"){
            const res = await fetchAddPago("http://localhost:8092/api/pagos",dataFormPagos);
            if(res){
                Swal.fire({
                    title: 'Pago realizado con éxito',
                    text:res.message,
                    icon: 'success',
                    background:"rgb(244,238,238)",
                    timer: 2000
                })
                listarPagos();
                clearForm();
            }
        }else{
            const res = await fetchUpdatePago(codPago,dataFormPagos);
            if(res){
                Swal.fire({
                    title: 'Pago actualizado',
                    text: 'Se ha actualizado el pago correctamente',
                    icon: 'success',
                    background:"rgb(244,238,238)",
                    timer:2000
                });
                listarPagos();
                clearForm();
            }

        }
    }

    useEffect(()=>{
        if(pagoEncontrado){
            setDataFormPagos({  
                montoPago:pagoEncontrado.monto_pago,
                metodoPago:pagoEncontrado.metodo_pago,
            })
            setCodPago(
                pagoEncontrado.pago_id
            )
        }
    },[pagoEncontrado])

    //FETCH REGISTRAR PAGO
    const fetchAddPago= async (url ,body)=>{
        const response = await fetch(url,{
            method:"POST", 
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${localStorage.getItem("token")}`

            },
            body:JSON.stringify(body)
        });
        if(response.status!==201){
            Swal.fire({
                title: 'Error',
                text: 'No se pudo registrar el pago'+response.statusText,
                icon: 'error',
                background:"rgb(244,238,238)",
                timer:2000
            });
            return;
        }
        const dataPagos =await response.json();
        return dataPagos;
    }

    // FETCH ACTUALIZAR PAGO 
    const fetchUpdatePago = async (idPago,body)=>{
        const response = await fetch(`http://localhost:8092/api/pagos/${idPago}`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                    },
                body:JSON.stringify(body)
            });
            if(response.status!==200){
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar el pago',
                    text: 'Error al actualizar el pago'+response.statusText,
                    background:"rgb(244,238,238)",
                    timer:2000
                })
            }
        const data = response.json();
        return data;
    }

    //LIMPIAR LOS CAMPOS DEL FORM
    const clearForm=()=>{
        setDataFormPagos((prevData) => ({
            ...prevData,
            montoPago:""
        }))
    }


    return (
        <ModalPago
            isOpen = {isOpen}
            onRequestClose={onClose}
            style={{
                content:{
                    top:"50%",
                    left:"50%",
                    transform:"translate(-50%,-50%)",
                    padding:"40px",
                    background:"rgb(236, 234, 234)",
                    color:"rgb(82, 79, 79)",
                    borderRadius:"6px",
                    border:"none",
                    width:"33   0px",
                    height:"400px"    
                },
                overlay:{
                    backgroundColor:"rgba(0, 0, 0, 0.5)",
                }
            }}
        >
            <section className='container-modal-customers'>
                <h2 className='title-modal-customer'>{titleModal} Pago</h2>
                <form onSubmit={handlerSendForm}>
                    <input type='number' name="montoPago" placeholder='Ingrese Monto' value={dataFormPagos.montoPago} onChange={handlerInputForm} required/>

                    {
                    titleModal === "Nuevo" ? <input type='date' value={`${yearActual}-${monthActual}-${dayActual}`} disabled/>
                    :    <input type='date' value={`${yearActual}-${monthActual}-${dayActual}`} disabled/>
                    }
                    
                    <select name="metodoPago" value={dataFormPagos.metodoPago} onChange={handlerInputForm}>
                        <option value='efectivo'>Efectivo</option>
                        <option value="transferencia">Transferencia</option>
                        <option value="tarjeta">Tarjeta</option>
                    </select>

                    <section className='wrapper-modal-btn'>
                        {titleModal==="Nuevo" ? <button type='submit' className='btn add'>Nuevo</button> 
                        :<button type='submit' className='btn add'>Editar</button> }
                        
                        <button type='submit' className='btn exit' onClick={onClose}>Salir</button>
                    </section>
                    
                </form>
            </section>
        </ModalPago>
    )
}
ModalPagos.propTypes={
    isOpen:PropTypes.bool.isRequired,
    onClose:PropTypes.func.isRequired,
    titleModal:PropTypes.string.isRequired,
    codPrestamo:PropTypes.string,
    listarPagos:PropTypes.func,
    pagoEncontrado:PropTypes.object
}
export default ModalPagos
