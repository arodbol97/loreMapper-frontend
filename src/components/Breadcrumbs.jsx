import React, { useEffect } from 'react';
import Home from './Home';

const Breadcrumbs = ({ path , handleComponentChange}) => {

  const divStyles = {    
    minHeight: '50px',
    display: 'flex',
    flexDirection: 'right',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    position:'absolute',
    top: '20px',
    left: '10px'
  };

  const breadcrumbStyles = {
    cursor: 'pointer',
    padding: '5px',
    borderRight: '1px solid grey'
  };

  const navigate = (component , label ) => {        
    handleComponentChange(component , label);
  }

  useEffect(() => {
    
  }, [path]); 

  return (
    <div style={divStyles}>
      <span onClick={()=>{window.location.href = 'http://localhost:3000/'}} style={path.length > 0 ? breadcrumbStyles:{...breadcrumbStyles,borderRight:'none'}}>Inicio</span>
      {path.map((node, index) => (        
        <span key={index} onClick={()=>navigate(node.component, node.label)} style={index === path.length - 1 ? {...breadcrumbStyles,borderRight:'none'} : breadcrumbStyles}>{node.label}</span>
      ))}
    </div>
  );
};

export default Breadcrumbs;