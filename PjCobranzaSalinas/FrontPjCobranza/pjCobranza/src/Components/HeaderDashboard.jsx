import PropTypes  from 'prop-types';

const HeaderDashboard = ({titlePage}) => {
    const usuario = localStorage.getItem("username");

    return (
        <div className="container-header">
            <h2>{titlePage}</h2>
            <div>
                <p>Bienvenido <b>{usuario}</b></p>
                <i className="fas fa-user-circle"></i>
            </div>
        </div>
    )
}
HeaderDashboard.propTypes={
    titlePage:PropTypes.string.isRequired
}

export default HeaderDashboard
