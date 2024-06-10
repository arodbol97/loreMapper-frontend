import React, { useEffect, useState } from 'react';
import { BsTrashFill , BsEyeFill , BsEyeSlashFill , BsPencilFill  } from 'react-icons/bs';
import { FaPlus , FaMapMarkerAlt } from "react-icons/fa";
import { BiSolidShieldAlt2 } from "react-icons/bi";
import axios from 'axios';

const WorldLoreBitCard = ({loreBit, user, worldId, markers, getLoreBits}) => {
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

  const buttonsStyles = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',    
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

const colorStyles = {
    display: 'flex',
    alignItems: 'center',    
    justifyContent: 'center',
    color: 'white',
    height:'26px',
    width:'26px',
    marginRight:'5px',
    borderRadius: '20px'
  };

  const [hoveredCard, setHoveredCard] = useState(false);  
  const [worldOwner, setWorldOwner] = useState(-1);
  const [stats, setStats] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    loreBitId: loreBit.loreBitId,
    loreBitTitle: loreBit.loreBitTitle,
    loreBitDescription: loreBit.loreBitDescription,
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

  const deleteLoreBit = async () => {
    if (window.confirm('¿Seguro que desea eliminar este lore permanentemente?')) {
      try {
        const response = await axios.get(`http://localhost:3001/loreBit/delete/${loreBit.loreBitId}`);
        if(response.data.deleted){
          getLoreBits();
        }      
      } catch (error) {
        console.error('Request error: ', error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
        
    try {
      const response = await axios.post('http://localhost:3001/loreBit/update', formData);          
      const requestData = response.data.requestData;          
      if (!requestData.updated) {
        document.getElementById('formError').innerHTML = requestData.error;
      } else {
        setEditing(false); 
        loreBit.loreBitTitle = formData.loreBitTitle;
        loreBit.loreBitDescription = formData.loreBitDescription;        
        getLoreBits();
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
      key={loreBit.loreBitId}
      style={{
        ...mapCardStyles,
        transform: hoveredCard ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.3s',
      }}
      onMouseEnter={() => handleCardHover(loreBit.loreBitId)}
      onMouseLeave={handleCardLeave}>
        <div style={cardHeaderStyles} onClick={()=>{showStats()}}>
          <div style={buttonsStyles}>            
          <div style={colorStyles}></div>            
          </div>        
          <div style={buttonsStyles}>
            {user && user.userId === worldOwner && <button style={buttonStyles} onClick={(e)=>{e.stopPropagation();deleteLoreBit()}}><BsTrashFill size={20}/></button>}
            {stats && user && user.userId === worldOwner && <button style={buttonStyles} onClick={(e)=>{e.stopPropagation();setEditing(!editing)}}><BsPencilFill size={20}/></button>}
            {user && checkUser()}
          </div>
          <span style={spanStyles}>{loreBit.loreBitTitle.length > 0 ? loreBit.loreBitTitle:'Sin título'}</span>
        </div>
        
        {stats &&
          <div style={statsStyles}>
            {!editing ? (
              <div>
                <div style={{...statStyles, backgroundColor: '#282c34'}}>Título:</div>
                <div style={{...statStyles, paddingLeft: '10px',width:'calc(100% - 10px)'}}>{loreBit.loreBitTitle.length > 0 ? loreBit.loreBitTitle:'Sin título'}</div>

                <div style={{...statStyles, backgroundColor: '#282c34'}}>Descripción:</div>
                <div style={{...statStyles, paddingLeft: '10px',width:'calc(100% - 10px)'}}>{loreBit.loreBitDescription}</div>                
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{...statStyles, backgroundColor: '#282c34'}}>Nombre:</div>
                <div style={{...statStyles}}>
                  <input
                    type="text"
                    value={formData.loreBitTitle}
                    onChange={e => handleInputChange('loreBitTitle', e.target.value)}
                    style={{width: '100%'}}
                  />
                </div>

                <div style={{...statStyles, backgroundColor: '#282c34'}}>Descripción:</div>
                <div style={{...statStyles}}>
                  <textarea
                    value={formData.loreBitDescription}
                    onChange={e => handleInputChange('loreBitDescription', e.target.value)}
                    style={{width: '100%', height: '60px', resize: 'vertical'}}
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
    </div>
  );
};

export default WorldLoreBitCard;