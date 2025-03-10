import React, { useState, useEffect } from 'react';
import KinCard from './KinCard';
import NewKin from './NewKin';
import axios from 'axios';

const KinMenu = ({worldId , mapId, map, user, handleComponentChange,  rerenderer ,  displayMarkers, hideMarker, setFactionKin, rerender, setRerender}) => {  
  const [worldOwner, setWorldOwner] = useState(-1);
  const [kins, setKins] = useState([]);
  const [markers, setMarkers] = useState([]);  
  const [searched, setSearched] = useState('');
  const [rerenderCounter, setRerenderCounter] = useState(0);
  const [showNewForm, setShowNewForm] = useState(false);
  const [showAddButton, setShowAddButton] = useState(true);
  const [showMenu, setShowMenu] = useState(true);

  const neutral = {
    kinId: null,
    kinName: 'Sin cultura',
    kinDescription: '',
    kinColor: 'black'
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

  const kinCardSocketStyles = {
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
        <button style={buttonStyles} onClick={()=>{setShowNewForm(true)}}>Nueva cultura</button>          
      );
    };
  }; 

  const getKins = async () => {
    try {
      const response = await axios.get(`https://lore-mapper-backend.vercel.app//kin/fromWorldId/${worldId}`);

      const updatedKins = response.data.kins.map(kin => ({
        ...kin,
        deleted: false
      }));

      const sortedKins = updatedKins.sort((a, b) => {
        const countA = markers.filter(marker => marker.markerKin === a.kinId).length;
        const countB = markers.filter(marker => marker.markerKin === b.kinId).length;
        return countB - countA;
      })

      setKins(sortedKins);      
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
    getKins();
    displayMarkers();
  },[]);

  return (
    <div style={menuStyles}>
      {!showMenu && <div style={{...sliderButtonStyles,top:'80px'}} onClick={()=>setFactionKin(true)}>{'Facciones <'}</div>}
      <div style={sliderButtonStyles} onClick={()=>setShowMenu(!showMenu)}>{showMenu ? '>':'Culturas <'}</div>      
      <div style={headerStyles}>Culturas</div>
      <div style={listStyles}>
        <div style={divStyles}>
          {!showNewForm && 
            <div style={kinCardSocketStyles}>
              <input style={searchStyles} placeholder='Buscar cultura' value={searched} onChange={handleSearch}></input>        
            </div>
          }
          <div style={kinCardSocketStyles}>
            {!showNewForm && checkUser()}
            {!showNewForm && <button style={buttonStyles} onClick={()=>{setFactionKin(true)}}>Ver facciones</button>}
          </div>           
          {!showNewForm &&
            <div style={kinCardSocketStyles}>
              <KinCard
                kin={neutral}
                handleComponentChange={handleComponentChange} 
                key={0}
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
            kins
              .filter(kin => new RegExp(searched, "i").test(kin.kinName))
              .map((kin, index) => (
                <div style={kinCardSocketStyles}>
                  <KinCard
                    kin={kin} 
                    key={kin.kinId}
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
            <NewKin worldId={worldId} displayMarkers={displayMarkers} setShowNewForm={setShowNewForm} getKins={getKins}/>
          )}
        </div>  
      </div>
    </div>
  );
};

export default KinMenu;