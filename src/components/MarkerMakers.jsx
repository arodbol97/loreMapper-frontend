import React, {  } from 'react';
import { BsBoxFill, BsHouseFill, BsPersonFill } from 'react-icons/bs';
import NewMarker from './NewMarker';

const MarkerMakers = ({worldId , mapId, handleListChange, map, displayMarkers, hideMarker, user}) => {  
  
  const divStyles = {        
    width: '100%',
    height: '100%',   
    display: 'flex',
    flexWrap: 'wrap' 
  };

  const makerStyles = {
    width: '33%',    
    backgroundColor: 'white',    
  };

  const titleStyles = {        
    width: '100%',
    color: 'white',
    textAlign: 'center',
    margin: '0',
  };  

  return (
    <div style={divStyles}>
      <h3 style={titleStyles}>Colocar en el mapa</h3>
      <button style={makerStyles} onClick={()=>handleListChange(<NewMarker worldId={worldId} mapId={mapId} type={'person'} handleListChange={handleListChange} map={map} displayMarkers={displayMarkers} hideMarker={hideMarker} user={user}/>)}>
        <BsPersonFill size={20} style={{ marginRight: '5px' }} />
        Persona
      </button>      
      <button style={makerStyles} onClick={()=>handleListChange(<NewMarker worldId={worldId} mapId={mapId} type={'object'} handleListChange={handleListChange} map={map} displayMarkers={displayMarkers} hideMarker={hideMarker} user={user}/>)}>
        <BsBoxFill size={20} style={{ marginRight: '5px' }} />
        Objeto
      </button>
      <button style={makerStyles} onClick={()=>handleListChange(<NewMarker worldId={worldId} mapId={mapId} type={'place'}  handleListChange={handleListChange} map={map} displayMarkers={displayMarkers} hideMarker={hideMarker} user={user}/>)}>
        <BsHouseFill size={20} style={{ marginRight: '5px' }} />
        Lugar
      </button>      
    </div>
  );
};

export default MarkerMakers;