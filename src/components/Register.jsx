import React, { useState } from 'react';
import axios from 'axios';
import Login from './Login'; 

const Register = ({handleComponentChange , setUser}) => {
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
    marginTop: '50px',
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
    repeatPassword: '',
    email: ''
  }); 

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
    document.getElementsByTagName("input")[2].style.borderColor = "";
    document.getElementById("formError").innerHTML = "";

    if (formData.password !== formData.repeatPassword) {
      document.getElementsByTagName("input")[1].style.borderColor = "red";
      document.getElementsByTagName("input")[2].style.borderColor = "red";
      document.getElementById("formError").innerHTML = "Repita correctamente la contraseña";
      return;
    }else{
      try {      
        const response = await axios.post(`https://loremapper-backend-b042c39916b5.herokuapp.com/user/register`,formData);
        console.log("afteraxios");
        const registerData = response.data.registerData;
        console.log(registerData.registered);
        if(!registerData.registered){
          document.getElementsByTagName("input")[0].style.borderColor = "red";
          document.getElementById("formError").innerHTML = registerData.error;
        } else {        
          handleComponentChange(<Login setUser={setUser} handleComponentChange={handleComponentChange} registered={true}/>,'Inicio de Sesión');
        }
      } catch (error) {
        console.error('Register error: ', error);
      }
    } 
  };

  return (    
    <div style={divStyles}>    
      <form onSubmit={handleSubmit} style={formStyles}>
        <h2 style={titleStyles}>Registrarse</h2>
        
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

        <div style={{...statStyles, backgroundColor: '#282c34'}}>Email:</div>
        <div style={{...statStyles}}>
          <input
            type="email"
            value={formData.email}
            name="email"
            onChange={handleChange}
            style={{width: '100%'}}
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

        <div style={{...statStyles, backgroundColor: '#282c34'}}>Repite la contraseña:</div>
        <div style={{...statStyles}}>
          <input
            type="password"
            value={formData.repeatPassword}
            name="repeatPassword"
            onChange={handleChange}
            style={{width: '100%'}}
            maxLength={100}
            required
          />
        </div>
        
        <span id='formError' style={errorStyles}></span>

        <button type="submit" style={buttonStyles}>Registrar</button>
      </form>
      
    </div>
  );
};

export default Register;