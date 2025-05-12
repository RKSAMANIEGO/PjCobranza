import { useEffect, useState } from "react"
import DataTable from "./DataTable"
import HeaderSearch from "./HeaderSearch"
import './StyleContent.css'
import ModalPagos from "./ModalPagos"
import { useCallback } from "react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
//import { data } from "react-router-dom"

const DashboardPago = () => {

    const[isModal,setModal] = useState(false);
    const[isModalUpdate,setModalUpdate]=useState(false);
    const[dataPagos,setDataPagos]=useState([]);
    const[idPrestamo,setIdPrestamo]=useState(localStorage.getItem("idPrestamo"));
    const[nCuotas,setNcuotas]=useState(localStorage.getItem("nCuotas")||0);
    const[pagoEncontrado,setPagoEncontrado]=useState(null);
    const[searchText, setSearchText]=useState('');


    const recibirDataHeaderSearch =(data)=>{
        setModal(data)
    }

    const fetchListPagos = useCallback( async ()=>{
        const response = await fetch(`http://localhost:8092/api/pagos/${idPrestamo}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer '+localStorage.getItem('token')
            }
        });
        const data =await response.json();
        setDataPagos(data);
    },[idPrestamo])       

    useEffect(()=>{
        fetchListPagos();
    },[fetchListPagos])

    //SECTION N° DE PAGOS Y PAGOS PENDIENTES

    const nPagos= String(dataPagos.length).padStart(2,"0");
    const pagosPendientes=nCuotas-dataPagos.length;

    // FILTRAR PAGOS POR FECHA DE PAGO
    const filteredPagos = dataPagos.filter(pago => pago.fecha_pago.includes(searchText) );

    //EXPORTAR  PAGOS DEL CLIENT A PDF
    const exportToPdf =()=>{
        const doc = new jsPDF();

        doc.setFont("Times","Bold");
        doc.setFontSize(50);
        const title= "Reporte De Pagos";
        const titleWitdh = doc.getTextWidth(title);
        const x = (doc.internal.pageSize.width-titleWitdh)/2;
        doc.text(title,x,30);
        
        //
        doc.setFont("Times", "Bold"); 
        doc.setFontSize(10); 
        doc.setTextColor(40, 60, 100);
        doc.text(`CLIENTE: ${(dataPagos[0].cliente).toUpperCase()}`, 20, 40);
         //
        const importeTotal=(dataPagos[0].monto+(dataPagos[0].monto*(dataPagos[0].tasa_interes/100)));
        doc.setFont("Times", "Bold"); 
        doc.setFontSize(10); 
        doc.setTextColor(40, 60, 100);
        doc.text(`IMPORTE TOTAL: S/ ${importeTotal}`, 20, 45); 
        //

        doc.setFont("Times", "Bold"); 
        doc.setFontSize(10); 
        doc.setTextColor(40, 60, 100);
        doc.text(`PRESTAMO: S/ ${(dataPagos[0].monto)}`, 20, 50); 

        //
        const importePagado = dataPagos.length * dataPagos[0].monto_pago;
        doc.setFont("Times", "Bold"); 
        doc.setFontSize(10); 
        doc.setTextColor("rgb(33, 144, 42)")
        doc.text(`MONTO PAGADO: S/ ${importePagado}`, 20, 55)

         //
        const importePendiente =importeTotal- importePagado;
        doc.setFont("Times", "Bold"); 
        doc.setFontSize(10); 
        doc.setTextColor("rgb(205, 161, 15)")
        doc.text(`MONTO PENDIENTE: S/ ${importePendiente}`, 135, 55)

        console.log(dataPagos);
        imprimirTable(dataPagos,doc);
    }

    //
    const imprimirTable=(data,doc)=>{

        let cont=1;
        const rowHeader = ["N° CUOTA","CUOTA","METODO PAGO","FECHA PAGO"];
        const rowBody= data.map(item =>[
            `${cont++}`,
            item.monto_pago,
            item.metodo_pago,
            item.fecha_pago
        ])

        autoTable(doc,{
            head: [rowHeader],
            body: rowBody,
            theme: 'striped',
            startY:60,
            columnStyles: {
                0: {halign: 'center'},
                1: {halign: 'center'},
                2: {halign: 'center'},
                3: {halign: 'center'},
                },
            styles: {
                fontSize: 10,
                cellPadding: 10
            }
        })
        const nombreCliente= (dataPagos[0].cliente).replace(/ /g,"_")
        doc.save(`reporte_${nombreCliente}.pdf`);
    }


    const columns=[
        {
            name:"N° CUOTA",
            selector:(row,index)=>(index+1)< 24 ? index+1 : "Prestamo Liquidado",
            sortable:true
        },
        {
            name:"CUOTA",
            selector:row=>row.monto_pago,
            sortable:true
        },
        {
            name:"METODO PAGO",
            selector: row=>row.metodo_pago,
            sortable:true
        },
        {
            name:"FECHA PAGO",
            selector:row=>row.fecha_pago,
            sortable:true
        },
        {
            name:"ACCIONES",
            cell: row => (
                <div className='btn-data-table'>
                    <button className='btn btn-update' onClick={()=>{
                        console.log(row.id);
                        console.log("Deseas Actualizar el Pago del Prestamo "+localStorage.getItem("idPrestamo"));
                        setModalUpdate(true);
                        const pagoEncontrado = dataPagos.find((pago)=>pago.pago_id === row.pago_id);
                        setPagoEncontrado(pagoEncontrado);
                    }}><i className="fa-solid fa-pen-to-square"></i></button>
                </div>
            )
        }
    ]

    return (
        <section className="container-dashboard-pagos">
            <section className="container-info-cliente">
                <section>
                    <h4>CLIENTE</h4>
                    <h5>{localStorage.getItem("cliente").toUpperCase()}</h5>
                </section>
                <section className="wrapper-pagos-indicadores">
                    <div>
                        <p>Importe Total</p>
                        <h5>S/{ localStorage.getItem("total")   }</h5>  
                    </div>
                    <div>
                        <p>Cuota Diaria</p>
                        <h5>S/{(localStorage.getItem("total")/nCuotas).toFixed(2) } </h5>  
                    </div>
                    <div>
                        <p>Cuotas Pendiente</p>
                        <h5>{pagosPendientes} Cuotas</h5>  
                    </div>
                    <div>
                        <p>Cuotas Pagadas</p>
                        <h5>{nPagos} Cuotas</h5>  
                    </div>
                
                </section>
            </section>
            <HeaderSearch enviarDashPagos={recibirDataHeaderSearch} tipo={"pagos"} recibirDataSearch={(data)=> setSearchText(data)} isExported={exportToPdf} />
            {searchText ? <DataTable data={filteredPagos} columns={columns}/> : <DataTable data={dataPagos} columns={columns}/>} 
            <ModalPagos isOpen={isModal} onClose={()=>setModal(false) } titleModal={"Nuevo"} listarPagos={fetchListPagos} codPrestamo={idPrestamo}/>
            <ModalPagos isOpen={isModalUpdate} onClose={()=>setModalUpdate(false) } titleModal={"Editar"} pagoEncontrado={pagoEncontrado} listarPagos={fetchListPagos}/>
        </section>
    )
}

export default DashboardPago
