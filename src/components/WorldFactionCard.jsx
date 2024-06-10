import React, { useEffect, useState } from 'react';
import { BsTrashFill , BsEyeFill , BsEyeSlashFill , BsPencilFill  } from 'react-icons/bs';
import { FaPlus , FaMapMarkerAlt } from "react-icons/fa";
import { BiSolidShieldAlt2 } from "react-icons/bi";
import { BsBoxFill, BsHouseFill, BsPersonFill } from 'react-icons/bs';
import axios from 'axios';

const WorldFactionCard = ({faction, user, worldId, markers, getFactions}) => {
  const mapCardStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
    width: '95%',
    transition: 'transform 0.3s',
    color: 'white',
    padding: '5px',
    '&:hover': {
      transform: 'scale(1.05)',
    },
    border: '2.5px solid #282c34',      
    marginRight: '10px'
  };

  const buttonStyles = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    width: '35px',
    backgroundColor: "#282c34",    
    color: 'white'
  };

  const colorStyles = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: faction.factionColor,
    justifyContent: 'center',
    color: 'white',
    height:'26px',
    width:'26px',
    marginRight:'5px',
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
  const [worldOwner, setWorldOwner] = useState(-1);
  const [stats, setStats] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    factionId: faction.factionId,
    factionName: faction.factionName,
    factionDescription: faction.factionDescription,
    factionColor: faction.factionColor
  });
  
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleCardHover = (index) => {
    if(!index){index=1}
    setHoveredCard(true);
  };

  const handleCardLeave = () => {
    setHoveredCard(false);
  };  

  const checkUser = ()=> {
    const getWorld = async ()=>{
      try {
        const response = await axios.get(`http://localhost:3001/world/fromWorldId/${worldId}`);
        if(worldOwner === -1){
          setWorldOwner(response.data.world.worldOwner);
        }      
      } catch (error) {
        console.error('Request error: ', error);
      }
    };
    getWorld();      
  }; 

  const showStats = () => {    
    setStats(!stats);  
    setEditing(false);    
  };

  const deleteFaction = async () => {
    if (window.confirm('¿Seguro que desea eliminar esta facción permanentemente?')) {
      try {
        const response = await axios.get(`http://localhost:3001/faction/delete/${faction.factionId}`);
        if(response.data.deleted){
          getFactions();
        }      
      } catch (error) {
        console.error('Request error: ', error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
        
    try {
      const response = await axios.post('http://localhost:3001/faction/update', formData);          
      const requestData = response.data.requestData;          
      if (!requestData.updated) {
        document.getElementById('formError').innerHTML = requestData.error;
      } else {
        setEditing(false); 
        faction.factionName = formData.factionName;
        faction.factionDescription = formData.factionDescription;
        faction.factionColor = formData.factionColor;
        getFactions();
      }
    } catch (error) {
      console.error('Create error: ', error);
      document.getElementById('formError').innerHTML = error.message;
    }
  };  

  useEffect(()=>{        
  },[]);
  
  return (    
    <div
      key={faction.factionId}
      style={{
        ...mapCardStyles,
        transform: hoveredCard ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.3s',
      }}
      onMouseEnter={() => handleCardHover(faction.factionId)}
      onMouseLeave={handleCardLeave}>
        <div style={cardHeaderStyles} onClick={()=>{showStats()}}>
          <div style={buttonsStyles}>
            <div style={colorStyles}><BiSolidShieldAlt2 size={18}/></div>            
          </div>        
          <div style={buttonsStyles}>
            {faction.factionId && user && user.userId === worldOwner && <button style={buttonStyles} onClick={(e)=>{e.stopPropagation();deleteFaction()}}><BsTrashFill size={20}/></button>}            
            {faction.factionId && stats && user && user.userId === worldOwner && <button style={buttonStyles} onClick={(e)=>{e.stopPropagation();setEditing(!editing)}}><BsPencilFill size={20}/></button>}            
            {user && checkUser()}
          </div>
          <span style={spanStyles}>{faction.factionName.length > 0 ? faction.factionName:'Sin nombre'}</span>
        </div>
        
        {stats && faction.factionId &&          
          <div style={statsStyles}>
            {!editing ? (
              <div>
                <div style={{...statStyles, backgroundColor: '#282c34'}}>Nombre:</div>
                <div style={{...statStyles, paddingLeft: '10px',width:'calc(100% - 10px)'}}>{faction.factionName}</div>

                <div style={{...statStyles, backgroundColor: '#282c34'}}>Descripción:</div>
                <div style={{...statStyles, paddingLeft: '10px',width:'calc(100% - 10px)'}}>{faction.factionDescription}</div>

                <div style={{...statStyles, backgroundColor: '#282c34'}}>Color:</div>
                <div style={{...statStyles, padding: '0 10px 0 10px', backgroundColor: faction.factionColor, width: '1%', height: '20px', marginLeft: '10px', border: '1px solid white'}}>
                  <div style={{marginLeft:'20px'}}>{faction.factionColor}</div>
                </div>                
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{...statStyles, backgroundColor: '#282c34'}}>Nombre:</div>
                <div style={{...statStyles}}>
                  <input
                    type="text"
                    value={formData.factionName}
                    onChange={e => handleInputChange('factionName', e.target.value)}
                    style={{width: '100%'}}
                  />
                </div>

                <div style={{...statStyles, backgroundColor: '#282c34'}}>Descripción:</div>
                <div style={{...statStyles}}>
                  <textarea
                    value={formData.factionDescription}
                    onChange={e => handleInputChange('factionDescription', e.target.value)}
                    style={{width: '100%', height: '60px', resize: 'vertical'}}
                  />
                </div>

                <div style={{...statStyles, backgroundColor: '#282c34'}}>Color:</div>
                <div style={{...statStyles, width: '100%', height: '20px'}}>
                  <input
                    type="color"
                    value={formData.factionColor}

                    onChange={e => handleInputChange('factionColor', e.target.value)}
                    style={{width: '100%'}}
                  />
                </div>

                <div style={statStyles}>
                  <button style={{...formButtonStyles,backgroundColor:'red'}} type="button" onClick={()=>{setEditing(false)}}>Cancelar</button>
                  <button style={{...formButtonStyles,backgroundColor:'#007bff'}} type="submit">Confirmar</button>
                </div>
                <span id="formError" style={errorStyles}></span>
              </form>
            )}            
          </div>          
        }        
        {stats && 
          <div style={statsStyles}>
            <div style={{...statStyles, backgroundColor: '#282c34'}}>Marcadores:</div>            
            {markers
              .filter(marker => marker.markerFaction === faction.factionId)
              .map((marker, index) => (
                <div style={{...statStyles, justifyContent: 'space-between', paddingLeft:'10px',width:'calc(100% - 20px)'}} key={index+'/'+faction.factionId+'/'+marker.markerId}>
                  {marker.markerType === 'person' && <BsPersonFill size={15}/>}
                  {marker.markerType === 'object' && <BsBoxFill size={15}/>}
                  {marker.markerType === 'place' && <BsHouseFill size={15}/>}
                  {marker.markerName}
                </div>
            ))}
          </div>
        }                
    </div>
  );
};

export default WorldFactionCard;