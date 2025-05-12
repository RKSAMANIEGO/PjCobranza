import { useNavigate } from "react-router-dom"
import DataTable from "./DataTable"
import HeaderSearch from "./HeaderSearch"
import './StyleContent.css'
import { useEffect, useState } from "react"
import ModalCreatePrestamos from "./ModalCreatePrestamos"
import Swal from "sweetalert2"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
const DashboardPrestamo = () => {
    const[isModal, setModal] = useState(false);
    const[isModalUpdate,setModalUpdate]= useState(false);
    const[dataPrestamos,setDataPrestamos]=useState([]);
    const[dataPrestamoById,setDataPrestamoById]=useState(null);
    const[searchText,setSearchText]=useState('');

    const recibirDataHeaderSearch =(data)=>{
            setModal(data)
    }

    const handlerModalUpdate=()=>{
        setModalUpdate(true);
    }

    const navigate = useNavigate();

    //FETCH LISTAR PRESTAMOS
    const fetchListPrestamo = async ()=>{
        const response = await fetch("http://localhost:8092/api/prestamo",{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        });
        const dataPrestamo = await response.json();
        setDataPrestamos(dataPrestamo);
        return dataPrestamo;
    }

    // FETCH ELIMINAR PRESTAMO
    const fetchDeletePrestamo=async (idPrestamo)=>{
        const response = await fetch(`http://localhost:8092/api/prestamo/${idPrestamo}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        });
        if(!response.ok){  
            return false;
        }
        return true;
    }
    //RECIBIR VALOR DEL INPUT BUSQUEDA DEL HEARDER SEARCH 
    const recibirSearchText =(data)=>{
        setSearchText(data);
    }

    //FILTAR LA DATA DE LA BUSQUEDA
    const filterPrestamo = dataPrestamos.filter(prestamo =>
        prestamo.clientes.toLowerCase().includes(searchText.toLowerCase()) ||
        prestamo.estado.toLowerCase().includes(searchText.toLowerCase())
    )

    //EXPORTAR PRESTAMOS A PDF
    const exportToPdf =()=>{
        const doc=new jsPDF();

        doc.setFontSize(50);
        doc.setTextColor("black")
        doc.setFont("Times","Bold");
        const title = "Reporte de Prestamos";
        const titleWidth = doc.getTextWidth(title);
        const x = (doc.internal.pageSize.width - titleWidth) / 2;
        doc.text(title,x,30);
        searchText ? imprimirTable(filterPrestamo,doc) : imprimirTable(dataPrestamos,doc);
    }

    const imprimirTable=(data,doc)=>{
        const rowHeader=["CLIENTES","PRESTAMO","CUOTA","TIEMPO","FECHA I.","FECHA V.","TOTAL","ESTADO"];
        const rowBody=data.map(item => [
            item.clientes,
            `S/${item.monto}`,
            `S/${(item.importeTotal/24).toFixed(2)}`,
            `${item.tiempo} dias`,
            item.fecha_inicio,
            item.fecha_vencimiento,
            `S/${(item.importeTotal).toFixed(2)}`,
            item.estado.toUpperCase()
        ])

        autoTable(doc,{
            head:[rowHeader],
            body:rowBody,
            theme:"striped",
            startY:40,
            styles:{
                fontSize:7,
                cellPadding:5,
            }
        })
        doc.save('reporte_prestamo.pdf');

    }


    useEffect(()=>{
        fetchListPrestamo();
    },[])

    const columns = [
        {
            name:"CLIENTES",
            selector:row=>row.clientes,
            sortable:true
        },
        {
            name:"PRESTAMO",
            selector : row =>"S/ "+row.monto,
            sortable:true
        },
        {
            name:"INTERES",
            selector:row=>row.tasa_interes+" %",
            sortable:true
        },
        {
            name:"FECHA I",
            selector:row=>row.fecha_inicio,
            sortable:true
        },
        {
            name:"FECHA V",
            selector:row=>row.fecha_vencimiento,
            sortable:true
        },
        {
            name:"TOTAL",
            selector:row=>"S/ "+row.importeTotal,
            sortable:true
        },
        {
            name:"ESTADO",
            selector:row=>row.estado.toUpperCase(),
            sortable:true
        },
        {
            name:"ACCIONES",
            cell: row => (
                <div className='btn-data-table'>
                    <button className='btn btn-pagos' onClick={()=> {
                        localStorage.setItem("cliente",row.clientes)
                        localStorage.setItem("idPrestamo",row.prestamo_id)
                        localStorage.setItem("nCuotas",row.tiempo)
                        localStorage.setItem("total",row.importeTotal)
                        navigate("/dashboard/pagos");
                        
                    }}><i className="fa-brands fa-paypal"></i></button>
                    <button className='btn btn-update' onClick={()=>{
                        handlerModalUpdate();
                        const prestamoById = dataPrestamos.find((prestamo)=> prestamo.prestamo_id === row.prestamo_id);
                        setDataPrestamoById(prestamoById);
                    }}><i className="fa-solid fa-pen-to-square"></i></button>
                    <button className="btn btn-delete" onClick={()=> {
                        Swal.fire({
                            title: '¿Desea eliminar el registro?',
                            text: 'No se podrá recuperar el registro eliminado',
                            icon: 'warning',
                            background:"rgb(244, 238, 238)",
                            showCancelButton: true,
                            confirmButtonColor: 'rgb(143, 8, 8)',
                            cancelButtonColor: 'rgb(19, 70, 182)',
                            confirmButtonText: 'Si, Eliminar',
                            cancelButtonText:"No, Cancelar"
                        }).then(async (result)=>{
                            if(result.isConfirmed){
                                const responseDelete = await fetchDeletePrestamo(row.prestamo_id);

                                if (responseDelete){
                                    Swal.fire({
                                        title:"Eliminado",
                                        text:"Registro Eliminado Correctamente",
                                        icon:"success",
                                        background:"rgb(244, 238, 238)",
                                        timer:2000 
                                    })
                                    fetchListPrestamo();
                                }else{
                                    Swal.fire({
                                        title:"Cancelado",
                                        text:"No se ha Eliminado el Prestamo", 
                                        icon:"error",
                                        background:'rgb(244, 238, 238)',
                                        timer:2000
                                    })
                                }
                            
                            }
                        })
                    }}><i className="fa-solid fa-trash"></i></button>
                </div>
            )
        }
    ]



    return (
        <section className="container-dashboard-prestamo">
            <HeaderSearch enviarDashPrestamo={recibirDataHeaderSearch} tipo={"prestamos"} recibirDataSearch={recibirSearchText} isExported={exportToPdf}/>
            <ModalCreatePrestamos isOpen={isModal} onClose={()=> setModal(false)} titleModal={"Nuevo"} listaPrestamo={fetchListPrestamo} />
            <ModalCreatePrestamos isOpen={isModalUpdate} onClose={()=> setModalUpdate(false)} titleModal={"Actualizar"} prestamoById={dataPrestamoById} listaPrestamo={fetchListPrestamo}/>
            <section className="wrapper-prestamo-content">
                {searchText ? <DataTable data={filterPrestamo} columns = {columns}/> : <DataTable data={dataPrestamos} columns = {columns}/>}
            </section>
            
        </section>
    )
}

export default DashboardPrestamo
