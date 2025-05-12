import { useEffect, useState } from 'react'
import DataTable from './DataTable'
import HeaderSearch from './HeaderSearch'
import ModalCreateCustomer from './ModalCreateCustomer'
import Swal from 'sweetalert2';
import './StyleContent.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const DashBoardCustomer = () => {

    const [isModal, setModal] = useState(false);
    const [isModalUpdate,setModalUpdate] = useState(false);
    const [dataCliente, setDataClient]=useState([]);
    const [dataClienteById, setDataClienteById]=useState(null);
    const [search, setSearch] = useState('')

    //FETCH PARA LISTAR CLIENTES
    const updateClientList = async () => {
        const response = await fetch('http://localhost:8092/api/cliente',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        const newClients = await response.json();
        setDataClient(newClients);
    };
    
    //FETCH PARA ELIMINAR CLIENTES
    const fetchDeleteCliente = async(idCliente)=>{
        const response = await fetch("http://localhost:8092/api/cliente/"+idCliente,{
            method: 'DELETE',
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        });
            if(!response.ok){
                const responseDelete =await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar el cliente \n'+responseDelete.message,
                    });
                return false;
            
            }    
        
        return true;
        }
    
    //DATA FILTRADO POR NOMBRE CLIENTE 
    const filtroCliente = dataCliente.filter(client =>
            client.nombre.toLowerCase().includes(search.toLowerCase())|| 
            client.apellido.toLowerCase().includes(search.toLowerCase()) ||
            client.dni.includes(search)
    );
    

    //RECIBIR EL INPUT BUSCAR 
    const recibirSearch = (data)=>{
        setSearch(data);
    }

    // METODO PARA IMPRIMIR LA TABLA DENTRO DEL PDF
    const imprimirTable = (data, doc) => {    
        const rowHeader = ["CLIENTE", "DNI", "CELULAR", "CORREO"];
        const rowBody = data.map(item => [
            `${item.nombre} ${item.apellido}`,
            item.dni,
            item.telefono,
            item.correo,
        ]);
        
        autoTable(doc, {
            head: [rowHeader],
            body: rowBody,
            startY: 40,
            theme: 'striped',
            styles:{
                fontSize: 10,
                cellPadding: 5,
            }
            }
        );

        doc.save('reporte_clientes.pdf');
    };

    //EXPORT TO PDF 
    const exportedToPdf = () =>{
        const doc = new jsPDF();

        doc.setFontSize(50);
        doc.setTextColor("black")
        doc.setFont("Times","Bold");
        const title = "Reporte de Clientes";

        // Calcula el ancho del texto y centra el título
        const titleWidth = doc.getTextWidth(title);
        const x = (doc.internal.pageSize.width - titleWidth) / 2;
        doc.text(title, x, 30);
        search ? imprimirTable(filtroCliente , doc) : imprimirTable(dataCliente , doc);
    }
    
    useEffect(() => {
        updateClientList();
    }, []);


    const handlerBtnUpdate=()=>{
        setModalUpdate(true);
    }

    const recibirDataHeaderSearch =(data)=>{
            setModal(data);
    }

    const columns=[
        {
            name:'CLIENTE',
            selector:row=> row.nombre+' '+row.apellido,
            sortable:true,
        },
        {
            name:'DNI',
            selector:row=> row.dni,
            sortable:true
        },
        {
            name:"CELULAR",
            selector:row=>row.telefono,
            sortable:true            
        },
        {           
            name:"CORREO",
            selector:row=>row.correo,
            sortable:true
        },
        {
            name: 'ACCIONES',
            cell: row => (
                <div className='btn-data-table'>
                    <button className='btn btn-update' onClick={()=>{

                        handlerBtnUpdate();
                        const clienteById = dataCliente.find((cliente)=> cliente.clienteId === row.clienteId);
                        setDataClienteById(clienteById);

                    }}><i className="fa-solid fa-pen-to-square"></i></button>
                    <button className="btn btn-delete" onClick={()=>{
                            Swal.fire({
                                title: '¿Estás seguro?',
                                text: '¿Estás seguro de eliminar este registro?',
                                icon: 'warning',
                                showCancelButton: true,
                                background:"rgb(244, 238, 238)",
                                confirmButtonColor:"rgb(143, 8, 8)",
                                cancelButtonColor:"rgb(19, 70, 182)",
                                confirmButtonText: 'Sí, eliminar',
                                cancelButtonText: 'No, cancelar',
                            }).then(async (result) => {
                                if (result.isConfirmed) {
                                    const responseDeleteCliente= await fetchDeleteCliente(row.clienteId);
                                    if(responseDeleteCliente){
                                        Swal.fire({
                                            title: 'Eliminado',
                                            text: 'El cliente ha sido eliminado con éxito',
                                            icon: 'success',
                                            background:"rgb(244, 238, 238)",
                                            timer: 2000
                                            });
                                        
                                    updateClientList();
                                    }
                                    else {
                                        Swal.fire({
                                            title: 'Cancelado',
                                            text: 'No se ha eliminado el cliente, Porque Tiene Prestamos Vinculados',
                                            icon: 'warning',
                                            background:"rgb(244, 238, 238)",
                                            timer: 2000
                                            });
                                        }
                                } 

                            });
                    }}><i className="fa-solid fa-trash"></i></button>
                </div>
            
            )}
    ]
    
    return (
        <section className="container-dashboard-customers">
            <HeaderSearch enviarDashCustomer ={recibirDataHeaderSearch} tipo ={"clientes"}  recibirDataSearch={recibirSearch} isExported={exportedToPdf}/>

            <ModalCreateCustomer isOpen={isModal} onClose={()=> setModal(false)} titleModal={"Nuevo"}  updateClientList={updateClientList}/>
            <ModalCreateCustomer isOpen={isModalUpdate} onClose={()=> setModalUpdate(false)} titleModal={"Actualizar"} dataClienteById={dataClienteById} updateClientList={updateClientList}/> 
            <section className="wrapper-customers-content">
                {search ? <DataTable data={filtroCliente} columns={columns}/> : <DataTable data={dataCliente} columns={columns}/> }
                {/*  <DataTable data={dataCliente} columns={columns}/> */}
            </section>
        </section>
    )
}
export default DashBoardCustomer
