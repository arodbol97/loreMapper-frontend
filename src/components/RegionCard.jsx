import React, { useEffect, useState } from 'react';
import { BsTrashFill , BsEyeFill , BsEyeSlashFill , BsPencilFill  } from 'react-icons/bs';
import { BiSolidShieldAlt2 } from 'react-icons/bi';
import axios from 'axios';

const RegionCard = ({region, user, worldId, mapId, maps }) => {
  const mapCardStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
    width: '100%',
    transition: 'transform 0.3s',
    color: 'white',
    padding: '5px',
    '&:hover': {
      transform: 'scale(1.05)',
    },
    border: '2.5px solid #282c34',    
    marginRight: '0px',    
  };

  const buttonStyles = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    width: '35px',
    backgroundColor: "#282c34",    
    color: 'white'
  };

  const selectButtonStyles = {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    cursor: 'pointer',    
    backgroundColor: "#282c34",    
    color: 'white',
    marginRight: '10px',
    width: '35px',
    height: '26px'
  };

  const colorStyles = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: region.regionColor || 'grey',
    justifyContent: 'center',
    color: 'white',
    height: '26px',
    width: '26px',
    marginRight: '5px',
    borderRadius: '20px'
  };

  const buttonsStyles = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  };

  const formButtonStyles = {
    color: 'white',
    fontWeight: 'bold',
    width: '50%',
    cursor: 'pointer'
  };

  const spanStyles = {
    overflowX: 'hidden',
    width: '100%',
    paddingBottom: '20px',
  };

  const statsStyles = {
    paddingTop: '5px',
    marginTop: '5px',
    borderTop: '2.5px solid #282c34',
    width: '100%',
  };

  const statStyles = {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '10px 0 10px 0',
    textAlign: 'left'
  }

  const cardHeaderStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',   
    cursor: 'pointer' 
  }

  const errorStyles = {
    width: '100%',
    textAlign: 'center',
    color: 'red',
    fontSize: '15px',
  };

  const [hoveredCard, setHoveredCard] = useState(false);    
  const [stats, setStats] = useState(false);
  const [worldOwner, setWorldOwner] = useState(-1);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    regionId: region.regionId,
    regionName: region.regionName,
    regionMap: "maps.find(map => map.mapId === region.regionMap).mapName",
    regionPosition: region.regionPosition
  });

  
  
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleCardHover = () => {
    setHoveredCard(true);
  };

  const handleCardLeave = () => {
    setHoveredCard(false);
  };

  const checkUser = () => {    
    const getWorld = async () => {
      try {
        const response = await axios.get(`https://lore-mapper-backend.vercel.app//world/fromWorldId/${worldId}`);
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
        <button style={buttonStyles} onClick={(e) => {e.stopPropagation(); setEditing(!editing)}}><BsPencilFill size={20}/></button>
      );
    };
  }; 

  const handleSubmit = async (event) => {
    event.preventDefault();
        
    try {
      const response = await axios.post('https://lore-mapper-backend.vercel.app//region/update', formData);          
      const requestData = response.data.requestData;          
      if (!requestData.updated) {
        document.getElementById('formError').innerHTML = requestData.error;
      } else {
        setEditing(false); 
        region.regionName = formData.regionName;
        region.regionMap = formData.regionMap;
        region.regionPosition = formData.regionPosition;
      }
    } catch (error) {
      console.error('Create error: ', error);
      document.getElementById('formError').innerHTML = error.message;
    }
  };

  useEffect(() => {
  }, []);

  return (    
    <div
      key={region.regionId}
      style={{
        ...mapCardStyles,
        transform: hoveredCard ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.3s',
      }}
      onMouseEnter={handleCardHover}
      onMouseLeave={handleCardLeave}>
        <div style={cardHeaderStyles} >
          <div style={buttonsStyles}>
            <div style={colorStyles}><BiSolidShieldAlt2 size={18}/></div>            
          </div>        
          <div style={buttonsStyles}>            
            {user && checkUser()}
          </div>
          <span style={spanStyles}>{region.regionName}</span>
        </div>
        
        {editing &&          
          <div style={statsStyles}>            
            <form onSubmit={handleSubmit}>
              <div style={{...statStyles, backgroundColor: '#282c34'}}>Nombre:</div>
              <div style={{...statStyles}}>
                <input
                  type="text"
                  value={formData.regionName}
                  onChange={e => handleInputChange('regionName', e.target.value)}
                  style={{width: '100%'}}
                />
              </div>

              <div style={{...statStyles, backgroundColor: '#282c34'}}>Mapa:</div>
              <div style={{...statStyles}}>
                <input
                  type="text"
                  value={formData.regionMap}
                  onChange={e => handleInputChange('regionMap', e.target.value)}
                  style={{width: '100%'}}
                />
              </div>

              <div style={{...statStyles, backgroundColor: '#282c34'}}>Posición:</div>
              <div style={{...statStyles,paddingBottom:'0'}}>
                
              </div>          

              <div style={statStyles}>
                <button style={{...formButtonStyles, backgroundColor:'red'}} type="button" onClick={() => {setEditing(false)}}>Cancelar</button>
                <button style={{...formButtonStyles, backgroundColor:'#007bff'}} type="submit">Confirmar</button>
              </div>
              <span id="formError" style={errorStyles}></span>
            </form>            
          </div>          
        }        
    </div>
  );
};

export default RegionCard;