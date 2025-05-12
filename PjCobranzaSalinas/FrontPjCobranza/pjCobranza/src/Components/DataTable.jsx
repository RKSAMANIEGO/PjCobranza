import DataTables from 'react-data-table-component'
import './StyleContent.css'
import PropTypes from 'prop-types'
const DataTable = ({data,columns}) => {

    const customStyle ={
        headCells:{
            style:{
                backgroundColor: 'rgb(19, 178, 122)', 
                color: 'white',            
                fontWeight: 'bold',       
                padding: "15px 1px",
                fontSize:"11px",
                display:"flex",
                justifyContent:"center",           
            }
        },
        cells:{
            style:{
                display:"flex",
                justifyContent:"center"
            }
        }
    }

    return (
        <DataTables className='tabla'
            columns ={columns}
            data = {data}
            pagination
            highlightOnHover
            pointerOnHover
            theme="dark"
            customStyles={customStyle}
            />
    )
}
DataTable.propTypes={
    data:PropTypes.array,
    columns:PropTypes.array
}

export default DataTable
