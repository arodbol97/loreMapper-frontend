import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WorldCard from './WorldCard';
import World from './World';
import { FaPlus , FaMapMarkerAlt } from "react-icons/fa";
import { BiSolidShieldAlt2 } from "react-icons/bi";
import { GiDna1 } from "react-icons/gi";
import NewWorld from './NewWorld';

const WorldList = ({worlds , handleComponentChange , user , profileUser, getWorlds}) => {
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
    
  const [newWorld, setNewWorld] = useState(false);
  const [selectedWorld, setSelectedWorld] = useState(null);  
  const [searched, setSearched] = useState('');
  const [publicPage, setPublicPage] = useState(0);
  const [privatePage, setPrivatePage] = useState(0);
  const worldsPerPage = 12;

  const handlePublicPageChange = (newPage) => {
    setPublicPage(newPage);
  };

  const handlePrivatePageChange = (newPage) => {
    setPrivatePage(newPage);
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

  const selectWorld = (id) => {
    setSelectedWorld(id);
  }

  useEffect(() => {    
  }, [worlds,newWorld]);

  if (selectedWorld !== null) {
    handleComponentChange(<World user={user} worldId={selectedWorld.worldId} handleComponentChange={handleComponentChange} worldData={selectedWorld}/>,selectedWorld.worldName,0);
  }


  return (
    <div style={divStyles}>
      <h2 style={titleStyles}>Mundos</h2>
      {!newWorld &&
          <div style={consoleStyles}>
            <input
              type="text"
              placeholder="Buscar mundo"
              value={searched}            
              onChange={(e) => setSearched(e.target.value)}
              style={{...searchStyles, width: user ? '89%':'100%'}}
            />
            {user && <button onClick={()=>{setNewWorld(true)}} style={buttonStyles}><FaPlus size={20}/>Nuevo mundo</button>}
          </div>
      }
      {worlds && !newWorld &&
        worlds
          .filter(world => new RegExp(searched, "i").test(world.worldName))
          .filter(world => world.worldVisibility === 'public')
          .filter(world => world.worldStatus === 'active' || (user && user.userRol === 'mod') || (user && user.userRol === 'admin') || (user && user.userId === world.worldOwner))
          .slice(publicPage * worldsPerPage, (publicPage + 1) * worldsPerPage)
          .map((world, index) => (
            <div
              style={mapCardSocketStyles}
              key={index}
              onClick={() => handleComponentChange(<World user={user} worldId={world.worldId} handleComponentChange={handleComponentChange} worldData={world}/>,world.worldName,0)}>

              <WorldCard world={world} key={world.worldId} user={user} getWorlds={getWorlds}/>
            </div>
        ))}
        {worlds && worlds.filter(world => new RegExp(searched, "i").test(world.worldName)).filter(world => world.worldVisibility === 'public').filter(world => world.worldStatus === 'active' || (user && user.userRol === 'mod') || (user && user.userRol === 'admin') || (user && user.userId === world.worldOwner)).length > worldsPerPage && !newWorld &&
          <div style={paginationControlsStyles}>
            <button style={paginationButtonStyles} onClick={() => setPublicPage(publicPage - 1)} disabled={publicPage === 0}>
              {'<'}
            </button>
            {generatePageNumbers(Math.ceil(worlds.filter(world => new RegExp(searched, "i").test(world.worldName)).filter(world => world.worldVisibility === 'public').filter(world => world.worldStatus === 'active' || (user && user.userRol === 'mod') || (user && user.userRol === 'admin') || (user && user.userId === world.worldOwner)).length / worldsPerPage), publicPage, handlePublicPageChange)}
            <button style={paginationButtonStyles} onClick={() => setPublicPage(publicPage + 1)} disabled={worlds.filter(world => new RegExp(searched, "i").test(world.worldName)).filter(world => world.worldVisibility === 'public').filter(world => world.worldStatus === 'active' || (user && user.userRol === 'mod') || (user && user.userRol === 'admin') || (user && user.userId === world.worldOwner)).length <= (publicPage + 1) * worldsPerPage}>
              {'>'}
            </button>
          </div>
        }

        {user && worlds && worlds.filter(world => world.worldVisibility === 'private' && world.worldOwner === user.userId).filter(world => new RegExp(searched, "i").test(world.worldName)).length > 0 &&
          <h2 style={{...titleStyles,backgroundColor:'#191a21'}}>Tus mundos privados</h2>
        }
        {user && worlds && worlds.filter(world => world.worldVisibility === 'private' && world.worldOwner === user.userId).length > 0 && !newWorld &&
          worlds
            .filter(world => new RegExp(searched, "i").test(world.worldName))
            .filter(world => world.worldVisibility === 'private' && world.worldOwner === user.userId)            
            .slice(privatePage * worldsPerPage, (privatePage + 1) * worldsPerPage)
            .map((world, index) => (
              <div
                style={mapCardSocketStyles}
                key={index}
                onClick={() => handleComponentChange(<World user={user} worldId={world.worldId} handleComponentChange={handleComponentChange} worldData={world}/>,world.worldName,0)}>

                <WorldCard world={world} key={world.worldId} user={user} getWorlds={getWorlds}/>
              </div>
          ))}
          {worlds && worlds.filter(world => new RegExp(searched, "i").test(world.worldName)).filter(world => world.worldVisibility === 'private').length > worldsPerPage && !newWorld &&
            <div style={paginationControlsStyles}>
              <button style={paginationButtonStyles} onClick={() => setPrivatePage(privatePage - 1)} disabled={privatePage === 0}>
                {'<'}
              </button>
              {generatePageNumbers(Math.ceil(worlds.filter(world => new RegExp(searched, "i").test(world.worldName)).length / worldsPerPage), privatePage, handlePrivatePageChange)}
              <button style={paginationButtonStyles} onClick={() => setPrivatePage(privatePage + 1)} disabled={worlds.filter(world => new RegExp(searched, "i").test(world.worldName)).length <= (privatePage + 1) * worldsPerPage}>
                {'>'}
              </button>
            </div>
      }
      {newWorld && <NewWorld getWorlds={getWorlds} setNewWorld={setNewWorld} user={user}/>}      
    </div>
  );
};

export default WorldList;