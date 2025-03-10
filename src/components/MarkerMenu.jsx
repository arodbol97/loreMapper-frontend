import React, { useState, useEffect } from 'react';
import List from './List';
import MarkerMakers from './MarkerMakers';
import MapBox from './MapBox';
import World from './World';
import Profile from './Profile';
import axios from 'axios';

const MarkerMenu = ({worldId , mapId, map, mapData, user, handleComponentChange,  rerenderer ,  displayMarkers, hideMarker, hoveredMarker, setHoveredMarker }) => {
  const [comp, setComp] = useState(null);
  const [worldOwner, setWorldOwner] = useState(null);
  const [world, setWorld] = useState(null);
  const [parent, setParent] = useState(null);
  const [showMenu, setShowMenu] = useState(true);

  const handleListChange = (newComp) => {
    setComp(newComp);
  };

  const menuStyles = {
    backgroundColor: '#282c34',
    height: '90vh',
    width: showMenu ? '350px':'5px',
    position: 'absolute',
    left: '0',
    top: '10vh',
    display: 'flex',
    flexWrap: 'wrap',
    color: 'white',    
  };

  const headerStyles = {
    backgroundColor: '#007bff',    
    fontSize: '25px',
    textAlign: 'center',
    margin: '10px',
    width: '100%',
    height: '40px',
    marginLeft: '0',
    padding: '10px',
    color: 'white',
  };

  const listStyles = {
    backgroundColor: '#191a21',    
    margin: '10px',
    width: '100%',
    height: '65%',
    marginLeft: '0',
    padding: '10px',
    color: '#282c34',
    overflowY: 'auto',
  };

  const makerStyles = {
    backgroundColor: '#191a21',    
    margin: '10px',
    width: '100%',
    height: '10%',
    marginLeft: '0',
    marginBottom: '23px',
    padding: '10px',
    color: '#282c34',
  };

  const infoStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',    
    padding: '0',    
    color: 'white'
  };

  const infoItemStyles = {
    margin: ' 0',
    width: '100%',
    overflowX: 'hidden',
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '2px solid #282c34'
  };

  const parentStyles = {
    textDecoration: 'underline',
    cursor: 'pointer'
  };

  const sliderButtonStyles = {
    display: 'flex',
    position: 'absolute',
    left: showMenu ? '350px':'5px',
    top: '10px',
    padding: '10px',
    backgroundColor: '#007bff',
    borderRadius: '0 10px 10px 0',
    textAlign: 'center',
    height: '40px',
    width: showMenu ? '20px':'90px',
    alignItems: 'center',
    cursor: 'pointer'
  };

  const checkUser = () => {
    const getOwner = async (worldOwnerId) => {
      try {
        const response = await axios.get(`https://lore-mapper-backend.vercel.app//user/fromId/${worldOwnerId}`);
        setWorldOwner(response.data.user);
      } catch (error) {
        console.error('Request error: ', error);
      }
    };

    const getWorld = async ()=>{
      try {
        const response = await axios.get(`https://lore-mapper-backend.vercel.app//world/fromWorldId/${worldId}`);
        if(!worldOwner){
          setWorld(response.data.world);
          getOwner(response.data.world.worldOwner);
        }      
      } catch (error) {
        console.error('Request error: ', error);
      }
    };

    getWorld();

    if(!user ||(worldOwner && user.userId !== worldOwner.userId)){
      return(
        <div style={infoStyles}>
            {worldOwner && <div style={infoItemStyles}><span>Propietario: </span><span style={parentStyles} onClick={()=>{handleComponentChange(<Profile profileUser={worldOwner} user={user} handleComponentChange={handleComponentChange}/>, 'Perfil de ' + worldOwner.userName, 0)}}>{worldOwner.userName}</span></div>}
            <div style={infoItemStyles}><span>Nombre: </span><span>{mapData.mapName}</span></div>
            {world && <div style={infoItemStyles}><span>Mundo: </span><span style={parentStyles} onClick={()=>{handleComponentChange(<World worldId={worldId}/>,world.worldName)}}>{world.worldName}</span></div>}
            {world && <div style={{...infoItemStyles,borderBottom:'0'}}><span>Región de: </span>{parent ? <span style={parentStyles} onClick={()=>{handleComponentChange(<MapBox user={user} worldId={worldId} mapId={parent.mapId} handleComponentChange={handleComponentChange} mapData={parent}/>,parent.mapName,1)}}>{parent.mapName}</span>:<span>Ningún mapa</span>}</div>}
        </div>
      );
    }
    if(worldOwner && user.userId === worldOwner.userId){     
      return(
        <MarkerMakers 
          worldId={worldId} 
          mapId={mapId} 
          handleListChange={handleListChange} 
          map={map} 
          displayMarkers={displayMarkers} 
          hideMarker={hideMarker} 
          user={user}/>
      );
    }
  }; 

  const getParent = async ()=>{
    try {
      const response = await axios.get(`https://lore-mapper-backend.vercel.app//map/fromId/${mapData.mapParent}`);
      setParent(response.data.map);                  
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  useEffect(()=>{    
    if(mapData.mapParent){
      getParent();
    } else {
      setParent(null);
    }
  },[mapId]);

  return (
    <div style={menuStyles}>
      <div style={sliderButtonStyles} onClick={()=>setShowMenu(!showMenu)}>{showMenu ? '<':'Marcadores >'}</div>
      {showMenu && <div style={headerStyles}>Marcadores</div>}
      {showMenu && <div style={listStyles}>
        {!comp && 
          <List 
            worldId={worldId} 
            mapId={mapId} 
            handleComponentChange={handleComponentChange} 
            user={user} 
            rerenderer={rerenderer} 
            displayMarkers={displayMarkers} 
            hideMarker={hideMarker} 
            map={map} 
            hoveredMarker={hoveredMarker} 
            setHoveredMarker={setHoveredMarker}/>
        }
        {comp && comp}
      </div>}
      {showMenu && <div style={makerStyles}>
        {checkUser()}
      </div>}
    </div>
  );
};

export default MarkerMenu;