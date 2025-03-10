import React, { useState, useEffect } from 'react';
import FactionCard from './FactionCard';
import NewFaction from './NewFaction';
import axios from 'axios';

const FactionMenu = ({worldId , mapId, map, user, handleComponentChange,  rerenderer ,  displayMarkers, hideMarker, setFactionKin, rerender, setRerender}) => {  
  const [worldOwner, setWorldOwner] = useState(-1);
  const [factions, setFactions] = useState([]);
  const [markers, setMarkers] = useState([]);  
  const [searched, setSearched] = useState('');
  const [rerenderCounter, setRerenderCounter] = useState(0);
  const [showNewForm, setShowNewForm] = useState(false);
  const [showAddButton, setShowAddButton] = useState(true);
  const [showMenu, setShowMenu] = useState(true);

  const neutral = {
    factionId: null,
    factionName: 'Sin facción',
    factionDescription: '',
    factionColor: 'black'
  };

  const menuStyles = {
    backgroundColor: '#282c34',
    height: '90vh',
    width: showMenu ? '350px':'5px',
    position: 'absolute',
    right: '0',
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
    marginRight: '0',
    padding: '10px',
    color: 'white',
  };

  const listStyles = {
    backgroundColor: '#191a21',    
    margin: '10px',
    width: '100%',
    height: '83%',
    marginRight: '0',
    padding: '10px',
    color: '#282c34',
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  const divStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    height: '10%',             
  };

  const factionCardSocketStyles = {
    padding: '5px',
    width: '100%',    
    display: 'flex',
    justifyContent: 'space-evenly'
  };

  const searchStyles = {
    display: 'flex',    
    width: '100%',    
    padding: '5px',   
    border: '2.5px solid #282c34',    
    marginRight: '-7px'
  };

  const buttonStyles = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',    
    backgroundColor: "#282c34",    
    color: 'white',    
  };

  const sliderButtonStyles = {
    display: 'flex',
    position: 'absolute',
    right: showMenu ? '350px':'5px',
    top: '10px',
    padding: '10px',
    backgroundColor: '#007bff',
    borderRadius: '10px 0 0 10px',
    textAlign: 'center',
    height: '40px',
    width: showMenu ? '20px':'70px',
    alignItems: 'center',
    cursor: 'pointer'
  };

  const handleSearch = (event) => {
    const { name, value } = event.target;
    setSearched(value);        
  };

  const checkUser = () => {
    const getWorld = async ()=>{
      try {
        const response = await axios.get(`https://lore-mapper-backend.vercel.app//world/fromWorldId/${worldId}`);
        if(worldOwner === -1){
          setWorldOwner(response.data.world.worldOwner);
        }      
      } catch (error) {
        console.error('Request error: ', error);
      }
    };
    getWorld();
    
    if(!user){
      return;
    }
    if(worldOwner === user.userId){
      return(        
        <button style={buttonStyles} onClick={()=>{setShowNewForm(true)}}>Nueva facción</button>          
      );
    };
  }; 

  const getFactions = async () => {
    try {
      const response = await axios.get(`https://lore-mapper-backend.vercel.app//faction/fromWorldId/${worldId}`);

      const updatedFactions = response.data.factions.map(faction => ({
        ...faction,
        deleted: false
      }));

      const sortedFactions = updatedFactions.sort((a, b) => {
        const countA = markers.filter(marker => marker.markerFaction === a.factionId).length;
        const countB = markers.filter(marker => marker.markerFaction === b.factionId).length;
        return countB - countA; 
      })

      setFactions(sortedFactions);      
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  const getMarkers = async () => {
    try {
        const response = await axios.get(`https://lore-mapper-backend.vercel.app//marker/fromMapId/${mapId}`);
        setMarkers(response.data.markers);
    } catch (error) {
        console.error('Request error: ', error);
    }
};

  useEffect(()=>{    
    getMarkers();
    getFactions();
    displayMarkers();
  },[mapId]);

  return (
    <div style={menuStyles}>
      <div style={sliderButtonStyles} onClick={()=>setShowMenu(!showMenu)}>{showMenu ? '>':'Facciones <'}</div>
      {!showMenu && <div style={{...sliderButtonStyles,top:'80px'}} onClick={()=>setFactionKin(false)}>{'Culturas <'}</div>}
      <div style={headerStyles}>Facciones</div>
      <div style={listStyles}>
        <div style={divStyles}>
          {!showNewForm && 
            <div style={factionCardSocketStyles}>
              <input style={searchStyles} placeholder='Buscar facción' value={searched} onChange={handleSearch}></input>        
            </div>
          }
          <div style={factionCardSocketStyles}>
            {!showNewForm && checkUser()}
            {!showNewForm && <button style={buttonStyles} onClick={()=>{setFactionKin(false)}}>Ver culturas</button>}
          </div>           
          {!showNewForm &&
            <div style={factionCardSocketStyles}>
              <FactionCard
                faction={neutral}
                handleComponentChange={handleComponentChange} 
                key={'factionneutral'}
                user={user} 
                rerenderer={rerenderer}
                displayMarkers={displayMarkers}
                hideMarker={hideMarker}
                rerenderCounter={rerenderCounter}
                worldId={worldId}
                mapId={mapId}
                map={map}
                showAddButton={showAddButton}
                setShowAddButton={setShowAddButton}
                />
            </div>
          }
          {!showNewForm ? (
            factions
              .filter(faction => new RegExp(searched, "i").test(faction.factionName))
              .map((faction, index) => (
                <div style={factionCardSocketStyles}>
                  <FactionCard
                    faction={faction} 
                    key={'faction'+index}
                    handleComponentChange={handleComponentChange}
                    user={user}
                    rerenderer={rerenderer}
                    displayMarkers={displayMarkers}
                    hideMarker={hideMarker}
                    rerenderCounter={rerenderCounter}
                    worldId={worldId}
                    mapId={mapId}
                    map={map}
                    showAddButton={showAddButton}
                    setShowAddButton={setShowAddButton}
                    />                    
                </div>
              ))
          ):(
            <NewFaction worldId={worldId} displayMarkers={displayMarkers} setShowNewForm={setShowNewForm} getFactions={getFactions}/>
          )}
        </div>  
      </div>
    </div>
  );
};

export default FactionMenu;