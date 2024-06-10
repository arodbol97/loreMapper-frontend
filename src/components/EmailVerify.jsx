import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmailVerify = ({ handleComponentChange , encryptedEmail = null }) => {
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
    height: '15px',
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
    marginTop: '50px',
    fontSize: '15px',
    cursor: 'pointer',
    backgroundColor: '#282c34',
    color:'white'
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

  const errorStyles = {
    width: '100%',
    textAlign: 'center',
    color: 'red',
    fontSize: '15px'
  };

  const emailStyles = {
    width: '100%',
    textAlign: 'center',
    color: 'white',
    fontSize: '15px',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #191a21'
  };

  const successStyles = {
    width: '100%',
    textAlign: 'center',    
    fontSize: '15px',
    margin: '20px'
  }

  const [formData, setFormData] = useState({
    usernameOrEmail: '',
  });

  const [verified, setVerified] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const decrypt = async () => {
    try {
      const response = await axios.post('http://localhost:3001/user/verify', {encryptedEmail: encryptedEmail});
      if(response.data.email){
        setVerified(true);        
        document.getElementById("formError").innerHTML = '';
      } else {
        document.getElementById("formError").innerHTML = 'No se pudo verificar el correo';
        document.getElementsByTagName("input").forEach(input => {
          input.style.borderColor = "red";
        });
      }
    } catch (error) {
      console.error('Verify error: ', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/user/verifyStart', formData);
      if(response.data.success){
        document.getElementById("formError").innerHTML = '';                        
      } else {
        document.getElementById("formError").innerHTML = 'Usuario no encontrado';      
      }
    } catch (error) {
      console.error('Password reset error: ', error);
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();

    window.location.href = 'http://localhost:3000/';
  };

  useEffect(()=>{
    console.log(encryptedEmail);
    if(encryptedEmail){
      decrypt();      
    }
  },[encryptedEmail]);

  return (
    <div>
      {verified ? (
        <form onSubmit={handleSubmit2} style={formStyles}>
          <h2 style={titleStyles}>Verificación de correo</h2>
          <span style={successStyles}>Correo verificado correctamente</span>
          <button type="submit" style={buttonStyles}>Continuar</button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} style={formStyles}>
          <h2 style={titleStyles}>Verificación de correo</h2>

          <div style={{...statStyles, backgroundColor: '#282c34'}}>Usuario o email:</div>
          <div style={{...statStyles}}>
            <input
              type="text"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              style={{width: '100%'}}
              required
            />
          </div>

          <span id='formError' style={errorStyles}></span>

          <button type="submit" style={buttonStyles}>Enviar correo de verificación</button>
        </form>
      )}
    </div>
  );
};

export default EmailVerify;