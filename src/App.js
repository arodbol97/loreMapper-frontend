import './App.css';
import Header from './components/Header';
import React, { useState, useEffect } from 'react';
import Section from './components/Section';
import Home from './components/Home';
import PasswordReset from './components/PasswordReset';
import EmailVerify from './components/EmailVerify';
import Cookies from 'js-cookie';

function App() {
  
  const [comp, setComp] = useState(<Home />);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [user, setUser] = useState(null);


  const handleComponentChange = (component, label, cut = null) => {    
    if(breadcrumbs.some(crumb => crumb.label === label)){
      let index = breadcrumbs.findIndex(crumb => crumb.label === label);
      setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    }else{
      if(cut !== null){
        setBreadcrumbs(breadcrumbs.slice(0, cut));
      }
      if(label === 'Inicio'){
        setBreadcrumbs([]);
      }else{
        setBreadcrumbs((prevBreadcrumbs) => [...prevBreadcrumbs, {label: label, component:component }]);
      }      
    }
    setComp(component);    
  };

  useEffect(() => {
    const userDataCookie = Cookies.get('userData');
      
    if (userDataCookie && typeof userDataCookie === 'string') {
      try {
        const userData = JSON.parse(userDataCookie);        
        setUser(userData);
      } catch (error) {
        console.error('Error parsing userDataCookie:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  useEffect(()=>{
    const currentUrl = window.location.search;
    const urlParams = new URLSearchParams(currentUrl);    
    if (urlParams.has('resetpassword')) {
      const pasresValue = urlParams.get('resetpassword');
      const newUrl = currentUrl.origin;
      handleComponentChange(<PasswordReset handleComponentChange={handleComponentChange} encryptedEmail={pasresValue}/> , 'Cambiar contraseña');
    } else if (urlParams.has('verify')) {
      const pasresValue = urlParams.get('verify');
      const newUrl = currentUrl.origin;
      handleComponentChange(<EmailVerify handleComponentChange={handleComponentChange} encryptedEmail={pasresValue}/> , 'Email Verificado');
    } else {
      setComp(<Home handleComponentChange={handleComponentChange} user={user}/>);  
    }    
  },[user])

  return (
    <div>
      <Header user={user} breadcrumbs={breadcrumbs} handleComponentChange={handleComponentChange} setUser={setUser}/>
      <Section comp={comp} handleComponentChange={handleComponentChange} user={user}/>
    </div>
  );
}

export default App;
