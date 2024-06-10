import React, { useEffect , useState } from 'react';
import { BsTrashFill , BsPencilFill  } from 'react-icons/bs';
import axios from 'axios';

const MapCard = ({map, user, worldId, getMaps, maps}) => {
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
    border: '2px solid #282c34'
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

  const buttonStyles = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    width: '35px',
    position: 'absolute',
    backgroundColor: "#282c34",    
    color: 'white',
    top: '220px',
    right: '10px'
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
  const [worldOwner, setWorldOwner] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(map);  

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      mapImage: file,
    });
  };

  const handleCardHover = (index) => {
    setHoveredCard(index);    
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  const checkUser = async () => {    
    try {
      const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/world/fromWorldId/${worldId}`);
      if(!worldOwner){
        setWorldOwner(response.data.world.worldOwner);
      }      
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
        
    try {
      const response = await axios.post('https://loremapper-backend-b042c39916b5.herokuapp.com/map/update', formData);
      const requestData = response.data.mapData;
      if (!requestData.updated) {
        document.getElementById('formError').innerHTML = requestData.error;
      } else {        
        map = formData;        
        getMaps();
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
      mapImage: file,
    });

    const formDataForSubmission = new FormData();
    formDataForSubmission.append('mapId', formData.mapId);    
    formDataForSubmission.append('mapImage', file);
    
    try {
      const response = await axios.post('https://loremapper-backend-b042c39916b5.herokuapp.com/map/changeImage', formDataForSubmission);
      const requestData = response.data.mapData;
      if (!requestData.updated) {
        document.getElementById('formError').innerHTML = requestData.error;
      } else {        
        map = formData;        
        getMaps();
        setEditing(!editing);        
      }
    } catch (error) {
      console.error('Update error: ', error);
      document.getElementById('formError').innerHTML = error.message;
    }
  };

  const deleteMap = async () => {    
    if (window.confirm('¿Seguro que desea eliminar este mapa permanentemente?')) {
      try {
        const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/map/delete/${map.mapId}`);
        if(response.data.deleted){
          getMaps();
        } else {
          alert('damn');
        }
      } catch (error) {
        console.error('Request error: ', error);
      }
    }
  };

  useEffect(()=>{
    checkUser();    
  },[]);

  return (
    <div
      key={map.mapId}
      style={{
        ...mapCardStyles,
        transform: hoveredCard === map.mapId ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.3s',
      }}
      onMouseEnter={() => handleCardHover(map.mapId)}
      onMouseLeave={handleCardLeave}>        
        {editing ? (
          <label
            alt={"thumbnailFor" + map.mapName}
            style={{...thumbnailStyles, backgroundImage: `url(https://loremapper-backend-b042c39916b5.herokuapp.com/images/${map.mapImage})`,cursor:'pointer'}}
            onClick={(e)=>{
              e.stopPropagation();              
            }}>
              <div style={overlayStyles}>
                <BsPencilFill size={100}/>
                <input
                  style={{display:'none'}}
                  type="file"
                  accept="image/*"
                  name="mapImage"
                  onChange={changeImage}
                  required
                />
              </div>                      
          </label>
        ):(
          <div
            alt={"thumbnailFor" + map.mapName}
            style={{...thumbnailStyles, backgroundImage: `url(https://loremapper-backend-b042c39916b5.herokuapp.com/images/${map.mapImage})`}}>
          </div>
        )}
        
        <div style={cardInfoStyles}>{map.mapName.length > 0 ? map.mapName:'Sin nombre'}</div>
        {user && worldOwner && user.userId === worldOwner && 
          <div>
            <button 
              style={buttonStyles} 
              onClick={(e)=>{
              e.stopPropagation();
              setEditing(!editing);
            }}>
              <BsPencilFill size={20}/>
            </button>
            <button
              style={{...buttonStyles,right:'45px'}}
              onClick={(e)=>{
              e.stopPropagation();
              deleteMap();
            }}>
              <BsTrashFill size={20}/>
            </button>
          </div>        
        }
        {editing && 
          <div style={{...cardInfoStyles,borderTop:'2px solid #282c34'}}>
            <form onSubmit={handleSubmit} onClick={(e)=>{e.stopPropagation()}}>
                <div style={{...statStyles, backgroundColor: '#282c34'}}>Nombre:</div>
                <div style={{...statStyles}}>
                  <input
                    type="text"
                    value={formData.mapName}
                    onChange={e => handleInputChange('mapName', e.target.value)}
                    style={{width: '100%'}}
                  />
                </div>

                <div style={{...statStyles, backgroundColor: '#282c34'}}>Región de:</div>
                <div style={{...statStyles}}>
                  <select 
                    name="parent" 
                    style={{width: '100%'}} 
                    value={formData.mapParent || ''}
                    onChange={e => handleInputChange('mapParent', e.target.value)}>
                      <option value=""></option>
                      {maps && 
                        maps
                          .filter(parent => parent.mapId !== map.mapId)
                          .map((parent, index) => (
                              <option value={parseInt(parent.mapId)}>{parent.mapName}</option>
                      ))}                        
                  </select>
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

export default MapCard;