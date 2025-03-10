import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import PasswordReset from './PasswordReset';
import EmailVerify from './EmailVerify';
import Home from './Home';
import Register from './Register';

const Login = ({ setUser , handleComponentChange , registered = false }) => {
  const divStyles = {
    display: 'flex',    
    flexWrap: 'wrap',
    borderRadius: '0 0 20px 20px',
    border: '5px solid #282c34',
    borderTop: '0',
    padding: '20px',
    marginBottom: '20px'
  };

  const formStyles = {
    border: '2px solid #282c34',
    color: 'white',
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '400px',
    margin:'10px',
    marginTop: '100px',
    padding: '20px',    
  };
  const inputStyles = {
    width: '60%',
    marginLeft: '10px'
  };
  const labelStyles = {
    display: 'flex',
    width: '100%',
    justifyContent: 'right',
    margin: '2px',    
  };
  const buttonStyles = {
    width: '100%',
    height: '30px',
    textAlign: 'center',
    margin: '2px',
    marginTop: '10px',
    fontSize: '15px',
    cursor: 'pointer',
    backgroundColor: '#282c34',
    color:'white'
  };

  const errorStyles = {
    width: '100%',
    textAlign: 'center',
    color: 'red',
    fontSize: '15px'
  };

  const passwordResetStyles = {
    width: '100%',
    textAlign: 'center',
    color: 'white',
    fontSize: '15px',
    textDecoration: 'underline',
    margin: '20px 0 0 0',
    cursor: 'pointer'
  };

  const verifyStyles = {
    width: '100%',
    textAlign: 'center',
    color: 'white',
    fontSize: '15px',
    textDecoration: 'underline',
    margin: '0',
    cursor: 'pointer'
  };

  const statStyles = {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '10px 0 10px 0',
    textAlign: 'left'
  };

  const formButtonStyles = {
    color: 'white',
    fontWeight: 'bold',
    width: '50%',
    cursor: 'pointer'
  };

  const titleStyles = {      
    width: '100%',
    backgroundColor: '#007bff',
    color: 'white',
    textAlign: 'center',
    border: '2px solid #282c34',
    margin: '10px 0'
  };

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [loggedIn, setLoggedIn] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    document.getElementsByTagName("input")[0].style.borderColor = "";
    document.getElementsByTagName("input")[1].style.borderColor = "";
    document.getElementById("formError").innerHTML = "";

    try {      
      const response = await axios.post(`https://lore-mapper-backend.vercel.app//user/login`, formData);
      const loginData = response.data.loginData;
      const userData = response.data.userData;     
      
      if (!loginData.loggedIn) {
        document.getElementsByTagName("input")[0].style.borderColor = "red";
        document.getElementsByTagName("input")[1].style.borderColor = "red";
        document.getElementById("formError").innerHTML = loginData.error;        
      } else {
        Cookies.set('userData', JSON.stringify(userData));
        setLoggedIn(true);
        setUser(userData);
        handleComponentChange(<Home user={userData}/>,'Inicio');
      }
    } catch (error) {
      console.error('Login error: ', error);
    }
  };

  return (    
    <div style={divStyles}>      
      <form onSubmit={handleSubmit} style={formStyles}>    
        <h2 style={titleStyles}>Iniciar Sesión</h2>
        <div style={{...statStyles, backgroundColor: '#282c34'}}>Usuario:</div>
        <div style={{...statStyles}}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={{width: '100%'}}
            maxLength={20}
            required
          />
        </div>

        <div style={{...statStyles, backgroundColor: '#282c34'}}>Contraseña:</div>
        <div style={{...statStyles}}>
          <input
            type="password"
            value={formData.password}
            name="password"
            onChange={handleChange}
            style={{width: '100%'}}
            maxLength={100}
            required
          />
        </div>
        
        {registered && <span style={{...errorStyles,color:'yellow',marginTop:'20px'}}>Se ha enviado un correo de verificación a tu email</span>}
        {registered && <span style={{...errorStyles,color:'yellow'}}>No podrás iniciar sesión en una cuenta sin verificar</span>}

        <span id='formError' style={{...errorStyles,marginTop:'20px'}}></span>

        <p style={passwordResetStyles} onClick={()=>handleComponentChange(<PasswordReset handleComponentChange={handleComponentChange}/> , 'Cambiar contraseña')}>He olvidado mi contraseña</p>
        <p style={verifyStyles} onClick={()=>handleComponentChange(<EmailVerify handleComponentChange={handleComponentChange}/> , 'Correo de verificación')}>Enviar correo de verificación</p>
        <button type="submit" style={buttonStyles}>Iniciar sesión</button>        
        <button type="button" style={buttonStyles} onClick={()=>handleComponentChange(<Register handleComponentChange={handleComponentChange} setUser={setUser}/> , 'Registrarse')}>Registrarse</button>
      </form>
    
    </div>
  );
};

export default Login;