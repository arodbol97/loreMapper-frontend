import React from 'react';
import { BsPerson, BsPersonSlash } from 'react-icons/bs';
import Login from './Login';
import Home from './Home';
import Profile from './Profile';
import Help from './Help';
import About from './About';
import Breadcrumbs from './Breadcrumbs';
import Cookies from 'js-cookie';

const Header = ({ breadcrumbs , user , handleComponentChange , setUser}) => {    
  const headerStyles = {
      backgroundColor: '#282c34',
      minHeight: '10vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
  };

  const loginStyles = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',    
    fontSize: '20px',
  };

  const linksStyles = {    
    minHeight: '50px',
    display: 'flex',
    flexDirection: 'right',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    position:'absolute',
    top: '20px',
    right: '10px'
  };

  const linkStyles = {
    cursor: 'pointer',
    padding: '5px 15px',
    borderRight: '1px solid grey'
  };

  const handleLogout = () => {
    setUser(null);
    Cookies.set('userData', null);
    handleComponentChange(<Home/>,'Inicio')
  }

  return (
    <header style={headerStyles}>
      <div style={linksStyles}>
        <span style={linkStyles} onClick={()=>handleComponentChange(<About handleComponentChange={handleComponentChange}/>,'Acerca de LoreMapper',0)}>Acerca de</span>
        <span style={{...linkStyles,borderRight:'0'}} onClick={()=>handleComponentChange(<Help handleComponentChange={handleComponentChange}/>,'Ayuda')}>Ayuda</span>
        {user ? (        
          <button style={loginStyles} onClick={()=>handleComponentChange(<Profile handleComponentChange={handleComponentChange} user={user} profileUser={user} logged={true}/>,'Perfil de '+user.userName,0)}>
            <BsPerson size={20} style={{ marginRight: '5px' }} />
            {user.userName}          
          </button>                   
        ) : (
          <button style={loginStyles} onClick={()=>handleComponentChange(<Login setUser={setUser}/>,'Inicio de Sesión',0)}>
            <BsPerson size={20} style={{ marginRight: '5px' }} />
            Iniciar Sesión
          </button>
        )}
      </div>     
      
      <Breadcrumbs path={breadcrumbs} handleComponentChange={handleComponentChange}/>
      <h1>{breadcrumbs.length ? breadcrumbs[breadcrumbs.length - 1].label : 'LoreMapper'}</h1>
    </header>
  );
};

export default Header;