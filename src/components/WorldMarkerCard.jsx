import React, { useEffect, useState } from 'react';
import { BsTrashFill , BsPencilFill  } from 'react-icons/bs';
import { BiSolidShieldAlt2 } from "react-icons/bi";
import { GiDna1 } from "react-icons/gi";
import axios from 'axios';

const WorldMarkerCard = ({marker, user, worldId, markers, factions, kins, getMarkers, setRerenderCounter, rerenderCounter, maps}) => {
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
    cursor: 'pointer',
    minHeight: '67px'
  }

  const errorStyles = {
    width: '100%',
    textAlign: 'center',
    color: 'red',
    fontSize: '15px',
  };

  const factionStyles = {
    display: 'flex',
    alignItems: 'center',    
    justifyContent: 'center',
    color: 'white',
    height:'26px',
    width:'26px',
    marginRight:'5px',
    borderRadius: '20px'
  };

  const kinStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    height:'26px',
    width:'26px',
    marginRight:'5px',
    borderRadius: '20px'
  };

  const formButtonStyles = {
    color: 'white',
    fontWeight: 'bold',
    width: '50%',
    cursor: 'pointer'
  };

  const [hoveredCard, setHoveredCard] = useState(null);  
  const [worldOwner, setWorldOwner] = useState(-1);
  const [stats, setStats] = useState(false);  
  const [editing, setEditing] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [formData, setFormData] = useState(marker);  
  const [markerInMaps, setMarkerInMaps] = useState([]);  
  
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleCardHover = (index) => {
    setHoveredCard(index);    
  };

  const handleCardLeave = () => {
    setHoveredCard(null);    
  };

  const showStats = () => {
    setStats(!stats);
  };

  const deleteMarker = async () => {
    if (window.confirm('¿Seguro que desea eliminar este marcador permanentemente?')) {
      try {
          const response = await axios.post('https://lore-mapper-backend.vercel.app/marker/delete', {markerId: marker.markerId});
          const requestData = response.data.requestData;
          if (!requestData.deleted) {
            console.log("no se borro");
          } else {
            setDeleted(true);
            getMarkers();
          }
        } catch (error) {
          console.error('Create error: ', error);          
        }
    }    
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
        
    try {
      const response = await axios.post('https://lore-mapper-backend.vercel.app/marker/update', formData);
      const requestData = response.data.requestData;
      if (!requestData.updated) {
        document.getElementById('formError').innerHTML = requestData.error;
      } else {        
        marker = formData;
        setRerenderCounter(rerenderCounter+1);
        setEditing(!editing);        
      }
    } catch (error) {
      console.error('Create error: ', error);
      document.getElementById('formError').innerHTML = error.message;
    }
  };

  const checkUser = ()=> {
    const getWorld = async ()=>{
      try {
        const response = await axios.get(`https://lore-mapper-backend.vercel.app/world/fromWorldId/${worldId}`);
        if(worldOwner === -1){
          setWorldOwner(response.data.world.worldOwner);
        }      
      } catch (error) {
        console.error('Request error: ', error);
      }
    };
    getWorld();    
    if(user.userId === worldOwner){
      return(
        <button 
          style={buttonStyles} 
          onClick={(e)=>{
            e.stopPropagation();
            deleteMarker();
          }}>
            <BsTrashFill size={20}/>
          </button>
      );
    }
  }; 

  const getMarkerInMaps = async () => {
    try {
      const response = await axios.get(`https://lore-mapper-backend.vercel.app/markerInMap/fromMarkerId/${marker.markerId}`);      
      const markerMapIds = response.data.markers.map(marker => marker.mapId);      
      const filteredMaps = maps.filter(map => markerMapIds.includes(map.mapId));
      setMarkerInMaps(filteredMaps);      
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  useEffect(()=>{
    getMarkerInMaps();    
  },[rerenderCounter]);

  return (    
    <div
      key={marker.markerId}
      style={{
        ...mapCardStyles,
        transform: hoveredCard === marker.markerId ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.3s',
      }}
      onMouseEnter={() => handleCardHover(marker.markerId)}
      onMouseLeave={handleCardLeave}>
        <div style={cardHeaderStyles} onClick={()=>{showStats()}}>
          <div style={buttonsStyles}>
            {factions && <div style={{...factionStyles,backgroundColor: factions.find(faction => faction.factionId === marker.markerFaction) ? (factions.find(faction => faction.factionId === marker.markerFaction).factionColor):('black')}}><BiSolidShieldAlt2 size={18}/></div>}
            {kins && <div style={{...kinStyles,backgroundColor: kins.find(kin => kin.kinId === marker.markerKin) ? (kins.find(kin => kin.kinId === marker.markerKin).kinColor):('black')}}><GiDna1 size={18}/></div>}
          </div>            
          <div style={buttonsStyles}>
            {user && checkUser()}
            {user && user.userId === worldOwner && stats && 
              <button 
                style={buttonStyles}
                onClick={(e)=>{
                  e.stopPropagation();
                  setEditing(!editing);
                }}>
                  <BsPencilFill size={20}/>
                </button>
            }
          </div>
          <span style={spanStyles}>{marker.markerName.length > 0 ? marker.markerName:'Sin nombre'}</span>
        </div>
        {stats &&          
          <div style={statsStyles}>
            {!editing ? (
              <div>
                <div style={{...statStyles, backgroundColor: '#282c34'}}>Nombre:</div>
                <div style={{...statStyles, paddingLeft: '10px',width: 'calc(100% - 20px)'}}>{marker.markerName.length > 0 ? marker.markerName:'Sin nombre'}</div>

                <div style={{...statStyles, backgroundColor: '#282c34'}}>Descripción:</div>
                <div style={{...statStyles, paddingLeft: '10px',width: 'calc(100% - 20px)',wordBreak: 'break-all'}}>{marker.markerDescription}</div>                

                {marker.markerFaction && factions && <div style={{...statStyles, backgroundColor: '#282c34'}}>Facción:</div>}
                {marker.markerFaction && factions && <div style={{...statStyles, paddingLeft: '10px',width: 'calc(100% - 20px)'}}>{factions.find(faction => faction.factionId === marker.markerFaction).factionName}</div>}

                {marker.markerKin && kins && <div style={{...statStyles, backgroundColor: '#282c34'}}>Cultura:</div>}
                {marker.markerKin && kins && <div style={{...statStyles, paddingLeft: '10px',width: 'calc(100% - 20px)'}}>{kins.find(kin => kin.kinId === marker.markerKin).kinName}</div>}

                {marker.personHome && <div style={{...statStyles, backgroundColor: '#282c34'}}>Hogar:</div>}
                {marker.personHome && <div style={{...statStyles, paddingLeft: '10px',width: 'calc(100% - 20px)'}}>{markers.find(place => place.placeId === marker.personHome).markerName}</div>}

                {marker.markerType === 'object' && <div style={{...statStyles, backgroundColor: '#282c34'}}>Valor:</div>}
                {marker.markerType === 'object' && <div style={{...statStyles, paddingLeft: '10px',width: 'calc(100% - 20px)'}}>{marker.objectValue}</div>}

                {marker.objectEnchantment && <div style={{...statStyles, backgroundColor: '#282c34'}}>Encantamiento:</div>}
                {marker.objectEnchantment && <div style={{...statStyles, paddingLeft: '10px',width: 'calc(100% - 20px)',wordBreak: 'break-all'}}>{marker.objectEnchantment}</div>}

                {marker.objectType && <div style={{...statStyles, backgroundColor: '#282c34'}}>Tipo:</div>}
                {marker.objectType && <div style={{...statStyles, paddingLeft: '10px',width: 'calc(100% - 20px)'}}>{marker.objectType}</div>}

                {marker.placePopulation !== 0 && marker.placePopulation !== null && <div style={{...statStyles, backgroundColor: '#282c34'}}>Población:</div>}
                {marker.placePopulation !== 0 && marker.placePopulation !== null && <div style={{...statStyles, paddingLeft: '10px',width: 'calc(100% - 20px)'}}>{marker.placePopulation}</div>}

                {markerInMaps && markerInMaps.length !==0 && <div style={{...statStyles, backgroundColor: '#282c34'}}>Mapas:</div>}
                {markerInMaps && markerInMaps.map(
                    map =>
                    <div key={'map'+map.mapId} style={{...statStyles, paddingLeft: '10px',width: 'calc(100% - 20px)'}}>{map.mapName}</div>
                  )
                }
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{...statStyles, backgroundColor: '#282c34'}}>Nombre:</div>
                <div style={{...statStyles}}>
                  <input
                    type="text"
                    value={formData.markerName}
                    onChange={e => handleInputChange('markerName', e.target.value)}
                    style={{width: '100%'}}
                    maxLength={100}
                  />
                </div>

                <div style={{...statStyles, backgroundColor: '#282c34'}}>Descripción:</div>
                <div style={{...statStyles}}>
                  <textarea
                    value={formData.markerDescription}
                    onChange={e => handleInputChange('markerDescription', e.target.value)}
                    style={{width: '100%', height: '60px', resize: 'vertical'}}
                    maxLength={1000}
                  />
                </div>                

                <div style={{...statStyles, backgroundColor: '#282c34'}}>Facción:</div>
                <div style={{...statStyles}}>
                  <select 
                    name="faction" 
                    style={{width: '100%'}} 
                    value={formData.markerFaction || ''}
                    onChange={e => handleInputChange('markerFaction', e.target.value)}>
                      <option value=""></option>
                      {factions && factions
                          .map((faction, index) => (
                              <option value={parseInt(faction.factionId)}>{faction.factionName}</option>
                      ))}
                  </select>
                </div>

                <div style={{...statStyles, backgroundColor: '#282c34'}}>Cultura:</div>
                <div style={{...statStyles}}>
                  <select 
                    name="kin" 
                    style={{width: '100%'}} 
                    value={formData.markerKin || ''}
                    onChange={e => handleInputChange('markerKin', e.target.value)}>
                      <option value=""></option>
                      {kins && kins
                          .map((kin, index) => (
                              <option value={parseInt(kin.kinId)}>{kin.kinName}</option>
                      ))}                        
                  </select>
                </div>

                {marker.markerType === 'person' && <div style={{...statStyles, backgroundColor: '#282c34'}}>Hogar:</div>}
                {marker.markerType === 'person' && 
                  <div style={{...statStyles}}>
                    <select 
                      name="kin" 
                      style={{width: '100%'}} 
                      value={formData.personHome || ''}
                      onChange={e => handleInputChange('personHome', e.target.value)}>
                        <option value=""></option>
                        {markers
                            .filter(place => place.markerType === "place")
                            .map((place, index) => (
                                <option value={parseInt(place.placeId)}>{place.markerName}</option>
                        ))}                        
                    </select>
                  </div>
                }

                {marker.markerType === 'object' && <div style={{...statStyles, backgroundColor: '#282c34'}}>Valor:</div>}
                {marker.markerType === 'object' && 
                  <div style={{...statStyles}}>
                    <input
                      type="number"
                      value={formData.objectValue}
                      onChange={e => handleInputChange('objectValue', e.target.value)}
                      style={{width: '100%'}}
                    />
                  </div>
                }

                {marker.markerType === 'object' && <div style={{...statStyles, backgroundColor: '#282c34'}}>Encantamiento:</div>}
                {marker.markerType === 'object' && 
                  <div style={{...statStyles}}>
                    <textarea
                      value={formData.objectEnchantment}
                      onChange={e => handleInputChange('objectEnchantment', e.target.value)}
                      style={{width: '100%', height: '60px', resize: 'vertical'}}
                      maxLength={1000}
                    />
                  </div>
                }

                {marker.markerType === 'object' && <div style={{...statStyles, backgroundColor: '#282c34'}}>Tipo:</div>}
                {marker.markerType === 'object' && 
                  <div style={{...statStyles}}>
                    <select 
                      name="objectType" 
                      style={{width: '100%'}} 
                      value={formData.objectType || ''}
                      onChange={e => handleInputChange('objectType', e.target.value)}>
                        <option value="Arma">Arma</option>
                        <option value="Armadura">Armadura</option>
                        <option value="Misceláneo">Misceláneo</option>
                        <option value="Libro">Libro</option>
                        <option value="Consumible">Consumible</option>
                    </select>
                  </div>
                }

                {marker.markerType === 'place' && <div style={{...statStyles, backgroundColor: '#282c34'}}>Población:</div>}
                {marker.markerType === 'place' && 
                  <div style={{...statStyles}}>
                    <input
                      type="number"
                      value={formData.placePopulation}
                      onChange={e => handleInputChange('placePopulation', e.target.value)}
                      style={{width: '100%'}}
                    />
                  </div>
                }

                <div style={statStyles}>
                  <button style={{...formButtonStyles,backgroundColor:'red'}} type="button" onClick={()=>{setEditing(!editing)}}>Cancelar</button>
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

export default WorldMarkerCard;