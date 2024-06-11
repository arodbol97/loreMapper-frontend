import React, { useEffect , useState } from 'react';
import { BsTrashFill , BsPencilFill  } from 'react-icons/bs';
import { FaPlus , FaMapMarkerAlt } from "react-icons/fa";
import { ImBlocked } from "react-icons/im";
import { BiSolidShieldAlt2 } from "react-icons/bi";
import { GiDna1 } from "react-icons/gi";
import axios from 'axios';

const WorldCard = ({world, user, getWorlds}) => {
  const mapCardStyles = {    
    display: 'flex',
    flexWrap: 'wrap',
    width: 'calc(100% - 24px)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'scale(1.05)',
    },    
    padding:'10px',
    border: world.worldStatus !== 'blocked' ? '2px solid #282c34':'2px solid #DC143C'
  };

  const thumbnailStyles = {
    width: '100%',
    height: '200px',
    borderRadius: '10px 10px 0 0',
    borderBottom: '2px solid #282c34',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  };

  const overlayStyles = {
    display: 'flex',
    width: '100%',
    height: '100%',
    borderRadius: '10px 10px 0 0',    
    backgroundColor: 'rgba(100, 100, 100, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white'
  };

  const cardInfoStyles = {
    width: '100%',
    color: 'white',
    textAlign: 'center',
    padding: '10px'
  };

  const buttonsStyles = {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',    
    top: '220px',
    right: '10px'
  };

  const buttonStyles = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    width: '35px',    
    backgroundColor: "#282c34",    
    color: 'white',    
  };

  const iconsStyles = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',    
    position: 'absolute',    
    color: 'white',
    top: '225px',
    left: '10px'
  };

  const blockedStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent:'center',
    cursor: 'pointer',    
    position: 'absolute',    
    backgroundColor: "#191a21",    
    borderRadius:'30px',
    color: 'red',
    top: '0px',
    right: '0px',
    width:'60px',
    height:'60px',
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
  };

  const formButtonStyles = {
    color: 'white',
    fontWeight: 'bold',
    width: '50%',
    cursor: 'pointer'
  };

  const errorStyles = {
    width: '100%',
    textAlign: 'center',
    color: 'red',
    fontSize: '15px',
  };

  const [hoveredCard, setHoveredCard] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(world);  
  const [markers, setMarkers] = useState(null);  
  const [factions, setFactions] = useState(null);
  const [kins, setKins] = useState(null);
  const [owner, setOwner] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const getMarkers = async () => {
    try {
      const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/marker/fromWorldId/${world.worldId}`);
      setMarkers(response.data.markers);
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  const getFactions = async () => {
    try {
      const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/faction/fromWorldId/${world.worldId}`);
      setFactions(response.data.factions);
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  const getKins = async () => {
    try {
      const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/kin/fromWorldId/${world.worldId}`);
      setKins(response.data.kins);
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  const getOwner = async () => {
    try {
      const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/user/fromId/${world.worldOwner}`);
      setOwner(response.data.user);
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  const handleCardHover = (index) => {
    setHoveredCard(index);    
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  }; 

  const handleSubmit = async (event) => {
    event.preventDefault();
        
    try {
      const response = await axios.post('https://loremapper-backend-b042c39916b5.herokuapp.com/world/update', formData);
      const requestData = response.data.worldData;
      if (!requestData.updated) {
        document.getElementById('formError').innerHTML = requestData.error;
      } else {        
        world = formData;        
        getWorlds();
        setEditing(!editing);        
      }
    } catch (error) {
      console.error('Update error: ', error);
      document.getElementById('formError').innerHTML = error.message;
    }
  };

  const changeImage = async (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      worldThumbnail: file,
    });

    const formDataForSubmission = new FormData();
    formDataForSubmission.append('worldId', formData.worldId);    
    formDataForSubmission.append('worldId', formData.worldName);    
    formDataForSubmission.append('worldThumbnail', file);
    
    try {
      const response = await axios.post('https://loremapper-backend-b042c39916b5.herokuapp.com/world/changeImage', formDataForSubmission);
      const requestData = response.data.worldData;
      if (!requestData.updated) {
        document.getElementById('formError').innerHTML = requestData.error;
      } else {        
        world = formData;        
        getWorlds();
        setEditing(!editing);        
      }
    } catch (error) {
      console.error('Update error: ', error);
      document.getElementById('formError').innerHTML = error.message;
    }
  };

  const deleteWorld = async () => {    
    if (window.confirm('¿Seguro que desea eliminar este mundo permanentemente?')) {
      try {
        const response = await axios.post(`https://loremapper-backend-b042c39916b5.herokuapp.com/world/delete`, {worldId:world.worldId});
        if(response.data.deleted){
          getWorlds();
        }
      } catch (error) {
        console.error('Request error: ', error);
      }
    }
  };

  const blockWorld = async (worldStatus = 'blocked') => {    
    if (window.confirm(`¿Seguro que desea ${worldStatus === 'active' ? 'des':''}bloquear este mundo?`)) {
      try {
        const response = await axios.post(`https://loremapper-backend-b042c39916b5.herokuapp.com/world/block`, {worldId:world.worldId , worldStatus:worldStatus});
        if(response.data.blocked){
          getWorlds();
        }
      } catch (error) {
        console.error('Request error: ', error);
      }
    }
  };

  useEffect(()=>{    
    getMarkers();
    getFactions();
    getKins();
    getOwner();
  },[world]);

  return (
    <div
      key={world.worldId}
      style={{
        ...mapCardStyles,
        transform: hoveredCard === world.worldId ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.3s',
      }}
      onMouseEnter={() => handleCardHover(world.worldId)}
      onMouseLeave={handleCardLeave}>        
        {editing ? (
          <label
            alt={"thumbnailFor" + world.worldName}
            style={{...thumbnailStyles, backgroundImage: `url(${world.worldThumbnail})`,cursor:'pointer'}}
            onClick={(e)=>{
              e.stopPropagation();              
            }}>
              <div style={overlayStyles}>
                <BsPencilFill size={100}/>
                <input
                  style={{display:'none'}}
                  type="file"
                  accept="image/*"
                  name="worldThumbnail"
                  onChange={changeImage}
                  required
                />
              </div>                      
          </label>
        ):(
          <div
            alt={"thumbnailFor" + world.worldName}
            style={{...thumbnailStyles, backgroundImage: `url(${world.worldThumbnail})`}}>
          </div>
        )}
        
        <div style={iconsStyles}>
          <div style={{margin:'0',alignItems:'center',display:'flex'}}><FaMapMarkerAlt size={20} style={{margin:'0 5px'}}/> {markers ? markers.length : 0}</div>
          <div style={{margin:'0 0 0 5px',alignItems:'center',display:'flex'}}><BiSolidShieldAlt2 size={20} style={{margin:'0 5px'}}/> {factions ? factions.length : 0}</div>
          <div style={{margin:'0 0 0 5px',alignItems:'center',display:'flex'}}><GiDna1 size={20} style={{margin:'0 5px'}}/> {kins ? kins.length : 0}</div>
        </div>        

        {world.worldStatus === 'blocked' && 
          <div style={blockedStyles}>
            <ImBlocked size={40}/>
          </div>
        }

        <div style={{...cardInfoStyles,marginTop:'5px'}}></div>
        <div style={cardInfoStyles}>{world.worldName.length > 0 ? world.worldName:'Sin nombre'}</div>
        <div style={buttonsStyles}>
        {user && user.userId === world.worldOwner &&
          <button 
            style={buttonStyles} 
            onClick={(e)=>{
            e.stopPropagation();
            setEditing(!editing);
          }}>
            <BsPencilFill size={20}/>
          </button>
        }
        {user && (user.userId === world.worldOwner || user.userRol === 'admin') &&
          <button
            style={{...buttonStyles}}
            onClick={(e)=>{
            e.stopPropagation();
            deleteWorld();
          }}>
            <BsTrashFill size={20}/>
          </button>          
        }
        {user && (user.userRol === 'mod' || user.userRol === 'admin') && world.worldStatus === 'active' && user.userId !== world.worldOwner &&
          <button
            style={{...buttonStyles}}
            onClick={(e)=>{
            e.stopPropagation();
            blockWorld();
          }}>
            <ImBlocked size={20}/>
          </button>          
        }
        {user && (user.userRol === 'mod' || user.userRol === 'admin') && world.worldStatus === 'blocked' && user.userId !== world.worldOwner &&
          <button
            style={{...buttonStyles}}
            onClick={(e)=>{
            e.stopPropagation();
            blockWorld('active');
          }}>
            <ImBlocked size={20}/>
          </button>          
        }
        </div>
        {editing && 
          <div style={{...cardInfoStyles,borderTop:'2px solid #282c34'}}>
            <form onSubmit={handleSubmit} onClick={(e)=>{e.stopPropagation()}}>
                <div style={{...statStyles, backgroundColor: '#282c34'}}>Nombre:</div>
                <div style={{...statStyles}}>
                  <input
                    type="text"
                    value={formData.worldName}
                    onChange={e => handleInputChange('worldName', e.target.value)}
                    style={{width: '100%'}}
                  />
                </div>

                <div style={{...statStyles, backgroundColor: '#282c34'}}>Visibilidad:</div>
                <div style={{...statStyles}}>
                  <select 
                    name="visibility" 
                    style={{width: '100%'}} 
                    value={formData.worldVisibility}
                    onChange={e => handleInputChange('worldVisibility', e.target.value)}>                                            
                      <option value='public'>Público</option>
                      <option value='private'>Privado</option>
                  </select>
                </div>     

                <div style={{...statStyles, backgroundColor: '#282c34'}}>Descripción:</div>
                <div style={{...statStyles}}>
                  <textarea
                    value={formData.worldDescription}
                    onChange={e => handleInputChange('worldDescription', e.target.value)}
                    style={{width: '100%', height: '60px', resize: 'vertical'}}
                  />
                </div>            

                <div style={statStyles}>
                  <button style={{...formButtonStyles,backgroundColor:'red'}} type="button" onClick={()=>{setEditing(false)}}>Cancelar</button>
                  <button style={{...formButtonStyles,backgroundColor:'#007bff'}} type="submit">Confirmar</button>
                </div>
                <span id="formError" style={errorStyles}></span>
              </form>
          </div>
        }
    </div>
  );
};

export default WorldCard;