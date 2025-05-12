import Modal from 'react-modal'
import PropTypes from 'prop-types'
import './StyleContent.css'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
Modal.setAppElement("#root")

const ModalCreateCustomer = ({isOpen,onClose,titleModal,updateClientList,dataClienteById}) => {

    const [dataCliente,setDataCliente]= useState({nombre:"",apellido:"",dni:"",correo:"",telefono:"",direccion:""});
    const [responseAddCliente, setResponseAddCliente] = useState(null);
    const [idCliente, setIdCliente]=useState(0);

    //FECHA ACTUAL
    const fechaActual = new Date();
    const yearActual = fechaActual.getFullYear();
    const monthActual =String(fechaActual.getMonth()+1).padStart(2,"0");
    const dayActual = String(fechaActual.getDate()).padStart(2,"0");
    //----------------

    //CAPTURAR LOS CAMBIOS DE LOS INPUT
    const handlerDataForm = (e) =>{
        const {name, value} = e.target;
        setDataCliente((prevData) => ({...prevData, [name]:value } ))
    }

     //ENVIAR FORMULARIO
    const handlerSendForm = async (e) => {
        e.preventDefault();

        if(titleModal === "Nuevo"){
            const response = await fetchAddClient("http://localhost:8092/api/cliente",dataCliente);
            if(response){
                Swal.fire({
                    title:"Cliente Registrado", 
                    text:"Cliente Registrado Correctamente", 
                    icon:"success",
                    background:"rgb(244,238,238)",
                    timer:2000
                });
                updateClientList();
                FormularioCliente();
            }
        }
        if(titleModal === "Actualizar"){
            const responsePut = await fetchPutClient("http://localhost:8092/api/cliente/",idCliente);
            if(responsePut){
                Swal.fire({
                    title:"Cliente Actualizado", 
                    text:"Registro Actualizado Correctamente", 
                    icon:"success",
                    background:"rgb(244,238,238)",
                    timer:2000
                });
                updateClientList();
            }
        }
    }

    useEffect(()=>{
        if(dataClienteById){
            setDataCliente({
                nombre:dataClienteById.nombre,
                apellido:dataClienteById.apellido,
                dni:dataClienteById.dni,
                correo:dataClienteById.correo,
                telefono:dataClienteById.telefono,
                direccion:dataClienteById.direccion
            });
            setIdCliente(dataClienteById.clienteId)
        }
    },[dataClienteById])


    //FETCH POST 
	const fetchAddClient = async (url,body) => {
			try {
				const response = await fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
					body: JSON.stringify(body),
				});
                if(response.status === 400){
                    const {nombre,apellido,dni,correo,telefono,message} = await response.json();
                    const values = [nombre, apellido, dni, correo, telefono, message].filter(value => value !== "" && value !== null && value !== undefined);
                    //alert(values.join(`\n`));
                    Swal.fire({
                        title: "Error",
                        text: "Error al registrar el cliente \n"+values.join("\n"),
                        icon: "error",
                        background: "rgb(244,238,238)",
                        timer: 2000
                    });

                    return;
                }

				const responseData = await response.json();
                setResponseAddCliente(responseData);
                console.log(responseAddCliente);
                return responseData;
			} catch (error) {
                console.error(error); 
                alert("No se pudo agregar al Cliente")}  
		};  

    //FETCH PUT
    
    const fetchPutClient =async(url,idCliente)=>{
        const response = await fetch(url+idCliente,{
            method:"PUT", 
            headers:{
                "Content-Type":"application/json", 
                Authorization :`Bearer ${localStorage.getItem("token")}`
            },
            body:JSON.stringify(dataCliente)
        });
        if(!response.ok){
            return Swal.fire({
                title:"Actualización Fallida",
                text:response.statusText,
                icon:"error",
                background:"rgb(244, 238, 238)",
                timer:2000
            })
        }
        const data =await response.json();
        return data;
    }


    // LIMPIAR LOS CAMPOS 
    
    const FormularioCliente = () => {
        setDataCliente(({
            nombre: "",
            apellido: "",
            correo: "",
            dni:"",
            telefono: "",
            direccion: ""
        }) 
    )};


    return (
        <Modal     
            className="modalClientes"
            overlayClassName="modalClientesOverlay"
            isOpen={isOpen}
            onRequestClose={onClose}
        >
            <section className='container-modal-customers'>
                <h2 className='title-modal-customer'>{titleModal} Cliente</h2>
                <form onSubmit={handlerSendForm}>
                    <section>
                        <input type='text' placeholder='Ingrese Nombres' name="nombre" value={dataCliente.nombre}  onChange={handlerDataForm}  required/>
                        <input type='text' placeholder='Ingrese Apellidos' name="apellido" value={dataCliente.apellido} onChange={handlerDataForm} required/>
                    </section>
                
                    <input type='text' placeholder='Ingrese Correo Electronico' name="correo" value={dataCliente.correo} onChange={handlerDataForm}/>

                    <section className='datos-short'>
                        <input type='number' placeholder='Ingrese Dni' name="dni" value={dataCliente.dni} onChange={handlerDataForm} required/>
                        <input type='number' placeholder='Ingrese Celular' name="telefono" value={dataCliente.telefono} onChange={handlerDataForm} required/>
                        <input type='date' value={`${yearActual}-${monthActual}-${dayActual}`} readOnly/>
                    </section>

                    <input type='text' placeholder='Ingrese Dirección' name="direccion" value={dataCliente.direccion} onChange={handlerDataForm}/>

                    <section className='wrapper-modal-btn'>
                        {titleModal==="Nuevo" ? <button type='submit' className='btn add'><i className="fa-solid fa-user-plus"></i> Agregar</button>
                        : <button type='submit' className='btn add'><i className="fa-solid fa-pen-to-square"></i> Actualizar </button> }
                        
                    </section>
                    
                </form>
                <label className='closeModal' onClick={onClose}> &#215; </label>
            </section>
        </Modal>
    )
}

ModalCreateCustomer.propTypes={
    isOpen:PropTypes.bool.isRequired,
    onClose:PropTypes.func.isRequired,
    titleModal:PropTypes.string.isRequired,
    updateClientList:PropTypes.func,
    dataClienteById:PropTypes.object

}

export default ModalCreateCustomer
