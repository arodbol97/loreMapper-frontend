import React, { useState, useEffect } from 'react';
import axios from 'axios';
import List from './List';

const NewWorldMarker = ({ worldId , type, getMarkers, markers, factions, kins, setNewMarker}) => {
    const divStyles = {
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',        
        alignItems: 'flex-start'
    }; 

    const formStyles = {        
        width: '100%',        
    };

    const labelStyles = {
        color: 'white',
        width: '20%',
        textAlign: 'right',
        paddingRight: '10px',
        marginBottom: '5px'
    };

    const inputStyles = {        
        width: 'calc(100% - 0px)', 
        marginBottom: '10px',
        boxSizing: 'border-box',
        backgroundColor: 'lightgrey'
    };

    const buttonStyles = {
        width: 'calc(50% - 0px)', 
        marginTop: '15px',
        boxSizing: 'border-box',
        color: 'white',
        cursor: 'pointer'
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

    const errorStyles = {
        width: '100%',
        textAlign: 'center',
        color: 'red',
        fontSize: '15px',
    };

    const markerCardSocketStyles = {
        padding: '5px',
        width: '100%',    
        display: 'flex',
        justifyContent: 'space-evenly'
    };
    
    const searchStyles = {
        display: 'flex',    
        width: '96%',    
        padding: '5px',   
        border: '2.5px solid #282c34',            
    };

    const formHeaderStyles = {        
        width: '97%',
        padding: '5px',      
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const infoStyles = {
        width: '100%',
        color: 'white',
        textAlign: 'center',        
        fontSize: '15px',
    };
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [home, setHome] = useState('');
    const [kin, setKin] = useState('');
    const [faction, setFaction] = useState('');
    const [value, setValue] = useState('');
    const [enchantment, setEnchantment] = useState('');
    const [objectType, setObjectType] = useState('weapon');
    const [population, setPopulation] = useState('');    

    const cancelForm = () => {
        getMarkers();   
        setNewMarker(false);  
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'name') {
            setName(value);
        } else if (name === 'description') {
            setDescription(value);
        } else if (name === 'home') {
            setHome(value);
        } else if (name === 'value') {
            setValue(value);
        } else if (name === 'enchantment') {
            setEnchantment(value);
        } else if (name === 'type') {
            setObjectType(value);            
        } else if (name === 'population') {
            setPopulation(value);
        } else if (name === 'faction') {
            setFaction(value);
        } else if (name === 'kin') {
            setKin(value);
        }
    };

    const renderAdditionalFields = () => {
        if (type === 'person') {
            return (
                <div>
                    <label style={labelStyles}>Hogar:</label>
                    <select name="home" style={inputStyles} onChange={handleChange}>
                        <option value="none"></option>
                        {markers && markers
                            .filter(marker => marker.markerType === 'place')                            
                            .map((marker, index) => (
                                <option value={parseInt(marker.placeId)}>{marker.markerName}</option>
                        ))}                        
                    </select>
                </div>                
            );
        } else if (type === 'object') {
            return (
                <div>
                    <label style={labelStyles}>Valor:</label>
                    <input style={inputStyles} type="number" name="value" onChange={handleChange} />
                    <label style={labelStyles}>Encantamiento:</label>
                    <textarea style={{ ...inputStyles, resize: 'vertical' }} name="enchantment" onChange={handleChange} />
                    <label style={labelStyles}>Tipo:</label>
                    <select style={inputStyles} name="type" onChange={handleChange}>
                        <option value="Arma">Arma</option>
                        <option value="Armadura">Armadura</option>
                        <option value="Misceláneo">Misceláneo</option>
                        <option value="Libro">Libro</option>
                        <option value="Consumible">Consumible</option>
                    </select>
                </div>
            );
        } else if (type === 'place') {
            return (
                <div>
                    <label style={labelStyles}>Población:</label>
                    <input style={inputStyles} type="text" name="population" onChange={handleChange} />    
                </div>                
            );
        }
    };

    const renderTitle = () => {
        if (type === 'person') {
            return (
                <h3 style={titleStyles}>Nueva persona</h3>
            );
        } else if (type === 'object') {
            return (
                <h3 style={titleStyles}>Nuevo objeto</h3>
            );
        } else if (type === 'place') {
            return (
                <h3 style={titleStyles}>Nuevo lugar</h3>
            );
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const formData = {
            markerWorld: worldId,            
            markerName: name,
            markerDescription: description,            
            markerFaction: faction,
            markerKin: kin,
            markerType: type,
            personHome: home,
            objectValue: value,
            objectEnchantment: enchantment,
            objectType: objectType,
            placePopulation: population,            
        };
        try {
          const response = await axios.post('https://loremapper-backend-b042c39916b5.herokuapp.com/marker/create', formData);          
          const markerData = response.data.markerData;          
          if (!markerData.created) {
            document.getElementById('formError').innerHTML = markerData.error;
          } else {
            cancelForm();                        
          }
        } catch (error) {
          console.error('Create error: ', error);
          document.getElementById('formError').innerHTML = error.message;
        }
    };

    useEffect(() => {
        return () => {            
            cancelForm();            
        };
    }, []); 

    return (        
        <div style={divStyles}>
            {renderTitle()}
            <form onSubmit={handleSubmit} style={formStyles} id='markerForm'>
                <label style={labelStyles}>Nombre:</label>
                <input style={inputStyles} type="text" name="name" value={name} maxLength={50} onChange={handleChange} />
                <label style={labelStyles}>Descripción:</label>
                <textarea style={{ ...inputStyles, resize: 'vertical' }} name="description" value={description} onChange={handleChange}></textarea>                
                <label style={labelStyles}>Facción:</label>
                <select name="faction" style={inputStyles} onChange={handleChange}>
                    <option value=""></option>
                    {factions && factions
                        .map((faction, index) => (
                            <option value={parseInt(faction.factionId)}>{faction.factionName}</option>
                    ))}                        
                </select>
                <label style={labelStyles}>Cultura:</label>
                <select name="kin" style={inputStyles} onChange={handleChange}>
                    <option value=""></option>
                    {kins && kins
                        .map((kin, index) => (
                            <option value={parseInt(kin.kinId)}>{kin.kinName}</option>
                    ))}                        
                </select>
                {renderAdditionalFields()}                
                <button style={{ ...buttonStyles, backgroundColor:'red', color:'white',fontWeight:'bold',marginTop:'0'}} type="button" onClick={cancelForm}>Cancelar</button>
                <button style={{ ...buttonStyles, backgroundColor:'#007bff', color:'white',fontWeight:'bold',marginTop:'0'}} type="submit">Confirmar</button>                        
                <span id="formError" style={errorStyles}></span>
            </form>            
        </div>
    );
};

export default NewWorldMarker;