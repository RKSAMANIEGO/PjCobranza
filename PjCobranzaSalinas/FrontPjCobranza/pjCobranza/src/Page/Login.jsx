import {useRef, useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import ModalRecuperarPassword from '../Components/ModalRecuperarPassword';
import Swal from 'sweetalert2';
export default function Login (){

    const [credentials, setCredentials]=useState({email:""});
    const [onChangePasswordModal,setChangePasswordModal]= useState(false);

    const passwordRef = useRef();
    const navegate=useNavigate();

    //OBTENER LOS DATOS DEL INPUT DEL FOMR
    const getInputForm=(e)=>{
        const {name, value} = e.target;
            setCredentials((prevData)=>({
                ...prevData,
                [name]:value
            }))
        
    }

    //FETCH PARA INICIAR SESION
    const fetchAuth = async (url, requestBody)=>{ 
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            const data= await response.json();

            return data;
        } catch (error) {
            console.error("Error "+error);
        }
    }

    const handlerSubmit = async (e) => {
    
        e.preventDefault();
        
        const credenciales ={
            email:credentials.email,
            password:passwordRef.current.value
        }
        const datos = await fetchAuth("http://localhost:8092/auth/log-in", credenciales);

        if(datos && datos.message === "Authenticacion Correcta"){

            Swal.fire({
                title:"Credenciales Correctas", 
                text:"Bienvenido al Sistema de Cobranzas Creditos Al Instante",
                icon:"success",
                background:"rgb(244, 238, 238)",
                timer:3000
            })

            navegate("/dashboard");
            localStorage.setItem("token",datos.token);
            localStorage.setItem("username",datos.usuario)

            return;
        }else if(datos){
            Swal.fire({
                title:"Authenticacion Fallida", 
                text:datos.message, 
                icon:"error",
                background:"rgb(244,238,238)",
                timer:2000,
            })
            return;
        }
    }

return (
    <section className='container-login'>
        <section className='wrapper-description'>
            <section className="formulario">            
                <h2><i className="fa fa-lock" aria-hidden="true"></i> <br/> Iniciar Sesion </h2>
                <form onSubmit={handlerSubmit}>
                    
                    <label htmlFor='correo'>Usuario</label>
                    <input id='correo' type="text" name="email" placeholder='Ingrese su Correo' onChange={getInputForm} value={credentials.email} required></input>
                    
                    <label htmlFor='password'>Contraseña</label>
                    <input id="password" type="password" placeholder='Ingrese su Contraseña' ref={passwordRef} required autoComplete='off'></input>
                    
                    <a  onClick={(e)=> {
                        e.preventDefault();
                        setChangePasswordModal(true);
                    }} >¿Olvidastes tu Contraseña?</a>

                    <button type='submit'>Login</button> 
                    <a className='registrar'>Registrate</a>

                    <section>
                        <a href='https://es-la.facebook.com/login/device-based/regular/login/' target='_blank'><img src='https://www.freepnglogos.com/uploads/facebook-logo-icon/facebook-logo-icon-facebook-logo-png-transparent-svg-vector-bie-supply-16.png' alt='fb'/></a>    
                        <a href='https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&ifkv=AXH0vVsP0jpvjpmlxavScIdDdZOOo-gG47S-LljNM5xFx2uAkCwE0c6JOZgoqqHAOpqjIOUk0J-0og&rip=1&sacu=1&service=mail&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S-1542326462%3A1742061923744806' target='_blank'><img src='https://img.icons8.com/?size=512&id=17949&format=png' alt='google'/></a>                    
                    </section>

                    <ModalRecuperarPassword isOpen={onChangePasswordModal} onClose={()=> setChangePasswordModal(false)}/>

                </form>
            </section>
            <section className='welcome'> </section>
        </section>
    </section>
    )
}

