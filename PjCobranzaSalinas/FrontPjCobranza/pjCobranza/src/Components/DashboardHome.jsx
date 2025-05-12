import './StyleContent.css'
import {useFetch } from '../Fetch/UseFetch'
import { useCallback, useEffect, useState } from 'react';

const DashboardHome = () => {


    
    const today = new Date();
    
    // Establecer fecha de inicio al primer día del mes actual
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Establecer fecha de vencimiento al último día del mes actual
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [dataCliente, setDataCliente] = useState([]);


    //const [fechaInicio,setFechaInicio]= useState('2025-03-01')
    //const [fechaVencimiento,setFechaVencimiento]= useState('2025-03-31')

    const [fechaInicio, setFechaInicio] = useState(firstDayOfMonth.toISOString().split('T')[0]);  // formatear a 'YYYY-MM-DD'
    const [fechaVencimiento, setFechaVencimiento] = useState(lastDayOfMonth.toISOString().split('T')[0]);  // formatear a 'YYYY-MM-DD'

    const [listaPrestamosPorMes,setListaPrestamosPorMes]=useState(null);

    const data = useFetch('http://localhost:8092/api/prestamo/pendiente');
    const data2 = useFetch('http://localhost:8092/api/prestamo');
    





    useEffect(() => {
        if (data2) {
            setDataCliente(data2); // Solo actualiza cuando `data2` cambia
        }
    }, [data2]);

    //PRESTAMOS POR MES
    /*
    const handlerBuscarPrestamoPorMes = useCallback((dataI,dateF)=>{
        const fechaIni = new Date(dataI); 
        const fechaVen = new Date(dateF);
        const prestamoPorMes = dataCliente.filter(prestamo => {
            const fechaInicioPrestamo = new Date(prestamo.fecha_inicio);
            const fechaVencimientoPrestamo = new Date(prestamo.fecha_vencimiento);
            return (fechaInicioPrestamo >= fechaIni && fechaInicioPrestamo <= fechaVen) || (fechaVencimientoPrestamo >= fechaIni && fechaVencimientoPrestamo <= fechaVen);
        })
        setListaPrestamosPorMes(prestamoPorMes);
    },[dataCliente])*/

    
    // Función para normalizar las fechas (establecer hora a 00:00:00)
    const normalizeDate = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0); // Establecer hora a 00:00:00
        return d;
    };

       // El handler que filtra los préstamos por fecha
    const handlerBuscarPrestamoPorMes = useCallback((dataI, dateF) => {
        const fechaIni = normalizeDate(dataI);  // Fecha de inicio seleccionada
        const fechaVen = normalizeDate(dateF);  // Fecha de vencimiento seleccionada

        // Filtra los préstamos según las fechas
        const prestamoPorMes = dataCliente.filter(prestamo => {
            const fechaInicioPrestamo = normalizeDate(prestamo.fecha_inicio);  // Normalizamos las fechas de inicio
            const fechaVencimientoPrestamo = normalizeDate(prestamo.fecha_vencimiento);  // Normalizamos las fechas de vencimiento

            // Compara las fechas de los préstamos con las fechas seleccionadas
            return (
                (fechaInicioPrestamo >= fechaIni && fechaInicioPrestamo <= fechaVen) ||
                (fechaVencimientoPrestamo >= fechaIni && fechaVencimientoPrestamo <= fechaVen)
            );
        });

        setListaPrestamosPorMes(prestamoPorMes);  // Actualiza el estado con los préstamos filtrados
    }, [dataCliente]);

    //MONTO PAGADO POR MES 
    /*
    const montoPagadoPorMes=()=>{
        const listPrestamoPagados= listaPrestamosPorMes.filter(item => item.estado.includes("pagado"));
        const montoPagado =listPrestamoPagados.reduce((acumulador, prestamo)=> {
            return acumulador+(prestamo.monto+(prestamo.monto * (prestamo.tasa_interes / 100)))
        },0) 
        return Number(montoPagado).toFixed(1);
    }*/
    //MONTO PAGADO POR MES
    const montoPagadoPorMes = () => {
        if (!listaPrestamosPorMes) return 0;
        const listPrestamoPagados = listaPrestamosPorMes.filter(item => item.estado.includes("pagado"));
        const montoPagado = listPrestamoPagados.reduce((acumulador, prestamo) => {
            return acumulador + (prestamo.monto + (prestamo.monto * (prestamo.tasa_interes / 100)));
        }, 0);
        return Number(montoPagado).toFixed(1);
    };

    useEffect(() => {
        console.log("Buscando préstamos entre", fechaInicio, "y", fechaVencimiento);
        handlerBuscarPrestamoPorMes(fechaInicio, fechaVencimiento);
    }, [fechaInicio, fechaVencimiento, dataCliente, handlerBuscarPrestamoPorMes]);



    return (
        <section className='container-dashboard-home'>
            
            <section className='container-info'>
                <section className='wrapper-indicadores'>
                    <div className='indicadores'>
                        <p>Caja</p>
                        <div className='indicador'>
                            <h5>S/{listaPrestamosPorMes && listaPrestamosPorMes.reduce((acumulador, prestamo) => {
                                return acumulador + prestamo.monto;
                            }, 0)}
                            .0    
                            </h5>    
                        </div>
                    </div>
                    <div className='indicadores'>
                    <p>Pagos</p>
                        <div className='indicador'>
                        <h5>S/{listaPrestamosPorMes && montoPagadoPorMes()}</h5>
                        </div>
                    </div>
                    <div className='indicadores'>
                        <p>Prestamos</p>
                        <div className='indicador'>
                            <h5>{listaPrestamosPorMes &&  String((listaPrestamosPorMes.filter(item => item.estado.includes("pendiente"))).length).padStart(2, "0")}</h5>
                            <p> Pendientes <i className="fa-solid fa-chart-line"></i></p>  
                        </div>
                    </div>
                    <div className='indicadores'>
                    <p>Prestamos</p>
                        <div className='indicador'>
                            <h5>{listaPrestamosPorMes && String((listaPrestamosPorMes.filter(item => item.estado.includes("pagado"))).length).padStart(2, "0")}</h5>
                            <p> Pagados...<i className="fa-solid fa-chart-line"></i></p>  
                        </div>
                    </div>
                </section>

                <section className='wrapper-grafic'>
                    <section className='container-search-dashHome'>
                        <input type='date' value={fechaInicio}  onChange={(e)=> setFechaInicio(e.target.value)}/>
                        <input type='date' value={fechaVencimiento}  onChange={(e)=> setFechaVencimiento(e.target.value)}/>
                    </section>
                
                </section>
            
            </section>

            <section className='container-customers'>
                <h4>Clientes Pendientes</h4>
                <section className='wrapper-customers'>
                    {data?.map( (clientes) => (
                        <section className='customers' key={clientes.prestamo_id}>
                            <div><i className="fa fa-users" aria-hidden="true"></i> </div>
                            <p>{clientes.clientes}</p>
                        </section>
                    ))}   
                </section>
            </section>
            

        </section>
    )
}

export default DashboardHome
