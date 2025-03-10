import React, { useEffect, useState } from 'react';
import { BsTrashFill , BsEyeFill , BsEyeSlashFill , BsPencilFill  } from 'react-icons/bs';
import { FaPlus , FaMapMarkerAlt } from "react-icons/fa";
import { GiDna1 } from "react-icons/gi";
import { BsBoxFill, BsHouseFill, BsPersonFill } from 'react-icons/bs';
import axios from 'axios';

const WorldKinCard = ({kin, user, worldId, markers, getKins}) => {
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
    backgroundColor: kin.kinColor,
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
    kinId: kin.kinId,
    kinName: kin.kinName,
    kinDescription: kin.kinDescription,
    kinColor: kin.kinColor
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
        const response = await axios.get(`https://lore-mapper-backend.vercel.app//world/fromWorldId/${worldId}`);
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

  const deleteKin = async () => {
    if (window.confirm('¿Seguro que desea eliminar esta cultura permanentemente?')) {
      try {
        const response = await axios.get(`https://lore-mapper-backend.vercel.app//kin/delete/${kin.kinId}`);
        if(response.data.deleted){
          getKins();
        }      
      } catch (error) {
        console.error('Request error: ', error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
        
    try {
      const response = await axios.post('https://lore-mapper-backend.vercel.app//kin/update', formData);          
      const requestData = response.data.requestData;          
      if (!requestData.updated) {
        document.getElementById('formError').innerHTML = requestData.error;
      } else {
        setEditing(false); 
        kin.kinName = formData.kinName;
        kin.kinDescription = formData.kinDescription;
        kin.kinColor = formData.kinColor;
        getKins();
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
      key={kin.kinId}
      style={{
        ...mapCardStyles,
        transform: hoveredCard ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.3s',
      }}
      onMouseEnter={() => handleCardHover(kin.kinId)}
      onMouseLeave={handleCardLeave}>
        <div style={cardHeaderStyles} onClick={()=>{showStats()}}>
          <div style={buttonsStyles}>
            <div style={colorStyles}><GiDna1 size={18}/></div>            
          </div>        
          <div style={buttonsStyles}>
            {kin.kinId && user && user.userId === worldOwner && <button style={buttonStyles} onClick={(e)=>{e.stopPropagation();deleteKin()}}><BsTrashFill size={20}/></button>}
            {kin.kinId && stats && user && user.userId === worldOwner && <button style={buttonStyles} onClick={(e)=>{e.stopPropagation();setEditing(!editing)}}><BsPencilFill size={20}/></button>}
            {user && checkUser()}
          </div>
          <span style={spanStyles}>{kin.kinName.length > 0 ? kin.kinName:'Sin nombre'}</span>
        </div>
        
        {stats && kin.kinId &&          
          <div style={statsStyles}>
            {!editing ? (
              <div>
                <div style={{...statStyles, backgroundColor: '#282c34'}}>Nombre:</div>
                <div style={{...statStyles, paddingLeft: '10px',width:'calc(100% - 10px)'}}>{kin.kinName.length > 0 ? kin.kinName:'Sin nombre'}</div>

                <div style={{...statStyles, backgroundColor: '#282c34'}}>Descripción:</div>
                <div style={{...statStyles, paddingLeft: '10px',width:'calc(100% - 10px)',wordBreak: 'break-all'}}>{kin.kinDescription}</div>

                <div style={{...statStyles, backgroundColor: '#282c34'}}>Color:</div>
                <div style={{...statStyles, padding: '0 10px 0 10px', backgroundColor: kin.kinColor, width: '1%', height: '20px', marginLeft: '10px', border: '1px solid white'}}>
                  <div style={{marginLeft:'20px'}}>{kin.kinColor}</div>
                </div>                
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{...statStyles, backgroundColor: '#282c34'}}>Nombre:</div>
                <div style={{...statStyles}}>
                  <input
                    type="text"
                    value={formData.kinName}
                    onChange={e => handleInputChange('kinName', e.target.value)}
                    style={{width: '100%'}}
                    maxLength={100}
                  />
                </div>

                <div style={{...statStyles, backgroundColor: '#282c34'}}>Descripción:</div>
                <div style={{...statStyles}}>
                  <textarea
                    value={formData.kinDescription}
                    onChange={e => handleInputChange('kinDescription', e.target.value)}
                    style={{width: '100%', height: '60px', resize: 'vertical'}}
                    maxLength={1000}
                  />
                </div>

                <div style={{...statStyles, backgroundColor: '#282c34'}}>Color:</div>
                <div style={{...statStyles, width: '100%', height: '20px'}}>
                  <input
                    type="color"
                    value={formData.kinColor}

                    onChange={e => handleInputChange('kinColor', e.target.value)}
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
              .filter(marker => marker.markerKin === kin.kinId)
              .map((marker, index) => (
                <div style={{...statStyles, justifyContent: 'space-between', paddingLeft:'10px',width:'calc(100% - 20px)'}} key={index+'/'+kin.kinId+'/'+marker.markerId}>
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

export default WorldKinCard;