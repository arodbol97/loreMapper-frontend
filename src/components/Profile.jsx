import React, {useEffect, useState} from 'react';
import WorldList from './WorldList';
import { BsTrashFill , BsPersonFillSlash } from 'react-icons/bs';
import axios from 'axios';
import Cookies from 'js-cookie';

const Profile = ({handleComponentChange, user, logged = false, profileUser}) => {
  const divStyles = {
    display: 'flex',
    width: '80%',
    flexWrap: 'wrap',
    borderRadius: '0 0 20px 20px',
    border: '5px solid #282c34',
    borderTop: '0',
    padding: '20px',
    marginBottom: '20px'
  };

  const miniDivStyles = {
    width: '33.33333%',
    justifyContent: 'center',
    padding: '0',
    margin: '0',
  };

  const userCardStyles = {
    display: 'flex',    
    alignItems: 'center',
    justifyContent: 'space-evenly',
    textAlign: 'center',
    width: '100%',
    transition: 'transform 0.3s',
    color: 'white',
    padding: '5px',
    '&:hover': {
      transform: 'scale(1.05)',
    },
    border: '2.5px solid #282c34',
    marginRight: '10px'
  };

  const infoStyles = {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    padding: '0',
    margin: '20px',
    color: 'white',    
  };

  const columnStyles = {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    lineHeight: 1.5,
    marginBottom: '2em',
    wordSpacing: '0.2em',  
    margin:'0 10px'
  };

  const consoleStyles = {
    padding: '1% 1%',
    margin: '0 10px',    
    display: 'flex',
    justifyContent: 'space-between',
    border: '2px solid #282c34',
  };

  const searchStyles = {
    display: 'flex',    
    width: '100%',    
    padding: '5px',   
    border: '2.5px solid #282c34',    
    backgroundColor: '#282c34',    
    color: 'white',   
  };

  const buttonStyles = {
    display: 'flex',
    width: '35px',
    alignItems: 'center',    
    cursor: 'pointer',    
    backgroundColor: "#282c34",    
    color: 'white',    
  };

  const thumbnailStyles = {
    width: '90%',
    height: '200px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: '10px',
    border: '2px solid #282c34',
    borderRadius: '10px'
  };

  const overlayStyles = {
    display: 'flex',
    width: '100%',
    height: '100%',
    borderRadius: '10px',    
    backgroundColor: 'rgba(100, 100, 100, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    cursor: 'pointer'
  };

  const infoItemStyles = {
    display: 'flex',
    width:'calc(100% - 20px)',
    margin: '5px 10px',    
  };

  const formButtonStyles = {
    color: 'white',
    fontWeight: 'bold',
    width: '50%',
    cursor: 'pointer'
  };

  const errorStyles = {
    width: '100%',
    textAlign: 'center',
    color: 'red',
    fontSize: '15px',
  };

  const titleStyles = {
    width: '100%',
    height: '35px',
    backgroundColor: '#007bff',
    color: 'white',
    textAlign: 'center',
    border: '2px solid #282c34',
    margin: '20px auto'
  };

  const markerCardSocketStyles = {
    padding: '5px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-evenly'
  };

  const paginationControlsStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10px',
  };

  const paginationButtonStyles = {
    padding: '5px 10px',
    margin: '0 5px',
    borderRadius: '5px',
    border: '1px solid #282c34',
    backgroundColor: '#282c34',
    color: 'white',
    cursor: 'pointer',
    outline: 'none',
  };  

  const pageNumberStyles = {
    padding: '5px 10px',
    margin: '0 1px',
    borderRadius: '5px',    
    backgroundColor: '#191a21',
    border: '0',
    color: 'white',
    cursor: 'pointer',
    outline: 'none',
  };
  
  const [newName, setNewName] = useState(false);
  const [newEmail, setNewEmail] = useState(false);
  const [newRol, setNewRol] = useState(false);
  const [newPassword, setNewPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(logged);
  const [formData, setFormData] = useState({...profileUser,adminPassword:'',password:'',repeatPassword:''});
  const [userData, setUserData] = useState(profileUser);
  const [worlds, setWorlds] = useState([]);
  const [users, setUsers] = useState([]);
  const [basicPage, setBasicPage] = useState(0);
  const [modPage, setModPage] = useState(0);
  const [searchedBasic, setSearchedBasic] = useState('');
  const [searchedMod, setSearchedMod] = useState('');
  const usersPerPage = 5;

  const handleBasicPageChange = (newPage) => {
    setBasicPage(newPage);
  };

  const handleModPageChange = (newPage) => {
    setModPage(newPage);
  };

  const generatePageNumbers = (totalPages, currentPage, onPageChange) => {
    const pageNumbers = [];
    for (let i = 0; i < totalPages; i++) {
      pageNumbers.push(
        <button key={i} style={{...pageNumberStyles, backgroundColor: currentPage === i ? '#282c34' : '#191a21'}} onClick={() => onPageChange(i)} className={currentPage === i ? 'active' : ''}>
          {i + 1}
        </button>
      );
    }
    return pageNumbers;
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const getWorlds = async () => {
    try {          
      const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/world/fromUserId/${user.userId}`);
      setWorlds(response.data.worlds);          
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  const getUsers = async () => {
    try {          
      const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/user/`);
      setUsers(response.data.users);          
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  const handleNameSubmit = async (event) => {
    event.preventDefault();
        
    try {
      const response = await axios.post('https://loremapper-backend-b042c39916b5.herokuapp.com/user/changeName', formData);
      const requestData = response.data.userData;
      if (!requestData.updated) {
        document.getElementById('formError').innerHTML = requestData.error;
      } else {
        setUserData(formData);
        Cookies.set('userData', JSON.stringify(formData));
        window.location.href = "https://main.d1egoez5esnf01.amplifyapp.com/";  
        setNewName(false);        
      }
    } catch (error) {
      console.error('Update error: ', error);
      document.getElementById('formError').innerHTML = error.message;
    }
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
        
    try {
      const response = await axios.post('https://loremapper-backend-b042c39916b5.herokuapp.com/user/changeEmail', formData);
      const requestData = response.data.userData;
      if (!requestData.updated) {
        document.getElementById('formError').innerHTML = requestData.error;
      } else {
        await axios.post('https://loremapper-backend-b042c39916b5.herokuapp.com/user/verifyStart', {usernameOrEmail: formData.userEmail});
        Cookies.set('userData', null);
        window.location.href = "https://main.d1egoez5esnf01.amplifyapp.com/";  
      }
    } catch (error) {
      console.error('Update error: ', error);
      document.getElementById('formError').innerHTML = error.message;
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.password === formData.repeatPassword) {
        document.getElementById("formError").innerHTML = '';                        
        const response = await axios.post('https://loremapper-backend-b042c39916b5.herokuapp.com/user/passwordresetcomplete', formData);

        if(response.data.success){
          setNewPassword(false);
        } else {
          document.getElementById("formError").innerHTML = 'No se pudo cambiar la contraseña';          
        }
      } else {
        document.getElementById("formError").innerHTML = 'Las contraseñas no coinciden';          
      }      
    } catch (error) {
      console.error('Password reset error: ', error);
    }
  };

  const handleRolSubmit = async (event) => {
    event.preventDefault();
        
    try {
      const response = await axios.post('https://loremapper-backend-b042c39916b5.herokuapp.com/user/applyForAdmin', formData);
      const requestData = response.data.requestData;
      if (!requestData.updated) {
        document.getElementById('formError').innerHTML = requestData.error;
      } else {
        setUserData(formData);
        setNewRol(false);        
      }
    } catch (error) {
      console.error('Update error: ', error);
      document.getElementById('formError').innerHTML = error.message;
    }
  };

  const handleRolSubmit2 = async (event) => {
    event.preventDefault();
        
    try {
      const response = await axios.post('https://loremapper-backend-b042c39916b5.herokuapp.com/user/changeRol', formData);
      const requestData = response.data.requestData;
      if (!requestData.updated) {
        document.getElementById('formError').innerHTML = requestData.error;
      } else {
        Cookies.set('userData', null);
        window.location.href = "https://main.d1egoez5esnf01.amplifyapp.com/";  
      }
    } catch (error) {
      console.error('Update error: ', error);
      document.getElementById('formError').innerHTML = error.message;
    }
  };

  const changeUserRol = async (userId, userRol) => {
    try {
      const response = await axios.post('https://loremapper-backend-b042c39916b5.herokuapp.com/user/changeRol', {userRol: userRol, userId: userId});
      const requestData = response.data.requestData;
      if (!requestData.updated) {
        document.getElementById('formError').innerHTML = requestData.error;
      } else {
        getUsers();
      }
    } catch (error) {
      console.error('Update error: ', error);
      document.getElementById('formError').innerHTML = error.message;
    }
  };

  const deleteUser = async () => {
    try {
      const response = await axios.post('https://loremapper-backend-b042c39916b5.herokuapp.com/user/delete/', formData);
      const requestData = response.data.requestData;
      if (!requestData.deleted) {
        document.getElementById('buttonError').innerHTML = requestData.error;
      } else {
        Cookies.set('userData', null);
        window.location.href = "https://main.d1egoez5esnf01.amplifyapp.com/";
      }
    } catch (error) {
      console.error('Delete error: ', error);
      document.getElementById('buttonError').innerHTML = error.message;
    }
  };  

  const deleteWorlds = async () => {
    try {
      const response = await axios.post('https://loremapper-backend-b042c39916b5.herokuapp.com/world/deleteUserWorlds/', formData);
      const requestData = response.data.requestData;
      if (!requestData.deleted) {
        document.getElementById('buttonError').innerHTML = requestData.error;
      } else {        
        getWorlds();
      }
    } catch (error) {
      console.error('Delete error: ', error);
      document.getElementById('buttonError').innerHTML = error.message;
    }
  };

  useEffect(()=>{        
    setLoggedIn(logged);
    setUserData(profileUser);
    setFormData(profileUser);
    getWorlds();
    getUsers();
  },[userData, logged]);

  return (
    <div style={divStyles}>
      {loggedIn && 
        <div style={{...infoStyles,margin:'0'}}>
          <div style={columnStyles}>
            <h2 style={titleStyles}>Datos del usuario</h2>
            <div style={{...infoItemStyles,backgroundColor:'#282c34'}}>Nombre de usuario: </div>
            <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)'}}>{userData.userName}</div>
            <div style={{...infoItemStyles,backgroundColor:'#282c34'}}>Email: </div>
            <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)'}}>{userData.userEmail}</div>
            <div style={{...infoItemStyles,backgroundColor:'#282c34'}}>Rol: </div>
            <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)'}}>
              {userData.userRol === 'basic' && 'Usuario'}
              {userData.userRol === 'mod' && 'Moderador'}
              {userData.userRol === 'admin' && 'Administrador'}              
            </div>
          </div>

          {!newName && !newEmail && !newRol && !newPassword && 
            <div style={columnStyles}>
              <h2 style={titleStyles}>Opciones de la cuenta</h2>
              <div style={infoItemStyles}>
                <button style={{...buttonStyles,width:'50%',height:'45px',justifyContent:'center',margin:'5px'}} onClick={()=>setNewName(true)}>Cambiar nombre</button>
                <button style={{...buttonStyles,width:'50%',height:'45px',justifyContent:'center',margin:'5px'}} onClick={()=>setNewEmail(true)}>Cambiar email</button>
              </div>
              <div style={infoItemStyles}>
                <button style={{...buttonStyles,width:'50%',height:'45px',justifyContent:'center',margin:'5px'}} onClick={()=>setNewRol(true)}>Cambiar rol</button>
                <button style={{...buttonStyles,width:'50%',height:'45px',justifyContent:'center',margin:'5px'}} onClick={()=>setNewPassword(true)}>Cambiar contraseña</button>
              </div>
              <div style={infoItemStyles}>
              <button style={{...buttonStyles,width:'50%',height:'45px',justifyContent:'center',margin:'5px',fontWeight:'bold',backgroundColor:'#DC143C'}} onClick={()=>{if(window.confirm('¿Seguro que quieres eliminar este usuario permanentemente?')){deleteUser()}}}>
                <BsTrashFill size={20} style={{marginRight:'5px',marginTop:'-3px'}}/> Borrar usuario
              </button>
              <button style={{...buttonStyles,width:'50%',height:'45px',justifyContent:'center',margin:'5px',fontWeight:'bold',backgroundColor:'#DC143C'}} onClick={()=>{if(window.confirm('¿Seguro que quieres cerrar sesión?')){Cookies.set('userData', null);window.location.href = "https://main.d1egoez5esnf01.amplifyapp.com/";}}}>
                <BsPersonFillSlash size={20} style={{marginRight:'5px',marginTop:'-3px'}}/> Cerrar sesión
              </button>                
              </div>              
              <div style={{...infoItemStyles}}>                
                <span id="buttonError" style={{...errorStyles,margin:'0'}}></span>
              </div>              
            </div>
          }
          {newName && 
            <form style={columnStyles} onSubmit={handleNameSubmit}>
              <h2 style={titleStyles}>Cambiar nombre</h2>
              <div style={{...infoItemStyles,backgroundColor:'#282c34'}}>Nuevo nombre: </div>
              <div style={infoItemStyles}>
                <input 
                  type='text'
                  value={formData && formData.userName}
                  onChange={e => handleInputChange('userName', e.target.value)}
                  style={{width:'100%'}}>
                </input>
              </div>
              
              <div style={{...infoItemStyles,width:'100%',marginTop:'auto',flexWrap:'wrap'}}>
                <span id="formError" style={{...errorStyles,margin:'10px'}}></span>
                <button style={{...formButtonStyles,backgroundColor:'red'}} type="button" onClick={()=>{setNewName(false)}}>Cancelar</button>
                <button style={{...formButtonStyles,backgroundColor:'#007bff'}} type="submit">Confirmar</button>
              </div>
            </form>
          }
          {newEmail &&
            <form style={columnStyles} onSubmit={handleEmailSubmit}>
              <h2 style={titleStyles}>Cambiar nombre</h2>
              <div style={{...infoItemStyles,backgroundColor:'#282c34'}}>Nuevo email: </div>
              <div style={infoItemStyles}>
                <input 
                  type='text'
                  value={formData && formData.userEmail}
                  onChange={e => handleInputChange('userEmail', e.target.value)}
                  style={{width:'100%'}}>
                </input>
              </div>
              <div style={{...errorStyles,color:'white'}}>Si decides cambiar de email se cerrará sesión y no podras iniciar sesión nuevamente hasta que el email haya sido verificado.</div>
              
              
              <div style={{...infoItemStyles,width:'100%',marginTop:'auto',flexWrap:'wrap'}}>
                <span id="formError" style={{...errorStyles,margin:'10px'}}></span>
                <button style={{...formButtonStyles,backgroundColor:'red'}} type="button" onClick={()=>{setNewEmail(false)}}>Cancelar</button>
                <button style={{...formButtonStyles,backgroundColor:'#007bff'}} type="submit">Confirmar</button>
              </div>
            </form>
          }
          {newRol && userData.userRol === 'basic' &&
            <form style={columnStyles} onSubmit={handleRolSubmit}>
              <h2 style={titleStyles}>Cambiar rol</h2>
              <div style={{...infoItemStyles,backgroundColor:'#282c34'}}>Contraseña de administrador: </div>
              <div style={infoItemStyles}>
                <input 
                  type='password'
                  value={formData && formData.adminPassword}
                  onChange={e => handleInputChange('adminPassword', e.target.value)}
                  style={{width:'100%'}}>
                </input>
              </div>
              
              <div style={{...infoItemStyles,width:'100%',marginTop:'auto',flexWrap:'wrap'}}>
                <span id="formError" style={{...errorStyles,margin:'10px'}}></span>
                <button style={{...formButtonStyles,backgroundColor:'red'}} type="button" onClick={()=>{setNewRol(false)}}>Cancelar</button>
                <button style={{...formButtonStyles,backgroundColor:'#007bff'}} type="submit">Confirmar</button>
              </div>
            </form>
          }
          {newRol && userData.userRol !== 'basic' &&
            <form style={columnStyles} onSubmit={handleRolSubmit2}>
              <h2 style={titleStyles}>Cambiar rol</h2>
              <div style={{...infoItemStyles,backgroundColor:'#282c34'}}>Rol de usuario: </div>
              <div style={infoItemStyles}>
                <select                  
                  value={formData && formData.userRol}
                  onChange={e => handleInputChange('userRol', e.target.value)}
                  style={{width:'100%'}}>
                    {formData && formData.userRol === 'admin' && <option style={{width:'100%'}} value='admin'>Administrador</option>}
                    <option style={{width:'100%'}} value='basic'>Usuario</option>
                    <option style={{width:'100%'}} value='mod'>Moderador</option>
                </select>
              </div>
              
              <div style={{...infoItemStyles,width:'100%',marginTop:'auto',flexWrap:'wrap'}}>
                <span id="formError" style={{...errorStyles,margin:'10px'}}></span>
                <button style={{...formButtonStyles,backgroundColor:'red'}} type="button" onClick={()=>{setNewRol(false)}}>Cancelar</button>
                <button style={{...formButtonStyles,backgroundColor:'#007bff'}} type="submit">Confirmar</button>
              </div>
            </form>
          }
          {newPassword &&
            <form style={columnStyles} onSubmit={handlePasswordSubmit}>
              <h2 style={titleStyles}>Cambiar contraseña</h2>
              <div style={{...infoItemStyles,backgroundColor:'#282c34'}}>Nueva contraseña</div>
              <div style={infoItemStyles}>
                <input 
                  type='password'
                  value={formData && formData.adminPassword}
                  onChange={e => handleInputChange('password', e.target.value)}
                  style={{width:'100%'}}>
                </input>
              </div>
              <div style={{...infoItemStyles,backgroundColor:'#282c34'}}>Repite la contraseña</div>
              <div style={infoItemStyles}>
                <input 
                  type='password'
                  value={formData && formData.adminPassword}
                  onChange={e => handleInputChange('repeatPassword', e.target.value)}
                  style={{width:'100%'}}>
                </input>
              </div>
              
              <div style={{...infoItemStyles,width:'100%',marginTop:'auto',flexWrap:'wrap'}}>
                <span id="formError" style={{...errorStyles,margin:'10px'}}></span>
                <button style={{...formButtonStyles,backgroundColor:'red'}} type="button" onClick={()=>{setNewPassword(false)}}>Cancelar</button>
                <button style={{...formButtonStyles,backgroundColor:'#007bff'}} type="submit">Confirmar</button>
              </div>
            </form>
          }          
        </div>
      }
      {loggedIn && userData.userRol === 'admin' &&
      <div style={{...infoStyles,margin:'30px 0px'}}>
        <div style={columnStyles}>
          <h2 style={titleStyles}>Usuarios</h2>
          {users &&
            <div style={consoleStyles}>
              <input
                type="text"
                placeholder="Buscar usuario"
                value={searchedBasic}            
                onChange={(e) => setSearchedBasic(e.target.value)}
                style={{...searchStyles}}
              />
            </div>
          }
          <div style={markerCardSocketStyles}>
                <div style={{...markerCardSocketStyles}}>
                  <div style={{...userCardStyles,backgroundColor:'#282c34'}}>
                    <div style={{...columnStyles,width:'30%',borderRight:'2px solid #191a21',padding:'0 10px',fontWeight:'bold'}}>Nombre</div>
                    <div style={{...columnStyles,width:'',padding:'0 10px',fontWeight:'bold'}}>Email</div>
                    <div style={{...columnStyles,width:'',marginLeft:'auto'}}></div>
                  </div>
                </div>
              </div>
          {users &&
          users
            .filter(basic => basic.userRol === 'basic')
            .filter(basic => new RegExp(searchedBasic, "i").test(basic.userName)||new RegExp(searchedBasic, "i").test(basic.userEmail))
            .slice(basicPage * usersPerPage, (basicPage + 1) * usersPerPage)
            .map((basic, index) => (
              <div style={markerCardSocketStyles} key={index}>
                <div style={markerCardSocketStyles}>
                  <div style={userCardStyles}>
                    <div style={{...columnStyles,width:'30%',borderRight:'2px solid #282c34',padding:'0 10px'}}>{basic.userName}</div>
                    <div style={{...columnStyles,width:'',padding:'0 10px'}}>{basic.userEmail}</div>
                    <div style={{...columnStyles,width:'',marginLeft:'auto',marginRight:'5px'}}><button style={{...buttonStyles,justifyContent:'center'}} onClick={()=>{if(window.confirm(`¿Seguro que quieres eliminar el usuario ${basic.userName}?`)){deleteUser(basic.userId)}}}><BsTrashFill size={20}/></button></div>
                    <div style={{...columnStyles,width:'',marginRight:'3px'}}><button style={{...buttonStyles,justifyContent:'center',height:'26px'}} onClick={()=>{changeUserRol(basic.userId,'mod')}}>{'>'}</button></div>
                  </div>
                </div>
              </div>
            ))
          }
          {users && 
            users
              .filter(basic => basic.userRol === 'basic')
              .filter(basic => new RegExp(searchedBasic, "i").test(basic.userName)||new RegExp(searchedBasic, "i").test(basic.userEmail)).length === 0 &&
                <div style={markerCardSocketStyles}>
                  <div style={markerCardSocketStyles}>
                    <div style={{...userCardStyles,color:'grey'}}>
                      No se encontraron usuarios básicos
                    </div>
                  </div>
                </div>          
          }
          {users && users.filter(basic => basic.userRol === 'basic').filter(basic => new RegExp(searchedBasic, "i").test(basic.userName)||new RegExp(searchedBasic, "i").test(basic.userEmail)).length > usersPerPage && 
            <div style={paginationControlsStyles}>
              <button style={paginationButtonStyles} onClick={() => setBasicPage(basicPage - 1)} disabled={basicPage === 0}>
                {'<'}
              </button>
              {generatePageNumbers(Math.ceil(users.filter(basic => basic.userRol === 'basic').filter(basic => new RegExp(searchedBasic, "i").test(basic.userName)||new RegExp(searchedBasic, "i").test(basic.userEmail)).length / usersPerPage), basicPage, handleBasicPageChange)}
              <button style={paginationButtonStyles} onClick={() => setBasicPage(basicPage + 1)} disabled={users.filter(basic => basic.userRol === 'basic').filter(basic => new RegExp(searchedBasic, "i").test(basic.userName)||new RegExp(searchedBasic, "i").test(basic.userEmail)).length <= (basicPage + 1) * usersPerPage}>
                {'>'}
              </button>
            </div>
          }          
        </div>

        <div style={columnStyles}>
          <h2 style={titleStyles}>Moderadores</h2>
          {users &&
            <div style={consoleStyles}>
              <input
                type="text"
                placeholder="Buscar moderador"
                value={searchedMod}            
                onChange={(e) => setSearchedMod(e.target.value)}
                style={{...searchStyles}}
              />
            </div>
          }
          <div style={markerCardSocketStyles}>
                <div style={{...markerCardSocketStyles}}>
                  <div style={{...userCardStyles,backgroundColor:'#282c34'}}>
                    <div style={{...columnStyles,width:'30%',borderRight:'2px solid #191a21',padding:'0 10px',fontWeight:'bold'}}>Nombre</div>
                    <div style={{...columnStyles,width:'',padding:'0 10px',fontWeight:'bold'}}>Email</div>
                    <div style={{...columnStyles,width:'',marginLeft:'auto'}}></div>
                  </div>
                </div>
              </div>
          {users &&
          users
            .filter(mod => mod.userRol === 'mod')
            .filter(mod => new RegExp(searchedMod, "i").test(mod.userName)||new RegExp(searchedMod, "i").test(mod.userEmail))
            .slice(modPage * usersPerPage, (modPage + 1) * usersPerPage)
            .map((mod, index) => (
              <div style={markerCardSocketStyles} key={index}>
                <div style={markerCardSocketStyles}>
                  <div style={userCardStyles}>
                    <div style={{...columnStyles,width:'30%',borderRight:'2px solid #282c34',padding:'0 10px'}}>{mod.userName}</div>
                    <div style={{...columnStyles,width:'',padding:'0 10px'}}>{mod.userEmail}</div>
                    <div style={{...columnStyles,width:'',marginLeft:'auto',marginRight:'5px'}}><button style={{...buttonStyles,justifyContent:'center'}} onClick={()=>{if(window.confirm(`¿Seguro que quieres eliminar el moderador ${mod.userName}?`)){deleteUser(mod.userId)}}}><BsTrashFill size={20}/></button></div>
                    <div style={{...columnStyles,width:'',marginRight:'3px'}}><button style={{...buttonStyles,justifyContent:'center',height:'26px'}} onClick={()=>{changeUserRol(mod.userId,'basic')}}>{'<'}</button></div>
                  </div>
                </div>
              </div>
            ))
          }
          {users && 
            users
              .filter(mod => mod.userRol === 'mod')
              .filter(mod => new RegExp(searchedMod, "i").test(mod.userName)||new RegExp(searchedMod, "i").test(mod.userEmail)).length === 0 &&
                <div style={markerCardSocketStyles}>
                  <div style={markerCardSocketStyles}>
                    <div style={{...userCardStyles,color:'grey'}}>
                      No se encontraron usuarios moderadores
                    </div>
                  </div>
                </div>          
          }
          {users && users.filter(mod => mod.userRol === 'mod').filter(mod => new RegExp(searchedMod, "i").test(mod.userName)||new RegExp(searchedMod, "i").test(mod.userEmail)).length > usersPerPage && 
            <div style={paginationControlsStyles}>
              <button style={paginationButtonStyles} onClick={() => setModPage(modPage - 1)} disabled={modPage === 0}>
                {'<'}
              </button>
              {generatePageNumbers(Math.ceil(users.filter(mod => mod.userRol === 'mod').filter(mod => new RegExp(searchedMod, "i").test(mod.userName)||new RegExp(searchedMod, "i").test(mod.userEmail)).length / usersPerPage), modPage, handleModPageChange)}
              <button style={paginationButtonStyles} onClick={() => setModPage(modPage + 1)} disabled={users.filter(mod => mod.userRol === 'mod').filter(mod => new RegExp(searchedMod, "i").test(mod.userName)||new RegExp(searchedMod, "i").test(mod.userEmail)).length <= (modPage + 1) * usersPerPage}>
                {'>'}
              </button>
            </div>
          }             
        </div>
      </div>
      }
      
      <WorldList handleComponentChange={handleComponentChange} user={user} worlds={worlds} getWorlds={getWorlds}/>
    </div>        
  );
};

export default Profile;