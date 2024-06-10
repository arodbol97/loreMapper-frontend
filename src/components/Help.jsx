import React from 'react';
import { FaPlus , FaMapMarkerAlt } from "react-icons/fa";
import { ImBlocked } from "react-icons/im";
import { BsTrashFill , BsPencilFill  } from 'react-icons/bs';
import { BiSolidShieldAlt2 } from "react-icons/bi";
import { GiDna1 } from "react-icons/gi";

const Help = ({handleComponentChange}) => {    
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

  const infoStyles = {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    padding: '0',
    margin: '20px',
    color: 'white',    
    wordSpacing: '0.2em',  
    lineHeight: 1.5,
  };

  const infoItemStyles = {
    width:'calc(100% - 20px)',
    margin: '5px 10px',    
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

  return (
    <div style={divStyles}>
      <div style={{...infoStyles, flexWrap:'wrap'}}>        
        <h2 style={titleStyles}>Ayuda</h2>
        <div style={{...infoItemStyles,backgroundColor:'#282c34'}}>Cabecera: </div>  
        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)'}}>
          A la izquierda de la cabecera se encuentran las migas de pan.
        </div>
        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)'}}>
          A la derecha de la cabecera se encuentran el botón de inicio de sesión y el de perfil del usuario. En el formulario de inicio de sesión se puede optar por registrarse, cambiar contraseña o enviar correo de verificación.
        </div>  

        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)'}}>
          Un usuario que no haya verificado su email no podrá iniciar sesión.
        </div>  

        <div style={{...infoItemStyles,backgroundColor:'#282c34',marginTop:'30px'}}>Inicio: </div>  
        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)'}}>
          En el inicio de la aplicación hay una lista de mapas. Si un usuario inicia sesión aparecerán sus mundos privados y bloqueados. En esta lista se pueden gestionar los mundos del usuario con los siguientes botones:            
        </div>

        <div style={{...infoItemStyles,padding:'0 30px',width:'calc(100% - 60px)',display:'flex',flexWrap:'wrap',alignItems:'center',marginTop:'15px'}}>
          <FaPlus size={20} style={{marginRight:'5px'}}/>Lanza el formulario para crear un nuevo mundo.
        </div>
        <div style={{...infoItemStyles,padding:'0 30px',width:'calc(100% - 60px)',display:'flex',flexWrap:'wrap',alignItems:'center'}}>
          <BsPencilFill size={20} style={{marginRight:'5px'}}/>Lanza el formulario para editar un mundo.
        </div>
        <div style={{...infoItemStyles,padding:'0 30px',width:'calc(100% - 60px)',display:'flex',flexWrap:'wrap',alignItems:'center'}}>
          <BsTrashFill size={20} style={{marginRight:'5px'}}/>Borra el mundo.
        </div>

        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)',marginTop:'15px'}}>
          Adicionalmente, en caso de que el usuario sea moderador o administrador aparecerá un botón más:
        </div>

        <div style={{...infoItemStyles,padding:'0 30px',width:'calc(100% - 60px)',display:'flex',flexWrap:'wrap',alignItems:'center',marginTop:'15px'}}>
          <ImBlocked size={20} style={{marginRight:'5px'}}/>Bloquea el mundo de otro usuario.
        </div> 

        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)',marginTop:'15px'}}>
          En cada uno de los mundos de la lista aparecen tres iconos que muestran sus datos:
        </div> 

        <div style={{...infoItemStyles,padding:'0 30px',width:'calc(100% - 60px)',display:'flex',flexWrap:'wrap',alignItems:'center',marginTop:'15px'}}>
          <FaMapMarkerAlt size={20} style={{marginRight:'5px'}}/>Número de marcadores.
        </div>
        <div style={{...infoItemStyles,padding:'0 30px',width:'calc(100% - 60px)',display:'flex',flexWrap:'wrap',alignItems:'center'}}>
          <BiSolidShieldAlt2 size={20} style={{marginRight:'5px'}}/>Número de facciones.
        </div>
        <div style={{...infoItemStyles,padding:'0 30px',width:'calc(100% - 60px)',display:'flex',flexWrap:'wrap',alignItems:'center'}}>
          <GiDna1 size={20} style={{marginRight:'5px'}}/>Número de culturas.
        </div> 

        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)',marginTop:'15px'}}>
          Si el mundo ha sido bloqueado por un moderador solo aparecerá en la lista si su creador ha iniciado sesión y estará marcado con rojo.
        </div>

        <div style={{...infoItemStyles,backgroundColor:'#282c34',marginTop:'30px'}}>Perfil: </div>  
        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)'}}>
          En el perfil de un usuario que haya iniciado sesión se muestran los datos del usuario y las opciones de la cuenta, que incluyen modificar los distinos datos del usuario, borrar el usuario permanentemente y cerrar sesión.
        </div> 

        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)'}}>
          En el caso de que el usuario sea administrador aparecerán dos tablas, una con usuarios normales y otra con moderadores. En estas tablas aparecen dos botones:
        </div> 

        <div style={{...infoItemStyles,padding:'0 30px',width:'calc(100% - 60px)',display:'flex',flexWrap:'wrap',alignItems:'center',marginTop:'15px'}}>
          {'<'} y {'>'} Cambia el rol de una cuenta.
        </div>
        <div style={{...infoItemStyles,padding:'0 30px',width:'calc(100% - 60px)',display:'flex',flexWrap:'wrap',alignItems:'center'}}>
          <BsTrashFill size={20} style={{marginRight:'5px'}}/>Borra el usuario permanentemente.
        </div> 

        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)',marginTop:'15px'}}>
          Tanto si el usuario ha iniciado sesión como si no, también aparece una lista de los mundos del usuario con los mismos controles que la descrita anteriormente.
        </div> 

        <div style={{...infoItemStyles,backgroundColor:'#282c34',marginTop:'30px'}}>Mundo: </div>

        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)'}}>
          Una vez seleccionado un mundo de la lista se muestra toda su información.
        </div> 

        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)'}}>
          En primer lugar aparecen los datos del mundo en sí y, si el mundo fue creado por el usuario, un botón:
        </div> 

        <div style={{...infoItemStyles,padding:'0 30px',width:'calc(100% - 60px)',display:'flex',flexWrap:'wrap',alignItems:'center',marginTop:'15px'}}>
          <BsPencilFill size={20} style={{marginRight:'5px'}}/>Lanza el formulario para editar los datos del mundo.
        </div> 

        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)',marginTop:'15px'}}>
          Más adelante se muestra una lista de los mapas que forman parte de este mundo, muy simiar a la lista de mundos.
        </div> 

        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)'}}>
          Por último se muestran seis listas mostrando los marcadores (divididos en personas, objetos y lugares) , facciones, culturas y lore. En estas listas aparecen los siguientes botones:
        </div> 

        <div style={{...infoItemStyles,padding:'0 30px',width:'calc(100% - 60px)',display:'flex',flexWrap:'wrap',alignItems:'center',marginTop:'15px'}}>
          <FaPlus size={20} style={{marginRight:'5px'}}/>Lanza el formulario para crear un nuevo marcador, facción, cultura o lore.
        </div>
        <div style={{...infoItemStyles,padding:'0 30px',width:'calc(100% - 60px)',display:'flex',flexWrap:'wrap',alignItems:'center'}}>
          <BsPencilFill size={20} style={{marginRight:'5px'}}/>Lanza el formulario para editar un marcador, facción, cultura o lore.
        </div>
        <div style={{...infoItemStyles,padding:'0 30px',width:'calc(100% - 60px)',display:'flex',flexWrap:'wrap',alignItems:'center'}}>
          <BsTrashFill size={20} style={{marginRight:'5px'}}/>Borra el marcador, facción, cultura o lore.
        </div>

        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)',marginTop:'15px'}}>
          Las facciones y culturas funcionan como dos formas de clasificar los marcadores, que se muestra con el color de sus respectivos iconos:
        </div>

        <div style={{...infoItemStyles,padding:'0 30px',width:'calc(100% - 60px)',display:'flex',flexWrap:'wrap',alignItems:'center',marginTop:'15px'}}>
          <BiSolidShieldAlt2 size={20} style={{marginRight:'5px'}}/>Facciones.
        </div>
        <div style={{...infoItemStyles,padding:'0 30px',width:'calc(100% - 60px)',display:'flex',flexWrap:'wrap',alignItems:'center'}}>
          <GiDna1 size={20} style={{marginRight:'5px'}}/>Culturas.
        </div>

        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)',marginTop:'15px'}}>
          Lore se refiere a pequeñas historias o transfondos de los marcadores del mundo. Esencialmente funcionan como notas sobre la historia del mundo.
        </div> 

        <div style={{...infoItemStyles,backgroundColor:'#282c34',marginTop:'30px'}}>Mapa: </div>  
        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)'}}>
          Una vez seleccionado un mapa, este se muestra como una instancia de MapBox.
        </div> 

        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)'}}>
          Aparte del mapa como tal aparecen listas de marcadores, facciones y culturas.
        </div> 

        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)'}}>
          En el caso de que el mapa pertenezca al usuario, éste podrá colocar los marcadores en el mapa o incluso crear nuevos marcadores, facciones y culturas sin salir de esta pantalla. Al crear o editar marcadores desde un mapa, éstos se deben colocar directamente en éste.
        </div> 

        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)'}}>
          Las listas se pueden esconder y volver a mostrar con los botones {'<'} y {'>'}.
        </div> 
      </div>      
    </div>
  );
};

export default Help;