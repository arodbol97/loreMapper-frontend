import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MarkerCard from './MarkerCard';

const List = ({ worldId , mapId, user, handleComponentChange, displayMarkers, hideMarker, map, hoveredMarker, setHoveredMarker }) => {

  const divStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    height: '10%',             
  };

  const titleStyles = {
    border: '5px solid #282c34',
    width: '100%',
    height: '30px',
    color: 'white',
    margin: '10px 0 20px 0',    
    textAlign: 'center',
    backgroundColor: '#007bff'
  };

  const markerCardSocketStyles = {
    padding: '5px',
    width: '100%',    
    display: 'flex',
    justifyContent: 'space-evenly'
  };

  const searchStyles = {
    display: 'flex',    
    width: '100%',    
    padding: '5px',   
    border: '2.5px solid #282c34',    
    marginLeft: '-7px'
  };

  const buttonStyles = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',    
    backgroundColor: "#282c34",    
    color: 'white',    
  };

  const [rerenderCounter, setRerenderCounter] = useState(0);
  const [markers, setMarkers] = useState([]);    
  const [searched, setSearched] = useState('');
  const [showAllMarkers, setShowAllMarkers] = useState(true);

  let lastMarkerId = null;
  let repeat = false;

  const rerenderer = () => {
    setRerenderCounter(prevCounter => prevCounter + 1);
  };

  const handleSearch = (event) => {
    const { name, value } = event.target;
    setSearched(value);    
    markers      
      .filter(marker => !new RegExp(value, "i").test(marker.markerName))
      .forEach(marker => hideMarker(marker.markerId));
    markers      
      .filter(marker => new RegExp(value, "i").test(marker.markerName))
      .forEach(marker => hideMarker(false,marker.markerId));
      
    hideOrShow(true);
    displayMarkers(); 
    console.log(showAllMarkers);
  };

  const hideOrShow = async (show = false) => {    
    setShowAllMarkers(show);    
    rerenderer();
    console.log(showAllMarkers);
  };

  const getMarkers = async () => {
    try {
      const response = await axios.get(`https://lore-mapper-backend.vercel.app/marker/fromMapId/${mapId}`);

      const updatedMarkers = response.data.markers.map(marker => ({
        ...marker,
        deleted: false
      })).sort((a, b) => a.markerName.localeCompare(b.markerName));;

      setMarkers(updatedMarkers);
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  useEffect(() => {
    getMarkers();
    console.log("list");
  }, [rerenderCounter,searched,showAllMarkers,mapId]); 

  return (
    <div style={divStyles}>
      <div style={markerCardSocketStyles}>
        <input style={searchStyles} placeholder='Buscar Marcador' value={searched} onChange={handleSearch}></input>        
      </div>
      <div style={markerCardSocketStyles}>
        <button style={buttonStyles} onClick={()=>{hideOrShow(true)}}>Mostrar Todos</button>
        <button style={buttonStyles} onClick={()=>{hideOrShow(false)}}>Ocultar Todos</button>        
      </div>
      {markers && markers
        .filter(marker => marker.markerType === 'person')
        .filter(marker => marker.deleted === false)
        .filter(marker => new RegExp(searched, "i").test(marker.markerName))
        .length > 0 && 
          <h3 style={titleStyles}>Personas</h3>
      }
      {markers && markers
      .filter(marker => marker.markerType === 'person')
      .filter(marker => marker.deleted === false)
      .filter(marker => new RegExp(searched, "i").test(marker.markerName))
      .filter((marker, index, arr) => {
        if (index === 0 || arr[index - 1].markerId !== marker.markerId) {
          lastMarkerId = marker.markerId;
          repeat = false;
          return true;
        }
        repeat = true;
        return true;
      })
      .map((marker, index) => (
      <div
        style={markerCardSocketStyles}
        key={'listdiv'+index}
        >

        <MarkerCard
          marker={marker} 
          key={'list'+index} 
          handleComponentChange={handleComponentChange} 
          user={user} 
          rerenderer={rerenderer} 
          displayMarkers={displayMarkers} 
          hideMarker={hideMarker} 
          showAllMarkers={showAllMarkers} 
          rerenderCounter={rerenderCounter}
          worldId={worldId}
          map={map}
          hoveredMarker={hoveredMarker} 
          setHoveredMarker={setHoveredMarker}
          repeat={repeat}/>
      </div>
      ))}

      {markers && markers
        .filter(marker => marker.markerType === 'object')
        .filter(marker => marker.deleted === false)
        .filter(marker => new RegExp(searched, "i").test(marker.markerName))
        .length > 0 && 
          <h3 style={titleStyles}>Objetos</h3>
      }
      {markers && markers
      .filter(marker => marker.markerType === 'object')
      .filter(marker => marker.deleted === false)
      .filter(marker => new RegExp(searched, "i").test(marker.markerName))
      .filter((marker, index, arr) => {
        if (index === 0 || arr[index - 1].markerId !== marker.markerId) {
          lastMarkerId = marker.markerId;
          repeat = false;
          return true;
        }
        repeat = true;
        return true;
      })
      .map((marker, index) => (
      <div
        style={markerCardSocketStyles}
        key={'listdiv'+index}
        >

        <MarkerCard 
          marker={marker} 
          key={'list'+index} 
          handleComponentChange={handleComponentChange} 
          user={user} 
          rerenderer={rerenderer} 
          displayMarkers={displayMarkers} 
          hideMarker={hideMarker} 
          showAllMarkers={showAllMarkers}
          worldId={worldId}
          map={map}
          hoveredMarker={hoveredMarker} 
          setHoveredMarker={setHoveredMarker}
          repeat={repeat}/>          
      </div>
      ))}

      {markers && markers
        .filter(marker => marker.markerType === 'place')
        .filter(marker => marker.deleted === false)
        .filter(marker => new RegExp(searched, "i").test(marker.markerName))
        .length > 0 && 
          <h3 style={titleStyles}>Lugares</h3>
      }
      {markers && markers
      .filter(marker => marker.markerType === 'place')
      .filter(marker => marker.deleted === false)
      .filter(marker => new RegExp(searched, "i").test(marker.markerName))
      .filter((marker, index, arr) => {
        if (index === 0 || arr[index - 1].markerId !== marker.markerId) {
          lastMarkerId = marker.markerId;
          repeat = false;
          return true;
        }
        repeat = true;
        return true;
      })
      .map((marker, index) => (
      <div
        style={markerCardSocketStyles}
        key={'listdiv'+index}
        >

        <MarkerCard 
          marker={marker} 
          key={'list'+index} 
          handleComponentChange={handleComponentChange} 
          user={user} 
          rerenderer={rerenderer} 
          displayMarkers={displayMarkers} 
          hideMarker={hideMarker} 
          showAllMarkers={showAllMarkers}
          worldId={worldId}
          map={map}
          hoveredMarker={hoveredMarker} 
          setHoveredMarker={setHoveredMarker}
          repeat={repeat}/>
      </div>      
      ))}
    </div>    
  );
};

export default List;