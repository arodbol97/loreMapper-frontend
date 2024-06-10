import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapCard from './MapCard';
import MapBox from './MapBox';
import { FaPlus } from "react-icons/fa";
import NewMap from './NewMap';

const MapList = ({worldId , handleComponentChange , user , worldName}) => {
  const divStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    margin:'10px',
    marginTop: '-5px',
    //justifyContent: 'center'
  };

  const mapCardSocketStyles = {
    width:'calc(33.3333333% - 20px)',
    margin:'10px',
  };

  const titleStyles = {      
    width: '100%',
    backgroundColor: '#007bff',
    color: 'white',
    textAlign: 'center',
    border: '2px solid #282c34',
    margin: '10px 0'
  };

  const consoleStyles = {
    padding: '5px 5px',
    width: 'calc(100% - 0px)',
    margin: '0px 0px',
    display: 'flex',
    justifyContent: 'space-between',
    border: '2px solid #282c34',
  };

  const searchStyles = {
    display: 'flex',    
    width: '89%',    
    padding: '5px',   
    border: '2.5px solid #282c34',
    backgroundColor: '#282c34',    
    color: 'white',   
  };

  const buttonStyles = {
    display: 'flex',
    width: '150px',
    marginLeft: '5px',
    alignItems: 'center',    
    cursor: 'pointer',    
    backgroundColor: "#282c34",    
    color: 'white',    
    justifyContent: 'space-evenly'
  };

  const paginationControlsStyles = {
    display: 'flex',
    width: '100%',
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

  const [maps, setMaps] = useState([]);
  const [newMap, setNewMap] = useState(false);
  const [selectedMap, setSelectedMap] = useState(null);
  const [worldOwner, setWorldOwner] = useState(-1);
  const [searched, setSearched] = useState('');
  const [page, setPage] = useState(0);
  const mapsPerPage = 12;

  const handlePageChange = (newPage) => {
    setPage(newPage);
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

  const getMaps = async () => {
    try {
      const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/map/fromWorld/${worldId}`);
      setMaps(response.data.maps);
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  const getWorld = async ()=>{
    try {
      const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/world/fromWorldId/${worldId}`);
      setWorldOwner(response.data.world.worldOwner);
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  const selectMap = (id) => {
    setSelectedMap(id);
  }

  /*const newMap = () => {
    handleComponentChange(<NewMap worldId={worldId} worldName={worldName} handleComponentChange={handleComponentChange}/>,"Añadir Mapa");
  };*/

  useEffect(() => {
    getMaps();
    getWorld();
  }, []);

  if (selectedMap !== null) {
    handleComponentChange(<MapBox user={user} worldId={worldId} mapId={selectedMap.mapId} handleComponentChange={handleComponentChange} mapData={selectedMap}/>,selectedMap.mapName);
  }


  return (
    <div style={divStyles}>
      <h2 style={titleStyles}>Mapas</h2>
      {!newMap &&
          <div style={consoleStyles}>
            <input
              type="text"
              placeholder="Buscar mapa"
              value={searched}            
              onChange={(e) => setSearched(e.target.value)}
              style={{...searchStyles, width: user && worldOwner === user.userId ? '89%':'100%'}}
            />
            {user && worldOwner === user.userId && <button onClick={()=>{setNewMap(true)}} style={buttonStyles}><FaPlus size={20}/>Nuevo mapa</button>}
          </div>
      }
      {maps && !newMap &&
        maps
          .filter(map => new RegExp(searched, "i").test(map.mapName))
          .slice(page * mapsPerPage, (page + 1) * mapsPerPage)
          .map((map, index) => (
            <div
              style={mapCardSocketStyles}
              key={index}
              onClick={() => selectMap(map)}>

              <MapCard map={map} key={map.mapId} user={user} worldId={worldId} getMaps={getMaps} maps={maps}/>
            </div>
        ))}
        {maps && maps.filter(map => new RegExp(searched, "i").test(map.mapName)).length > mapsPerPage && !newMap &&
          <div style={paginationControlsStyles}>
            <button style={paginationButtonStyles} onClick={() => setPage(page - 1)} disabled={page === 0}>
              {'<'}
            </button>
            {generatePageNumbers(Math.ceil(maps.filter(map => new RegExp(searched, "i").test(map.mapName)).length / mapsPerPage), page, handlePageChange)}
            <button style={paginationButtonStyles} onClick={() => setPage(page + 1)} disabled={maps.filter(map => new RegExp(searched, "i").test(map.mapName)).length <= (page + 1) * mapsPerPage}>
              {'>'}
            </button>
          </div>
        }
      {newMap && <NewMap worldId={worldId} worldName={worldName} getMaps={getMaps} setNewMap={setNewMap} maps={maps}/>}      
    </div>
  );
};

export default MapList;