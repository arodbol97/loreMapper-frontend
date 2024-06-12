import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsImageFill } from "react-icons/bs";

const NewMap = ({worldId , user , getMaps , worldName, setNewMap, maps}) => {
  const errorStyles = {
    width: '100%',
    textAlign: 'center',
    color: 'red',
    fontSize: '15px',
    margin: '20px'
  };

  const thumbnailStyles = {
    width: '90%',
    height: '300px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#282c34',
    marginBottom: '10px',
    border: '2px solid #282c34',
    borderRadius: '10px',
    cursor: 'pointer',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    display: 'flex',
    flexWrap: 'wrap'
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
    width: '40%',
    lineHeight: 1.5,
    marginBottom: '2em',
    wordSpacing: '0.2em',      
  };

  const [formData, setFormData] = useState({
    mapName: '',
    parentMap: 'none',
    mapImage: null,
    mapImagePreview: ''
  });

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

  const [parentMaps, setParentMaps] = useState([]);

  useEffect(() => {
    const fetchParentMaps = async () => {
      try {
        const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/map/fromWorld/${worldId}`);
        const maps = response.data.maps;
        let mapNames = [];
        maps.forEach(map => {
          mapNames.push({name:map.mapName,id:map.mapId});
        });
        setParentMaps(mapNames);
      } catch (error) {
        console.error('Fetch Parent Maps error: ', error);
      }
    };

    fetchParentMaps();
  }, [formData]);

  const handleChange = (name, value) => {    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const thumbnailElement = document.getElementById('thumbnail');

    if(file !== undefined){
      setFormData({
        ...formData,
        mapImage: file,        
      });
      if (thumbnailElement) {
        thumbnailElement.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataForSubmission = new FormData();
    formDataForSubmission.append('mapName', formData.mapName);
    formDataForSubmission.append('parentMap', formData.parentMap);
    formDataForSubmission.append('mapImage', formData.mapImage);
    formDataForSubmission.append('mapWorld', worldId);

    try {
      const response = await axios.post('https://loremapper-backend-b042c39916b5.herokuapp.com/map/create', formDataForSubmission);      
      const mapData = response.data.mapData;
      console.log(mapData.created);
      if (!mapData.created) {
        document.getElementById('formError').innerHTML = mapData.error;        
      } else {
        getMaps();
        setNewMap(false);
      }
    } catch (error) {
      console.error('Create Map error: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={infoStyles}>
      <div style={columnStyles}>    
        <div style={{...statStyles, backgroundColor: '#282c34',width:'calc(90% + 4px)'}}>Imagen:</div>    
        <label
          style={{
            ...thumbnailStyles,
            justifyContent:'space-evenly'
          }}
          id='thumbnail'>            
            <div style={{width:'100%'}}></div>
            {!formData.mapImage && <BsImageFill size={200}style={{width:'100%'}}/>}
            <input
              style={{width:'100%',zIndex:'-1'}}
              type="file"
              accept="image/*"
              name="mapImage"
              onChange={handleImageChange}
              required
            />
        </label>        
      </div>
      <div style={{...columnStyles, width:'60%', borderLeft: '2px solid #282c34', paddingLeft:'20px'}}>
        <div style={{...statStyles, backgroundColor: '#282c34'}}>Nombre:</div>
        <div style={{...statStyles}}>
          <input
            type="text"
            value={formData.mapName}
            onChange={e => handleChange('mapName', e.target.value)}
            style={{width: '100%'}}
            id="mapNameForm"
            maxLength={100}
          />
        </div>

        <div style={{...statStyles, backgroundColor: '#282c34'}}>Región de:</div>
        <div style={{...statStyles}}>
          <select 
            name="parent" 
            style={{width: '100%'}} 
            value={formData.mapParent || ''}
            onChange={e => handleChange('mapParent', e.target.value)}
            id="mapParentForm">
              <option value=""></option>
              {maps && 
                maps                  
                  .map((parent, index) => (
                      <option value={parseInt(parent.mapId)} key={index}>{parent.mapName}</option>
              ))}                        
          </select>
        </div>     
        <span id="formError" style={errorStyles}></span>
        
        <div style={{...statStyles,height:'100%',alignItems:'end'}}>          
          <button style={{...formButtonStyles,backgroundColor:'red'}} type="button" onClick={()=>{setNewMap(false)}}>Cancelar</button>
          <button style={{...formButtonStyles,backgroundColor:'#007bff'}} id="submitMapButton" type="submit">Confirmar</button>
        </div>        
      </div>
    </form>    
  );
};

export default NewMap;