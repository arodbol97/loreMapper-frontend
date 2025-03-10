import React, { useState, useEffect } from 'react';
import axios from 'axios';
import World from './World';
import { BsImageFill } from "react-icons/bs";

const NewWorld = ({user, getWorlds, setNewWorld}) => {
  const formStyles = {
    backgroundColor: '#282c34',
    color: 'white',
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '400px',
    margin: '10px',
    marginTop: '100px',
    padding: '20px',
    borderRadius: '20px',
  };

  const inputStyles = {
    width: '60%',
    marginLeft: '10px',
  };

  const labelStyles = {
    display: 'flex',
    width: '100%',
    justifyContent: 'right',
    margin: '2px',
  };

  const buttonStyles = {
    width: '100%',
    height: '30px',
    textAlign: 'center',
    margin: '2px',
    marginTop: '10px',
    fontSize: '15px',
  };

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

  const infoItemStyles = {
    margin: '5px 0'
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
    worldName: '',
    worldVisibility: 'public',
    worldThumbnail: null,
    worldThumbnailPreview: '',    
    worldDescription: ''
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

  useEffect(() => {
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
        worldThumbnail: file,        
      });
      if (thumbnailElement) {
        thumbnailElement.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataForSubmission = new FormData();
    formDataForSubmission.append('worldName', formData.worldName);
    formDataForSubmission.append('worldVisibility', formData.worldVisibility);
    formDataForSubmission.append('worldThumbnail', formData.worldThumbnail);
    formDataForSubmission.append('worldDescription', formData.worldDescription);
    formDataForSubmission.append('worldOwner', user && user.userId);

    try {
      const response = await axios.post('https://lore-mapper-backend.vercel.app//world/create', formDataForSubmission);      
      const worldData = response.data.worldData;      
      if (!worldData.created) {
        document.getElementById('formError').innerHTML = worldData.error;        
      } else {        
        getWorlds();
        setNewWorld(false);
      }
      if (worldData.created) {
        console.log('how3');
      }
    } catch (error) {
      console.error('Create World error: ', error);
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
            {!formData.worldThumbnail && <BsImageFill size={200}style={{width:'100%'}}/>}
            <input
              style={{width:'100%',zIndex:'-1'}}
              type="file"
              accept="image/*"
              name="worldThumbnail"
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
            value={formData.worldName}
            onChange={e => handleChange('worldName', e.target.value)}
            style={{width: '100%'}}
            maxLength={100}
          />
        </div>

        <div style={{...statStyles, backgroundColor: '#282c34'}}>Visibilidad:</div>
        <div style={{...statStyles}}>
          <select 
            name="visibility" 
            style={{width: '100%'}} 
            value={formData.worldVisibility}
            onChange={e => handleChange('worldVisibility', e.target.value)}>
              <option value="public">Público</option>
              <option value="private">Privado</option>
          </select>
        </div>     

        <div style={{...statStyles, backgroundColor: '#282c34'}}>Descripción:</div>
          <div style={{...statStyles}}>
            <textarea
              value={formData.worldDescription}
              onChange={e => handleChange('worldDescription', e.target.value)}
              style={{width: '100%', height: '60px', resize: 'vertical'}}
              maxLength={1500}
            />
        </div> 

        <span id="formError" style={errorStyles}></span>
        
        <div style={{...statStyles,height:'100%',alignItems:'end'}}>          
          <button style={{...formButtonStyles,backgroundColor:'red'}} type="button" onClick={()=>{setNewWorld(false)}}>Cancelar</button>
          <button style={{...formButtonStyles,backgroundColor:'#007bff'}} type="submit">Confirmar</button>
        </div>        
      </div>
    </form>    
  );
};

export default NewWorld;