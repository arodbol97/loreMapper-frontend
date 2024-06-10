import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapList from './MapList';
import WorldMarkerCard from './WorldMarkerCard';
import WorldFactionCard from './WorldFactionCard';
import WorldKinCard from './WorldKinCard';
import WorldLoreBitCard from './WorldLoreBitCard';
import NewKin from './NewKin';
import NewFaction from './NewFaction';
import NewWorldMarker from './NewWorldMarker';
import NewLoreBit from './NewLoreBit';
import { BsJustify, BsPencilFill } from 'react-icons/bs';
import { FaPlus , FaMapMarkerAlt } from "react-icons/fa";
import { BiSolidShieldAlt2 } from "react-icons/bi";
import { GiDna1 } from "react-icons/gi";

const World = ({ worldId, handleComponentChange, user }) => {
  const divStyles = {
    display: 'flex',
    width: '80%',
    flexWrap: 'wrap',
    borderRadius: '0 0 20px 20px',
    border: '5px solid #282c34',
    borderTop: '0',
    padding: '20px',
    marginBottom: '20px'
  };

  const miniDivStyles = {
    width: '33.33333%',
    justifyContent: 'center',
    padding: '0',
    margin: '0',
  };

  const infoStyles = {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    padding: '0',
    margin: '20px',
    color: 'white'
  };

  const columnStyles = {
    display: 'flex',
    flexDirection: 'column',
    width: '30%',
    lineHeight: 1.5,
    marginBottom: '2em',
    wordSpacing: '0.2em',  
  };

  const consoleStyles = {
    padding: '1% 1%',
    margin: '0 5px',
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
    width: '35px',
    alignItems: 'center',    
    cursor: 'pointer',    
    backgroundColor: "#282c34",    
    color: 'white',    
  };

  const thumbnailStyles = {
    width: '90%',
    height: '200px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: '10px',
    border: '2px solid #282c34',
    borderRadius: '10px'
  };

  const overlayStyles = {
    display: 'flex',
    width: '100%',
    height: '100%',
    borderRadius: '10px',    
    backgroundColor: 'rgba(100, 100, 100, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    cursor: 'pointer'
  };

  const infoItemStyles = {
    display: 'flex',
    width: '90%',
    margin: '5px 0'
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

  const titleStyles = {
    width: '100%',
    height: '35px',
    backgroundColor: '#007bff',
    color: 'white',
    textAlign: 'center',
    border: '2px solid #282c34',
    margin: '20px auto'
  };

  const markerCardSocketStyles = {
    padding: '5px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-evenly'
  };

  const paginationControlsStyles = {
    display: 'flex',
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

  const [world, setWorld] = useState(null);
  const [markers, setMarkers] = useState(null);  
  const [factions, setFactions] = useState(null);
  const [rerenderCounter, setRerenderCounter] = useState(0);
  const [kins, setKins] = useState(null);
  const [loreBits, setLoreBits] = useState(null);
  const [maps, setMaps] = useState(null);
  const [owner, setOwner] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(null); 

  const [personPage, setPersonPage] = useState(0);
  const [objectPage, setObjectPage] = useState(0);
  const [placePage, setPlacePage] = useState(0);
  const [factionPage, setFactionPage] = useState(0);
  const [kinPage, setKinPage] = useState(0);
  const [loreBitPage, setLoreBitPage] = useState(0);
  const markersPerPage = 5;

  const [searchedPerson, setSearchedPerson] = useState('');
  const [searchedObject, setSearchedObject] = useState('');
  const [searchedPlace, setSearchedPlace] = useState('');
  const [searchedFaction, setSearchedFaction] = useState('');
  const [searchedKin, setSearchedKin] = useState('');
  const [searchedLoreBit, setSearchedLoreBit] = useState('');

  const [newPerson, setNewPerson] = useState(false);
  const [newObject, setNewObject] = useState(false);
  const [newPlace, setNewPlace] = useState(false);
  const [newFaction, setNewFaction] = useState(false);
  const [newKin, setNewKin] = useState(false);
  const [newLoreBit, setNewLoreBit] = useState(false);

  const rerender = () => {
    setRerenderCounter(rerenderCounter + 1);
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const clearForms = (newForm) => {
    setNewPerson(false);
    setNewObject(false);
    setNewPlace(false);
    setNewFaction(false);
    setNewKin(false);
    setNewLoreBit(false);
    newForm(true);
  };

  const getWorld = async () => {
    try {
      const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/world/fromWorldId/${worldId}`);
      setWorld(response.data.world);
      setFormData(response.data.world);
      getOwner(response.data.world.worldOwner);      
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  const getMarkers = async () => {
    try {
      const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/marker/fromWorldId/${worldId}`);
      setMarkers(response.data.markers);
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  const getFactions = async () => {
    try {
      const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/faction/fromWorldId/${worldId}`);
      setFactions(response.data.factions);
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  const getKins = async () => {
    try {
      const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/kin/fromWorldId/${worldId}`);
      setKins(response.data.kins);
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  const getLoreBits = async () => {
    try {
      const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/loreBit/fromWorldId/${worldId}`);
      setLoreBits(response.data.loreBits);
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  const getMaps = async () => {
    try {
      const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/map/fromWorld/${worldId}`);
      setMaps(response.data.maps);
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  const getOwner = async (worldOwner) => {
    try {
      const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/user/fromId/${worldOwner}`);
      setOwner(response.data.user);
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  const handlePersonPageChange = (newPage) => {
    setPersonPage(newPage);
  };

  const handleObjectPageChange = (newPage) => {
    setObjectPage(newPage);
  };

  const handlePlacePageChange = (newPage) => {
    setPlacePage(newPage);
  };

  const handleFactionPageChange = (newPage) => {
    setFactionPage(newPage);
  };

  const handleKinPageChange = (newPage) => {
    setKinPage(newPage);
  };

  const handleLoreBitPageChange = (newPage) => {
    setLoreBitPage(newPage);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
        
    try {
      const response = await axios.post('https://loremapper-backend-b042c39916b5.herokuapp.com/world/update', formData);
      const requestData = response.data.worldData;
      if (!requestData.updated) {
        document.getElementById('formError').innerHTML = requestData.error;
      } else {        
        setWorld(formData);
        getWorld();
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
    formDataForSubmission.append('worldThumbnail', file);
    
    try {
      const response = await axios.post('https://loremapper-backend-b042c39916b5.herokuapp.com/world/changeImage', formDataForSubmission);
      const requestData = response.data.worldData;
      if (!requestData.updated) {
        document.getElementById('formError').innerHTML = requestData.error;
      } else {        
        setWorld(formData);        
        getWorld();
        setEditing(!editing);        
      }
    } catch (error) {
      console.error('Update error: ', error);
      document.getElementById('formError').innerHTML = error.message;
    }
  };

  useEffect(() => {
    getWorld();
    getMarkers();
    getFactions();
    getKins();
    getLoreBits();
    getMaps();
  }, [rerenderCounter]);

  return (
    <div style={divStyles}>
      {world && <h2 style={titleStyles}>Sobre {world.worldName}</h2>}
      {world && !editing ? (
        <div style={infoStyles}>
          <div style={columnStyles}>
            <div
              style={{
                ...thumbnailStyles,
                backgroundImage: `url(https://loremapper-backend-b042c39916b5.herokuapp.com/images/${world.worldThumbnail})`
              }}
            >              
            </div>
            <div style={infoItemStyles}>
              <div style={{alignItems:'center',display:'flex',marginTop:'-5px'}}><FaMapMarkerAlt size={20} style={{margin:'0 5px'}}/> {markers ? markers.length : 0}</div>
              <div style={{alignItems:'center',display:'flex',marginTop:'-5px'}}><BiSolidShieldAlt2 size={20} style={{margin:'0 5px'}}/> {factions ? factions.length : 0}</div>
              <div style={{alignItems:'center',display:'flex',marginTop:'-5px'}}><GiDna1 size={20} style={{margin:'0 5px'}}/> {kins ? kins.length : 0}</div>            
              {user && owner && user.userId === owner.userId && <button style={{...buttonStyles,marginLeft:'auto', marginRight:'5px'}} onClick={()=>setEditing(!editing)}><BsPencilFill size={20}/></button>}
            </div>
            <div style={{...infoItemStyles,backgroundColor:'#282c34'}}>Usuario: </div>
            {owner && <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)'}}>{owner.userName}</div>}
            <div style={{...infoItemStyles,backgroundColor:'#282c34'}}>Visibilidad: </div>  
            <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 40px)'}}>{world.worldVisibility === 'public' ? 'Público' : 'Privado'}</div>  
            {world.worldStatus === 'blocked' && <div style={{...infoItemStyles,backgroundColor:'#282c34'}}>Estado: </div>}
            {world.worldStatus === 'blocked' && <div style={{...infoItemStyles,padding:'0 10px',width:'calc(100% - 66px)',border:'1px solid red'}}>Bloqueado</div>}
          </div>
          <div style={{...columnStyles, width:'69%', borderLeft: '2px solid #282c34', paddingLeft:'20px'}}>
            <div>{world.worldDescription}</div>
          </div>
        </div>
      ):(
        <form style={infoStyles} onSubmit={handleSubmit}>
          <div style={columnStyles}>
            <label
              style={{
                ...thumbnailStyles,
                backgroundImage: world && `url(https://loremapper-backend-b042c39916b5.herokuapp.com/images/${world.worldThumbnail})`
              }}
            >
              <div style={overlayStyles}>
                <BsPencilFill size={100}/>
                <input
                  style={{display:'none'}}
                  type="file"
                  accept="image/*"
                  name="worldThumbnail"
                  onChange={changeImage}                  
                />
              </div>  
            </label>
            <div style={infoItemStyles}>
              <div style={{alignItems:'center',display:'flex'}}><FaMapMarkerAlt size={20} style={{margin:'0 5px'}}/> {markers ? markers.length : 0}</div>
              <div style={{alignItems:'center',display:'flex'}}><BiSolidShieldAlt2 size={20} style={{margin:'0 5px'}}/> {factions ? factions.length : 0}</div>
              <div style={{alignItems:'center',display:'flex'}}><GiDna1 size={20} style={{margin:'0 5px'}}/> {kins ? kins.length : 0}</div>
            </div>
            {owner && <div style={infoItemStyles}>Usuario: {owner.userName}</div>}
            <div style={infoItemStyles}>Nombre:
              <input 
                type='text'
                value={formData && formData.worldName}
                onChange={e => handleInputChange('worldName', e.target.value)}
                style={{marginLeft:'auto', width:'68%'}}>

              </input>
            </div> 
            <div style={infoItemStyles}>Visibilidad: 
              <select
                value={formData && formData.worldVisibility}
                onChange={e => handleInputChange('worldVisibility', e.target.value)}
                style={{marginLeft:'auto', width:'70%'}}>
                  <option value={'public'}>Público</option>
                  <option value={'private'}>Privado</option>
              </select>
            </div>            
          </div>
          <div style={{...columnStyles, width:'69%', borderLeft: '2px solid #282c34', paddingLeft:'20px'}}>
            <textarea
              style={{...infoItemStyles,resize:'vertical',width:'100%',height:'200px'}}
              onChange={e => handleInputChange('worldDescription', e.target.value)}
              value={formData && formData.worldDescription}>
            </textarea>
            <div style={{...infoItemStyles,width:'100%',marginTop:'auto',flexWrap:'wrap'}}>
              <span id="formError" style={{...errorStyles,margin:'10px'}}></span>
              <button style={{...formButtonStyles,backgroundColor:'red'}} type="button" onClick={()=>{setEditing(!editing)}}>Cancelar</button>
              <button style={{...formButtonStyles,backgroundColor:'#007bff'}} type="submit">Confirmar</button>
            </div>
                
          </div>
        </form>
      )}
      {world && (
        <MapList
          worldId={world.worldId}
          handleComponentChange={handleComponentChange}
          user={user}
          worldName={world.worldName}
          worldOwner={world.worldOwner}
        />
      )}

      <div style={miniDivStyles}>
        <h2 style={{ ...titleStyles, width: '97%' }}>Personas</h2>
        {world && !newPerson &&
          <div style={consoleStyles}>
            <input
              type="text"
              placeholder="Buscar persona"
              value={searchedPerson}            
              onChange={(e) => setSearchedPerson(e.target.value)}
              style={{...searchStyles, width: user && world.worldOwner === user.userId ? '89%':'100%'}}
            />
            {user && world.worldOwner === user.userId && <button onClick={()=>{clearForms(setNewPerson)}} style={buttonStyles}><FaPlus size={20}/></button>}
          </div>
        }
        {markers && !newPerson &&
          markers
            .filter(marker => marker.markerType === 'person')
            .filter(marker => new RegExp(searchedPerson, "i").test(marker.markerName))
            .slice(personPage * markersPerPage, (personPage + 1) * markersPerPage)
            .map((marker, index) => (
              <div style={markerCardSocketStyles} key={index}>
                <WorldMarkerCard
                  marker={marker}
                  key={marker.markerId}
                  handleComponentChange={handleComponentChange}
                  user={user}
                  worldId={worldId}
                  markers={markers}
                  factions={factions}
                  kins={kins}
                  rerenderCounter={rerenderCounter}
                  setRerenderCounter={setRerenderCounter}
                  getMarkers={getMarkers}
                  maps={maps}
                />
              </div>
            ))
        }
        {markers && markers.filter(marker => marker.markerType === 'person').filter(marker => new RegExp(searchedPerson, "i").test(marker.markerName)).length > markersPerPage && !newPerson && 
          <div style={paginationControlsStyles}>
            <button style={paginationButtonStyles} onClick={() => setPersonPage(personPage - 1)} disabled={personPage === 0}>
              {'<'}
            </button>
            {generatePageNumbers(Math.ceil(markers.filter(marker => marker.markerType === 'person').filter(marker => new RegExp(searchedPerson, "i").test(marker.markerName)).length / markersPerPage), personPage, handlePersonPageChange)}
            <button style={paginationButtonStyles} onClick={() => setPersonPage(personPage + 1)} disabled={markers.filter(marker => marker.markerType === 'person').filter(marker => new RegExp(searchedPerson, "i").test(marker.markerName)).length <= (personPage + 1) * markersPerPage}>
              {'>'}
            </button>
          </div>
        }
        {newPerson && 
          <div style={{padding:'0 20px'}}>
            <NewWorldMarker worldId={worldId} getMarkers={getMarkers} setNewMarker={setNewPerson} markers={markers} kins={kins} factions={factions} type={'person'}/>
          </div>          
        }
      </div>

      <div style={miniDivStyles}>
        <h2 style={{ ...titleStyles, width: '97%' }}>Objetos</h2>
        {world && !newObject && 
          <div style={consoleStyles}>
            <input
              type="text"
              placeholder="Buscar objeto"
              value={searchedObject}            
              onChange={(e) => setSearchedObject(e.target.value)}
              style={{...searchStyles, width: user && world.worldOwner === user.userId ? '89%':'100%'}}
            />
            {user && world.worldOwner === user.userId && <button onClick={()=>{clearForms(setNewObject)}} style={buttonStyles}><FaPlus size={20}/></button>}
          </div>
        }
        {markers && !newObject && 
          markers
            .filter(marker => marker.markerType === 'object')
            .filter(marker => new RegExp(searchedObject, "i").test(marker.markerName))
            .slice(objectPage * markersPerPage, (objectPage + 1) * markersPerPage)
            .map((marker, index) => (
              <div style={markerCardSocketStyles} key={index}>
                <WorldMarkerCard
                  marker={marker}
                  key={marker.markerId}
                  handleComponentChange={handleComponentChange}
                  user={user}
                  worldId={worldId}
                  markers={markers}
                  factions={factions}
                  kins={kins}
                  rerenderCounter={rerenderCounter}
                  setRerenderCounter={setRerenderCounter}
                  getMarkers={getMarkers}
                  maps={maps}
                />
              </div>
            ))
          }
        {markers && markers.filter(marker => marker.markerType === 'object').filter(marker => new RegExp(searchedObject, "i").test(marker.markerName)).length > markersPerPage && !newObject && 
          <div style={paginationControlsStyles}>
            <button style={paginationButtonStyles} onClick={() => setObjectPage(objectPage - 1)} disabled={objectPage === 0}>
              {'<'}
            </button>
            {generatePageNumbers(Math.ceil(markers.filter(marker => marker.markerType === 'object').filter(marker => new RegExp(searchedObject, "i").test(marker.markerName)).length / markersPerPage), objectPage, handleObjectPageChange)}
            <button style={paginationButtonStyles} onClick={() => setObjectPage(objectPage + 1)} disabled={markers.filter(marker => marker.markerType === 'object').filter(marker => new RegExp(searchedObject, "i").test(marker.markerName)).length <= (objectPage + 1) * markersPerPage}>
              {'>'}
            </button>
          </div>
        }
        {newObject && 
          <div style={{padding:'0 20px'}}>
            <NewWorldMarker worldId={worldId} getMarkers={getMarkers} setNewMarker={setNewObject} markers={markers} kins={kins} factions={factions} type={'object'}/>
          </div>          
        }
      </div>
      
      <div style={miniDivStyles}>
        <h2 style={{ ...titleStyles, width: '97%' }}>Lugares</h2>
        {world && !newPlace && 
          <div style={consoleStyles}>
            <input
              type="text"
              placeholder="Buscar lugar"
              value={searchedPlace}            
              onChange={(e) => setSearchedPlace(e.target.value)}
              style={{...searchStyles, width: user && world.worldOwner === user.userId ? '89%':'100%'}}
            />
            {user && world.worldOwner === user.userId && <button onClick={()=>{clearForms(setNewPlace)}} style={buttonStyles}><FaPlus size={20}/></button>}
          </div>
        }
        {markers && !newPlace && 
          markers
            .filter(marker => marker.markerType === 'place')
            .filter(marker => new RegExp(searchedPlace, "i").test(marker.markerName))
            .slice(placePage * markersPerPage, (placePage + 1) * markersPerPage)
            .map((marker, index) => (
              <div style={markerCardSocketStyles} key={index}>
                <WorldMarkerCard
                  marker={marker}
                  key={marker.markerId}
                  handleComponentChange={handleComponentChange}
                  user={user}
                  worldId={worldId}
                  markers={markers}
                  factions={factions}
                  kins={kins}
                  rerenderCounter={rerenderCounter}
                  setRerenderCounter={setRerenderCounter}
                  getMarkers={getMarkers}
                  maps={maps}
                />
              </div>
            ))
        }
        {markers && markers.filter(marker => marker.markerType === 'place').filter(marker => new RegExp(searchedPlace, "i").test(marker.markerName)).length > markersPerPage && !newPlace && 
          <div style={paginationControlsStyles}>
            <button style={paginationButtonStyles} onClick={() => setPlacePage(placePage - 1)} disabled={placePage === 0}>
              {'<'}
            </button>
            {generatePageNumbers(Math.ceil(markers.filter(marker => marker.markerType === 'place').filter(marker => new RegExp(searchedPlace, "i").test(marker.markerName)).length / markersPerPage), placePage, handlePlacePageChange)}
            <button style={paginationButtonStyles} onClick={() => setPlacePage(placePage + 1)} disabled={markers.filter(marker => marker.markerType === 'place').filter(marker => new RegExp(searchedPlace, "i").test(marker.markerName)).length <= (placePage + 1) * markersPerPage}>
              {'>'}
            </button>
          </div>
        }
        {newPlace && 
          <div style={{padding:'0 20px'}}>
            <NewWorldMarker worldId={worldId} getMarkers={getMarkers} setNewMarker={setNewPlace} markers={markers} kins={kins} factions={factions} type={'place'}/>
          </div>          
        }
      </div>

      <div style={{...miniDivStyles,marginTop:'20px'}}>
        <h2 style={{ ...titleStyles, width: '97%' }}>Facciones</h2>
        {world && !newFaction &&
          <div style={consoleStyles}>
            <input
              type="text"
              placeholder="Buscar facción"
              value={searchedFaction}
              onChange={(e) => setSearchedFaction(e.target.value)}
              style={{...searchStyles, width: user && world.worldOwner === user.userId ? '89%':'100%'}}
            />
            {user && world.worldOwner === user.userId && <button onClick={()=>{clearForms(setNewFaction)}} style={buttonStyles}><FaPlus size={20}/></button>}
          </div>
        }
        {factions && !newFaction &&
          factions            
            .filter(faction => new RegExp(searchedFaction, "i").test(faction.factionName))
            .slice(factionPage * markersPerPage, (factionPage + 1) * markersPerPage)
            .map((faction, index) => (
              <div style={markerCardSocketStyles} key={index}>
                <WorldFactionCard
                  faction={faction}
                  key={faction.factionId}                  
                  user={user}
                  worldId={worldId}
                  markers={markers}
                  factions={factions}
                  kins={kins}
                  rerenderCounter={rerenderCounter}
                  setRerenderCounter={setRerenderCounter}
                  getMarkers={getMarkers}
                  getFactions={getFactions}
                  maps={maps}
                />
              </div>
            ))
        }
        {factions && factions.filter(faction => new RegExp(searchedFaction, "i").test(faction.factionName)).length > markersPerPage && !newFaction &&
          <div style={paginationControlsStyles}>
            <button style={paginationButtonStyles} onClick={() => setFactionPage(factionPage - 1)} disabled={factionPage === 0}>
              {'<'}
            </button>
            {generatePageNumbers(Math.ceil(factions.filter(faction => new RegExp(searchedFaction, "i").test(faction.factionName)).length / markersPerPage), factionPage, handleFactionPageChange)}
            <button style={paginationButtonStyles} onClick={() => setFactionPage(factionPage + 1)} disabled={factions.filter(faction => new RegExp(searchedFaction, "i").test(faction.factionName)).length <= (factionPage + 1) * markersPerPage}>
              {'>'}
            </button>
          </div>
        }
        {newFaction && 
          <div style={{padding:'0 20px'}}>
            <NewFaction worldId={worldId} displayMarkers={()=>{}} setShowNewForm={setNewFaction} getFactions={getFactions}/>
          </div>          
        }
      </div>

      <div style={{...miniDivStyles,marginTop:'20px'}}>
        <h2 style={{ ...titleStyles, width: '97%' }}>Culturas</h2>
        {world && !newKin &&
          <div style={consoleStyles}>
            <input
              type="text"
              placeholder="Buscar cultura"
              value={searchedKin}
              onChange={(e) => setSearchedKin(e.target.value)}
              style={{...searchStyles, width: user && world.worldOwner === user.userId ? '89%':'100%'}}
            />
            {user && world.worldOwner === user.userId && <button onClick={()=>{clearForms(setNewKin)}} style={buttonStyles}><FaPlus size={20}/></button>}
          </div>
        }
        {kins && !newKin &&
          kins            
            .filter(kin => new RegExp(searchedKin, "i").test(kin.kinName))
            .slice(kinPage * markersPerPage, (kinPage + 1) * markersPerPage)
            .map((kin, index) => (
              <div style={markerCardSocketStyles} key={index}>
                <WorldKinCard
                  kin={kin}
                  key={kin.kinId}                  
                  user={user}
                  worldId={worldId}
                  markers={markers}                  
                  kins={kins}
                  rerenderCounter={rerenderCounter}
                  setRerenderCounter={setRerenderCounter}
                  getMarkers={getMarkers}
                  getKins={getKins}
                  maps={maps}
                />
              </div>
            ))
        }
        {kins && kins.filter(kin => new RegExp(searchedKin, "i").test(kin.kinName)).length > markersPerPage && !newKin &&
          <div style={paginationControlsStyles}>
            <button style={paginationButtonStyles} onClick={() => setKinPage(kinPage - 1)} disabled={kinPage === 0}>
              {'<'}
            </button>
            {generatePageNumbers(Math.ceil(kins.filter(kin => new RegExp(searchedKin, "i").test(kin.kinName)).length / markersPerPage), kinPage, handleKinPageChange)}
            <button style={paginationButtonStyles} onClick={() => setKinPage(kinPage + 1)} disabled={kins.filter(kin => new RegExp(searchedKin, "i").test(kin.kinName)).length <= (kinPage + 1) * markersPerPage}>
              {'>'}
            </button>
          </div>
        }
        {newKin && 
          <div style={{padding:'0 20px'}}>
            <NewKin worldId={worldId} displayMarkers={()=>{}} setShowNewForm={setNewKin} getKins={getKins}/>
          </div>          
        }
      </div>

      <div style={{...miniDivStyles,marginTop:'20px'}}>
        <h2 style={{ ...titleStyles, width: '97%' }}>Lore</h2>
        {world && !newLoreBit &&
          <div style={consoleStyles}>
            <input
              type="text"
              placeholder="Buscar lore"
              value={searchedLoreBit}
              onChange={(e) => setSearchedLoreBit(e.target.value)}
              style={{...searchStyles, width: user && world.worldOwner === user.userId ? '89%':'100%'}}
            />
            {user && world.worldOwner === user.userId && <button onClick={()=>{clearForms(setNewLoreBit)}} style={buttonStyles}><FaPlus size={20}/></button>}
          </div>
        }
        {loreBits && !newLoreBit &&
          loreBits            
            .filter(loreBit => new RegExp(searchedLoreBit, "i").test(loreBit.loreBitTitle))
            .slice(loreBitPage * markersPerPage, (loreBitPage + 1) * markersPerPage)
            .map((loreBit, index) => (
              <div style={markerCardSocketStyles} key={index}>
                <WorldLoreBitCard
                  loreBit={loreBit}
                  key={loreBit.loreBitId}                  
                  user={user}
                  worldId={worldId}                  
                  loreBits={loreBits}
                  rerenderCounter={rerenderCounter}
                  setRerenderCounter={setRerenderCounter}
                  getMarkers={getMarkers}
                  getLoreBits={getLoreBits}
                  maps={maps}
                />
              </div>
            ))
        }
        {loreBits && loreBits.filter(loreBit => new RegExp(searchedLoreBit, "i").test(loreBit.loreBitTitle)).length > markersPerPage && !newLoreBit &&
          <div style={paginationControlsStyles}>
            <button style={paginationButtonStyles} onClick={() => setLoreBitPage(loreBitPage - 1)} disabled={loreBitPage === 0}>
              {'<'}
            </button>
            {generatePageNumbers(Math.ceil(loreBits.filter(loreBit => new RegExp(searchedLoreBit, "i").test(loreBit.loreBitTitle)).length / markersPerPage), loreBitPage, handleLoreBitPageChange)}
            <button style={paginationButtonStyles} onClick={() => setLoreBitPage(loreBitPage + 1)} disabled={loreBits.filter(loreBit => new RegExp(searchedLoreBit, "i").test(loreBit.loreBitTitle)).length <= (loreBitPage + 1) * markersPerPage}>
              {'>'}
            </button>
          </div>
        }
        {newLoreBit &&
          <div style={{padding:'0 20px'}}>
            <NewLoreBit worldId={worldId} setShowNewForm={setNewLoreBit} getLoreBits={getLoreBits}/>
          </div> 
        }        
      </div>

    </div>
  );
};

export default World;
