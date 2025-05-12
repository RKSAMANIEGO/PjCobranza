import ModalPassword from 'react-modal'
import PropTypes from 'prop-types'
import './StyleContent.css'
import Swal from 'sweetalert2'
import { useState } from 'react'

ModalPassword.setAppElement("#root")
const ModalRecuperarPassword = ({isOpen,onClose}) => {

    const [credentialsOnChangePass,setCredentialsOnChangePass]=useState({email:"",password:"",newPass:""});

    //FETCH PARA CAMBIAR LA CONTRASEÑA
    const fetchOnChangePassword=async(email,pass,newPass)=>{
            const response = await fetch(`http://localhost:8092/auth/onChangePassword?email=${encodeURIComponent(email)}&password=${encodeURIComponent(pass)}&newPass=${encodeURIComponent(newPass)}`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                }
            });
            if(!response.ok){
                const data = await response.json();
                Swal.fire({
                    title:"Credenciales Incorrectas",
                    text:data.message,
                    icon:"error",
                    background:"rgb(244,238,238)",
                    timer:2000
                })
                return false;
            }
            return true;
    }

    //OBTENER LOS VALORES DEL INPUT
    const getDataInput = (e)=>{
        const {name , value} = e.target;
        setCredentialsOnChangePass((prevData)=>({
            ...prevData,
            [name]:value
        }))
    }

    //ENVIAR EL FORMULARIO PARA CAMBIAR CONTRASEÑA
    const handlerOnChangePassword = async (e)=>{
        e.preventDefault();

        if(!credentialsOnChangePass.email || credentialsOnChangePass.email===null){
            Swal.fire({
                title:"Error",
                text:"Ingrese un Correo Electrónico",
                icon:"error",
                background:"rgb(244,238,238)",
                timer:2000
            })
            return;
        }

        
        if(!credentialsOnChangePass.password || credentialsOnChangePass.password === null){
            Swal.fire({
                title:"Error",
                text:"Ingrese la Contraseña",
                icon:"error",
                background:"rgb(244,238,238)",
                timer:2000
            })
            return;
        }

        if(!credentialsOnChangePass.newPass || credentialsOnChangePass.newPass === null){
            Swal.fire({
                title:"Error",
                text:"Ingrese la Nueva Contraseña",
                icon:"error",
                background:"rgb(244,238,238)",
                timer:2000
            })
            return;
        }


        const response =await fetchOnChangePassword(credentialsOnChangePass.email,credentialsOnChangePass.password,credentialsOnChangePass.newPass);
            if(response){
                Swal.fire({
                    title:"Cambio de Contraseña Exitoso",
                    text:"Se ha cambiado la contraseña con éxito",
                    icon:"success",
                    background:"rgb(244,238,238)",
                    timer:2000
                });
                onClose();
            }      
    }

    return (
        <ModalPassword
            isOpen = {isOpen}
            onRequestClose = {onClose}
            style={{
                content:{
                    top:"50%",
                    left:"50%",
                    transform:"translate(-50%,-50%)",
                    color:"black",
                    height:'400px',
                    width:'400px',
                    background:'rgb(244, 244, 242)',
                    padding:'40px'
                
                },  
                overlay:{
                    background:"rgba(0,0,0,0.5)",
                }
            }}
        >
            <form className='form-change-password'>
                <h2>Recuperar Contraseña</h2>
                <section className='wrapper-input'>
                    <input type='text' name="email" placeholder='Ingrese su Correo'  value={credentialsOnChangePass.email}  onChange={getDataInput} />
                    <input type='password' name="password" placeholder='Ingrese su Contraseña Actual' value={credentialsOnChangePass.password}  onChange={getDataInput} />
                    <input type='password' name ="newPass" placeholder='Ingrese su Nueva Contraseña' value={credentialsOnChangePass.newPass} onChange={getDataInput} />
                    </section>
                <section className='wrapper-button-password'>
                    <button onClick={handlerOnChangePassword}>Cambiar Contraseña</button>
                    <a onClick={onClose}>Inciar Sesion</a>          
                </section>
            </form>
        </ModalPassword>
    )
}
ModalRecuperarPassword.propTypes={
    isOpen:PropTypes.bool.isRequired,
    onClose:PropTypes.func.isRequired
}

export default ModalRecuperarPassword
