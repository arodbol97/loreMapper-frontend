import React, { useEffect, useState } from 'react';
import { BsTrashFill , BsEyeFill , BsEyeSlashFill , BsPencilFill  } from 'react-icons/bs';
import { BiSolidShieldAlt2 } from "react-icons/bi";
import { GiDna1 } from "react-icons/gi";
import axios from 'axios';
import MapBox from './MapBox';
import TempMarker from './TempMarker';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

const MarkerCard = ({marker, user, map, rerenderer, displayMarkers, hideMarker ,showAllMarkers,rerenderCounter,worldId, hoveredMarker, setHoveredMarker, rerender}) => {
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
    marginLeft: '-0px'
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
    cursor: 'pointer'
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
    backgroundColor: marker.markerFaction ? (marker.factionColor):('black'),
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
    backgroundColor: marker.markerKin ? (marker.kinColor):('black'),
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
  const [worldMarkers, setWorldMarkers] = useState([]);
  const [hidden, setHidden] = useState(showAllMarkers);
  const [worldOwner, setWorldOwner] = useState(-1);
  const [stats, setStats] = useState(false);
  const [factions, setFactions] = useState([]);
  const [kins, setKins] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({...marker, oldMarkerPosition: marker.markerPosition});

  var tempMarker = null;
  
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleCardHover = (index) => {
    setHoveredCard(index);
    setHoveredMarker({id:marker.markerId,coords:marker.markerPosition});
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
    setHoveredMarker(null);
  };

  const deleteMarkerInMap = async () => {
    if(window.confirm('¿Seguro que quieres quitar este marcador del mapa?')){
      const data = {
        mapId: marker.mapId,
        markerId: marker.markerId,
        markerPosition: marker.markerPosition
      };
      const response = await axios.post('http://localhost:3001/markerInMap/delete', data);
      if(response.data.success){
        displayMarkers();
        rerenderer();
      }
    }
  };

  const hideMarkerInMap = () => {    
    setHidden(!hidden);
    if (!hidden) {
      hideMarker(marker.markerPosition);
    } else {
      hideMarker(false,marker.markerPosition);
    }    
    displayMarkers();
  };  

  const showStats = () => {    
    setStats(!stats);  
    setEditing(false);    
  };  

  const handleSubmit = async (event) => {
    event.preventDefault();
        
    try {
      const response = await axios.post('http://localhost:3001/marker/update', formData);
      const requestData = response.data.requestData;
      if (!requestData.updated) {
        document.getElementById('formError').innerHTML = requestData.error;
      } else {
        if (formData.markerPosition !== marker.markerPosition) {
          const response = await axios.post('http://localhost:3001/markerinMap/update', formData);
          const requestData = response.data.requestData;
          if (!requestData.updated) {
            document.getElementById('formError').innerHTML = requestData.error;
          } else {
            setEditing(!editing);
            marker = formData;
            displayMarkers();
            rerenderer();  
          }
        } else {
          setEditing(!editing);
          marker = formData;
          displayMarkers();
          rerenderer();
        }        
      }
    } catch (error) {
      console.error('Create error: ', error);
      document.getElementById('formError').innerHTML = error.message;
    }
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
    if(user.userId === worldOwner){
      return(
        <button 
          style={buttonStyles} 
          onClick={(e)=>{
            e.stopPropagation();
            deleteMarkerInMap();
          }}>
            <BsTrashFill size={20}/>
          </button>
      );
    }
  }; 

  useEffect(()=>{
    const getMarkers = async () => {
      try {
          const response = await axios.get(`http://localhost:3001/marker/fromWorldId/${worldId}`);
          setWorldMarkers(response.data.markers);
      } catch (error) {
          console.error('Request error: ', error);
      }
    };
    getMarkers();

    const getFactions = async () => {
      try {
          const response = await axios.get(`http://localhost:3001/faction/fromWorldId/${worldId}`);
          setFactions(response.data.factions);          
      } catch (error) {
          console.error('Request error: ', error);
      }
    };
    getFactions();

    const getKins = async () => {
      try {
          const response = await axios.get(`http://localhost:3001/kin/fromWorldId/${worldId}`);
          setKins(response.data.kins);
      } catch (error) {
          console.error('Request error: ', error);
      }
    };
    getKins();
    if(showAllMarkers === hidden){
      hideMarkerInMap();
    }    
  },[showAllMarkers,rerenderCounter,rerender]);

  return (
    <div
      key={'markerCard'+marker.markerId}
      style={{
        ...mapCardStyles,
        transform: hoveredCard === marker.markerId || hoveredMarker === marker.markerId ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.3s',
      }}
      onMouseEnter={() => handleCardHover(marker.markerId)}
      onMouseLeave={handleCardLeave}>        
        <div style={cardHeaderStyles} onClick={()=>{showStats()}}>
          <div style={buttonsStyles}>
            <div style={factionStyles}><BiSolidShieldAlt2 size={18}/></div>
            <div style={kinStyles}><GiDna1 size={18}/></div>
          </div>            
          <div style={buttonsStyles}>        
            {hidden ? (
              <button 
                style={{...buttonStyles,color:'grey'}} 
                onClick={(e) => {
                  e.stopPropagation();
                  hideMarkerInMap();
                }}>
                  <BsEyeSlashFill size={20}/>
                </button>
            ) : (          
              <button
                style={buttonStyles}
                onClick={(e) => {
                  e.stopPropagation();
                  hideMarkerInMap();
                }}>
                  <BsEyeFill size={20}/>
                </button>          
            )}            
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
                <div style={{...statStyles, paddingLeft: '10px',width: 'calc(100% - 20px)'}}>{marker.markerDescription}</div>

                <div style={{...statStyles, backgroundColor: '#282c34'}}>Coordenadas:</div>
                <div style={{...statStyles, paddingLeft: '10px',width: 'calc(100% - 20px)'}}>Y: {JSON.parse(marker.markerPosition).lat}</div>
                <div style={{...statStyles, paddingLeft: '10px',width: 'calc(100% - 20px)'}}>X: {JSON.parse(marker.markerPosition).lng}</div>

                {marker.markerFaction && <div style={{...statStyles, backgroundColor: '#282c34'}}>Facción:</div>}
                {marker.markerFaction && <div style={{...statStyles, paddingLeft: '10px',width: 'calc(100% - 20px)'}}>{marker.factionName}</div>}

                {marker.markerKin && <div style={{...statStyles, backgroundColor: '#282c34'}}>Cultura:</div>}
                {marker.markerKin && <div style={{...statStyles, paddingLeft: '10px',width: 'calc(100% - 20px)'}}>{marker.kinName}</div>}

                {marker.personHome && <div style={{...statStyles, backgroundColor: '#282c34'}}>Hogar:</div>}
                {marker.personHome && <div style={{...statStyles, paddingLeft: '10px',width: 'calc(100% - 20px)'}}>{worldMarkers.find(place => place.placeId === marker.personHome).markerName}</div>}

                {marker.markerType === 'object' && <div style={{...statStyles, backgroundColor: '#282c34'}}>Valor:</div>}
                {marker.markerType === 'object' && <div style={{...statStyles, paddingLeft: '10px',width: 'calc(100% - 20px)'}}>{marker.objectValue}</div>}

                {marker.objectEnchantment && <div style={{...statStyles, backgroundColor: '#282c34'}}>Encantamiento:</div>}
                {marker.objectEnchantment && <div style={{...statStyles, paddingLeft: '10px',width: 'calc(100% - 20px)'}}>{marker.objectEnchantment}</div>}

                {marker.objectType && <div style={{...statStyles, backgroundColor: '#282c34'}}>Tipo:</div>}
                {marker.objectType && <div style={{...statStyles, paddingLeft: '10px',width: 'calc(100% - 20px)'}}>{marker.objectType}</div>}

                {marker.placePopulation !== 0 && marker.placePopulation !== null && <div style={{...statStyles, backgroundColor: '#282c34'}}>Población:</div>}
                {marker.placePopulation !== 0 && marker.placePopulation !== null && <div style={{...statStyles, paddingLeft: '10px',width: 'calc(100% - 20px)'}}>{marker.placePopulation}</div>}
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
                  />
                </div>

                <div style={{...statStyles, backgroundColor: '#282c34'}}>Descripción:</div>
                <div style={{...statStyles}}>
                  <textarea
                    value={formData.markerDescription}
                    onChange={e => handleInputChange('markerDescription', e.target.value)}
                    style={{width: '100%', height: '60px', resize: 'vertical'}}
                  />
                </div>

                <div style={{...statStyles, backgroundColor: '#282c34'}}>Coordenadas:</div>
                <div style={{...statStyles}}>Haz click en el mapa o arrastra el marcador para editar</div>
                <div style={{...statStyles}}>
                  <input
                    type="text"
                    value={'Y:'+JSON.parse(formData.markerPosition).lat}                    
                    style={{width: '100%'}}
                  />
                </div>
                <div style={{...statStyles}}>
                  <input
                    type="text"
                    value={'X:'+JSON.parse(formData.markerPosition).lng}                    
                    style={{width: '100%'}}
                  />
                </div>

                <TempMarker map={map} setFormData={setFormData} formData={formData} marker={marker}/>

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
                        {worldMarkers
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

export default MarkerCard;