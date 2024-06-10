import React, { useState, useEffect } from 'react';
import RegionCard from './RegionCard';
import NewRegion from './NewRegion';
import axios from 'axios';

const RegionMenu = ({ worldId, user, handleComponentChange, setRegionKin, mapId }) => {
  const [worldOwner, setWorldOwner] = useState(-1);
  const [regions, setRegions] = useState([]);
  const [maps, setMaps] = useState([]);
  const [searched, setSearched] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [showAddButton, setShowAddButton] = useState(true);

  const menuStyles = {
    backgroundColor: '#282c34',
    height: '40vh',
    width: '350px',
    position: 'absolute',
    right: '0',
    top: '60vh',
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
    height: '65%',
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

  const regionCardSocketStyles = {
    padding: '5px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',
  };

  const searchStyles = {
    display: 'flex',
    width: '100%',
    padding: '5px',
    border: '2.5px solid #282c34',
    marginRight: '-7px',
  };

  const buttonStyles = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: "#282c34",
    color: 'white',
  };

  const handleSearch = (event) => {
    const { name, value } = event.target;
    setSearched(value);
  };

  const checkUser = () => {
    const getWorld = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/world/fromWorldId/${worldId}`);
        if (worldOwner === -1) {
          setWorldOwner(response.data.world.worldOwner);
        }
      } catch (error) {
        console.error('Request error: ', error);
      }
    };
    getWorld();

    if (!user) {
      return;
    }
    if (worldOwner === user.userId) {
      return (
        <button style={buttonStyles} onClick={() => { setShowNewForm(true) }}>Nueva región</button>
      );
    };
  };

  const getRegions = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/region/fromMapId/${mapId}`);
      const updatedRegions = response.data.regions.map(region => ({
        ...region,
        deleted: false
      }));
      setRegions(updatedRegions);
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  const getMaps = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/map/fromWorld/${worldId}`);
      const updatedMaps = response.data.maps;
      setMaps(updatedMaps);
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  useEffect(() => {
    getRegions();
    getMaps();
  }, []);

  return (
    <div style={menuStyles}>
      <div style={headerStyles}>Regiones</div>
      <div style={listStyles}>
        <div style={divStyles}>
          {!showNewForm &&
            <div style={regionCardSocketStyles}>
              <input style={searchStyles} placeholder='Buscar región' value={searched} onChange={handleSearch}></input>
            </div>
          }
          <div style={regionCardSocketStyles}>
            {!showNewForm && user && checkUser()}
            {!showNewForm && <button style={buttonStyles} onClick={() => { setRegionKin(false) }}>Mostrar / Ocultar</button>}
          </div>
          {!showNewForm && regions
            .filter(region => new RegExp(searched, "i").test(region.regionName))
            .map((region, index) => (
              <div style={regionCardSocketStyles} key={region.regionId}>
                <RegionCard
                  region={region}
                  handleComponentChange={handleComponentChange}
                  user={user}
                  showAddButton={showAddButton}
                  setShowAddButton={setShowAddButton}
                  maps={maps}
                />
              </div>
            ))}
          {showNewForm && (
            <NewRegion worldId={worldId} setShowNewForm={setShowNewForm} getRegions={getRegions} maps={maps}/>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegionMenu;