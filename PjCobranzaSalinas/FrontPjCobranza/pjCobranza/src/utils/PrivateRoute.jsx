import { Navigate, useLocation } from "react-router-dom"
import { isAuthenticated } from "./isAuthenticated"
import {PropTypes} from 'prop-types'

const PrivateRoute = ({children}) => {
    
    const location = useLocation();

    if(!isAuthenticated()){
        return <Navigate to="/" state={{from:location}} replace/>   
    }

    return children;
}
PrivateRoute.propTypes={
    children:PropTypes.element.isRequired
}

export default PrivateRoute
