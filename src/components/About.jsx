import React from 'react';

const About = ({handleComponentChange}) => {    
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
        <h2 style={titleStyles}>Acerca de LoreMapper</h2>
        <div style={{...infoItemStyles,backgroundColor:'#282c34'}}>Desarrollador: </div>  
        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)'}}>Antonio Rodríguez Bolancé</div>  

        <div style={{...infoItemStyles,backgroundColor:'#282c34'}}>Instituto: </div>  
        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)'}}>IES Trassierra</div>  

        <div style={{...infoItemStyles,backgroundColor:'#282c34'}}>Tecnologías usadas en el frontEnd: </div>  
        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)'}}>React y MapBox</div>  

        <div style={{...infoItemStyles,backgroundColor:'#282c34'}}>Tecnologías usadas en el backEnd: </div>  
        <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)'}}>mySQL y Express</div>        
      </div>         
    </div>
  );
};

export default About;