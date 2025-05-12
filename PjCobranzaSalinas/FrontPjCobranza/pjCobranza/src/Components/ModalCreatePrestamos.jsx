import ModalPrestamo from 'react-modal'
import PropTypes from 'prop-types'
import { useEffect } from 'react';
import { useState } from 'react';
ModalPrestamo.setAppElement("#root")
import Swal from 'sweetalert2';
const ModalCreatePrestamos = ({ isOpen, onClose,titleModal,listaPrestamo,prestamoById}) => {

    const [dataClient, setDataClient] = useState([]);
    const [dataFormPrestamo,setDataFormPrestamo]=useState({monto:"",tiempo:24,tasaInteres:20.00,cliente:{clienteId:""},estado:"pendiente"})
    const [fechaPrestamo,setFechaPrestamo]=useState({fecha_inicio:"",fecha_vencimiento:""});
    const [codPrestamo,setCodPrestamo]=useState(0);
    //FECHA ACTUAL
    const fecha = new Date();

    //FECHA VENCIMIENTO
    const fechaV = new Date();
    fechaV.setDate(fechaV.getDate() + 24);

    const year= fechaV.getFullYear();
    const month=String(fechaV.getMonth() + 1).padStart(2,'0');
    const day=String(fechaV.getDate()).padStart(2,'0')
    const fechaVencimiento = `${year}-${month}-${day}`;

    //CAPTURAR LOS VALORES DE LOS INPUT DEL FORM 
    const handlerInputForm = (e)=>{
        const {name , value} = e.target;

        if(name === "cliente"){
            setDataFormPrestamo((prevData)=>({
                ...prevData,
                "cliente":{
                    ...prevData.cliente,
                    "clienteId":value
                }
            }) )
        }else{
            setDataFormPrestamo((prevData)=>({
                ...prevData, [name]:value
            }) )
        }

    }

    //ENVIAR FORMULARIO
    const handlerSendForm = async(e)=>{
        e.preventDefault();

        if(titleModal==="Nuevo"){
            const responseData = await fetchAddPrestamo("http://localhost:8092/api/prestamo",dataFormPrestamo);
            if(responseData){
                Swal.fire({
                    title: 'Prestamo Realizado',
                    text: 'Prestamo Realizado con exito',
                    icon: 'success',
                    background:"rgb(244,238,238)",
                    timer: 2000 });
                listaPrestamo();
                limpiarForm();
            }
        }else{
            const responseData = await fetchPutPrestamo("http://localhost:8092/api/prestamo/",codPrestamo,dataFormPrestamo);
            if(responseData){
                Swal.fire({
                    title: 'Prestamo Actualizado',
                    text: 'Prestamo Actualizado con exito',
                    icon: 'success',
                    background:"rgb(244,238,238)",
                    timer:2000
                });
                listaPrestamo();
                //limpiarForm();
            }
        }

    }

    //FETCH LIST DATA CLIENTE 
    const fetchListClient = async() => {
        const response = await fetch("http://localhost:8092/api/cliente",{
            method: "GET",
            headers:{
                "Content-Type":"application/json",
                authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
        if(!response.ok){
            throw new Error("Ocurrio un Error al Listar Los Clientes");
        }
        const data = await response.json()
        setDataClient(data);
    }

    //FETCH POST 
    const fetchAddPrestamo = async (url,body)=>{
        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                authorization:`Bearer ${localStorage.getItem("token")}`
            },
            body:JSON.stringify(body)
        });
        if(response.status !== 201){
            return Swal.fire({
                title: 'Error',
                text: 'Ocurrio un Error al Realizar el Prestamo',
                icon: 'error',
                background:"rgb(244,238,238)",
                timer:2000
            });
        }
        const data = await response.json();
        return data;
    }

    //FETCH PUT
    const fetchPutPrestamo = async(url,codPrestamo,body)=>{
        const response = await fetch(url+codPrestamo,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                authorization:`Bearer ${localStorage.getItem("token")}`
            },
            body:JSON.stringify(body)
        });
        if(!response.ok){
            Swal.fire({
                icon:"error",
                title:"Error Al Actualizar",
                text:"Ocurrio un Error al Actualizar el Prestamo",
                background:"rgb(244,238,238)",
                timer:2000,
            })
            return ;
        }
        const data = await response.json();
        return data;
    };

    //---
    
    useEffect(()=>{
        if(prestamoById){
            setDataFormPrestamo({
                monto: prestamoById.monto || "",
                tiempo:prestamoById.tiempo || 24,
                tasaInteres:prestamoById.tasa_interes || 20,
                cliente:{
                    clienteId:prestamoById.cliente_id || ""
                },
                estado:prestamoById.estado || "pendiente"
            });
            setFechaPrestamo({
                fecha_inicio:prestamoById.fecha_inicio || "",
                fecha_vencimiento:prestamoById.fecha_vencimiento || ""
            });
            setCodPrestamo(prestamoById.prestamo_id || 0);
        }
    },[prestamoById])

    //----
    useEffect(()=>{
        fetchListClient();
    },[])

    //LIMPIAR FORMULARIO
    const limpiarForm = () => {
        setDataFormPrestamo(({
            monto: "",
            tiempo:24,
            tasaInteres:20.00,
            cliente: {
                clienteId:""
            },
            estado:"pendiente"
        }))
    }   

    return (
        <ModalPrestamo
            className="modalPrestamos"
            overlayClassName="modalPrestamosOverlay"
            isOpen = {isOpen}
            onRequestClose = {onClose}
            >
            <section className='container-modal-customers'>
                <h2 className='title-modal-customer'>{titleModal} Prestamo</h2>
                <form onSubmit={handlerSendForm}>


                {titleModal==="Nuevo" ? 
                    <select className='cbx-customers' name="cliente" value={dataFormPrestamo.cliente.clienteId} onChange={handlerInputForm}>
                        <option value="" disabled>Seleccione un cliente</option>
                        {dataClient?.map((cliente)=> (
                            <option key={cliente.clienteId} value={cliente.clienteId}>
                                {`${cliente.nombre} ${cliente.apellido}`}
                            </option>        
                        ))}
                    </select>
                :
                    <select className='cbx-customers' name="cliente" value={dataFormPrestamo.cliente.clienteId} onChange={handlerInputForm} disabled>
                        <option value="" disabled>Seleccione un cliente</option>
                        {dataClient?.map((cliente)=> (
                        <option key={cliente.clienteId} value={cliente.clienteId}>
                        {`${cliente.nombre} ${cliente.apellido}`}
                        </option>        
                        ))}
                    </select>
                }

                    <section>
                        <label>
                            <input type='number' name="monto" placeholder='Ingrese Monto' value={dataFormPrestamo.monto} onChange={handlerInputForm}  required/> Soles
                        </label>
                        
                        <label>
                            <input type='number'name="tasaInteres" placeholder='Ingrese Taza Interes %' value={dataFormPrestamo.tasaInteres} onChange={handlerInputForm}/> %
                        </label>
                        
                    </section>

                    <section>
                        <label>
                        <input type='number' name="tiempo" placeholder='Ingrese los Dias' value={dataFormPrestamo.tiempo} onChange={handlerInputForm}/>
                        Dias
                        </label>                     
                        {titleModal==="Nuevo" ? <input type='date' value={fecha.toISOString().split('T')[0]} readOnly/> : <input type='date' value={fechaPrestamo.fecha_inicio} readOnly/> }
                        
                        {titleModal==="Nuevo" ? <input type='date' value={fechaVencimiento} readOnly/> : <input type='date' value={fechaPrestamo.fecha_vencimiento} readOnly/>  }
                    </section>

                    {titleModal==="Nuevo" ?
                    <select name="estado" value={dataFormPrestamo.estado} onChange={handlerInputForm} disabled>
                        <option value="pendiente">Pendiente</option>
                        <option value="pagado">Pagado</option>
                    </select>
                    :
                    <select name="estado" value={dataFormPrestamo.estado} onChange={handlerInputForm}>
                        <option value="pendiente">Pendiente</option>
                        <option value="pagado">Pagado</option>
                    </select>
                    }
                    <section className='wrapper-modal-btn'>
                        {titleModal==="Nuevo" ?
                        <button type='submit' className='btn add'><i className="fa-solid fa-user-plus"></i> Agregar</button> :
                        <button type='submit' className='btn add'><i className="fa-solid fa-pen-to-square"></i> Actualizar</button>
                        }
                    </section>
                    
                </form>
                <label className='closeModal' onClick={onClose}> &#215; </label>
            </section>
        </ModalPrestamo>
    )
}
ModalCreatePrestamos.propTypes={
    isOpen:PropTypes.bool.isRequired,
    onClose:PropTypes.func.isRequired,
    titleModal:PropTypes.string.isRequired,
    listaPrestamo:PropTypes.func,
    prestamoById:PropTypes.object
}

export default ModalCreatePrestamos
