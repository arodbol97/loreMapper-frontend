import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlaceMarkerCard from './PlaceMarkerCard';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import List from './List';

const NewMarker = ({ worldId , mapId, handleListChange, type, map, displayMarkers, hideMarker, user}) => {
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

    const [markers, setMarkers] = useState([]);  
    const [factions, setFactions] = useState([]);  
    const [kins, setKins] = useState([]);  
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [coords, setCoords] = useState(JSON.stringify({lng:0,lat:0}));
    const [home, setHome] = useState('');
    const [kin, setKin] = useState('');
    const [faction, setFaction] = useState('');
    const [value, setValue] = useState('');
    const [enchantment, setEnchantment] = useState('');
    const [objectType, setObjectType] = useState('Misceláneo');
    const [population, setPopulation] = useState('');
    const [newMarker, setNewMarker] = useState(false);
    const [changing, setChanging] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(0);
    const [searched, setSearched] = useState('');

    var tempMarker = null;
    var actualMarker = null;

    var moveEvent = (e) => {
        if (!tempMarker) {
            tempMarker = new mapboxgl.Marker({ color: 'lightblue' })
                .setLngLat([0, 0])
                .addTo(map);
        }
        const { lng, lat } = e.lngLat;

        if(!actualMarker){                
            //setCoords(JSON.stringify({lng:lng,lat:lat}));               
        }

        map.getCanvasContainer().style.cursor = 'none';

        if(tempMarker) {
            tempMarker.setLngLat([lng,lat]);
        }
    };
    var clickEvent = (e) => {
        const { lng, lat } = e.lngLat;            

        setCoords(JSON.stringify({lng:lng,lat:lat}));
        
        map.getCanvasContainer().style.cursor = 'none';

        if(actualMarker) {
            actualMarker.setLngLat([lng,lat]);
        } else {
            actualMarker = new mapboxgl.Marker({ color: '#007bff' })
            .setLngLat([lng, lat])
            .addTo(map);
        }
    };

    const cancelForm = () => {                
        if(tempMarker){
            tempMarker.remove();
            tempMarker = null;
        }
        if(actualMarker){
            actualMarker.remove();
            actualMarker = null;
        }
        if (moveEvent) {
            //moveEvent.remove();
            map.off('mousemove',moveEvent);
        }
        if (clickEvent) {            
            //clickEvent.remove();
            map.off('click',clickEvent);
        }
        if(map.getCanvasContainer()) {
            map.getCanvasContainer().style.cursor = ''; 
        }
        displayMarkers();   
        handleListChange(null);  
    };

    const handleCoordsChange = () => {        
        map.on('mousemove',moveEvent );

        map.on('click', clickEvent);

        map.getCanvasContainer().addEventListener('mouseleave', () => {
            if (tempMarker) {
                tempMarker.remove();
                tempMarker = null;
            }
        });
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
                    <textarea style={{ ...inputStyles, resize: 'vertical' }} name="enchantment" onChange={handleChange} maxLength={1000}/>
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
                <h3 style={titleStyles}>{newMarker ? 'Nueva' : 'Colocar'} persona</h3>
            );
        } else if (type === 'object') {
            return (
                <h3 style={titleStyles}>{newMarker ? 'Nuevo' : 'Colocar'} objeto</h3>
            );
        } else if (type === 'place') {
            return (
                <h3 style={titleStyles}>{newMarker ? 'Nuevo' : 'Colocar'} lugar</h3>
            );
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const formData = {
            markerWorld: worldId,
            mapId: mapId,
            markerName: name,
            markerDescription: description,
            markerPosition: coords,
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
          const response = await axios.post('https://loremapper-backend-b042c39916b5.herokuapp.com/marker/createandplace', formData);          
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

    const handleSubmit2 = async (event) => {
        event.preventDefault();
        
        const formData = {            
            mapId: mapId,
            markerId: selectedMarker,
            markerPosition: coords
        };
        if(!coords){
            document.getElementById('formError').innerHTML = 'Haz click en el mapa para seleccionar las coordenadas';
            return;
        }
        if(!selectedMarker){
            document.getElementById('formError').innerHTML = 'Selecciona un marcador';
            return;
        }
        try {
          const response = await axios.post('https://loremapper-backend-b042c39916b5.herokuapp.com/markerInMap', formData);          
          const markerData = response.data.created;
          if (!markerData) {
            document.getElementById('formError').innerHTML = 'El marcador no se pudo colocar';
          } else {
            cancelForm();
          }
        } catch (error) {
          console.error('Create error: ', error);
          document.getElementById('formError').innerHTML = error.message;
        }
    };

    useEffect(() => {
        const getMarkers = async () => {
            try {
                const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/marker/fromWorldId/${worldId}`);
                setMarkers(response.data.markers);
            } catch (error) {
                console.error('Request error: ', error);
            }
        };
        getMarkers();

        const getFactions = async () => {
            try {
                const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/faction/fromWorldId/${worldId}`);
                setFactions(response.data.factions);
            } catch (error) {
                console.error('Request error: ', error);
            }
        };
        getFactions();

        const getKins = async () => {
            try {
                const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/kin/fromWorldId/${worldId}`);
                setKins(response.data.kins);
            } catch (error) {
                console.error('Request error: ', error);
            }
        };
        getKins();

        handleCoordsChange();
        
        return () => {            
            cancelForm();            
        };
    }, []); 

    return (        
        <div style={divStyles}>
            {renderTitle()}            
            {newMarker ? (
                <form onSubmit={handleSubmit} style={formStyles} id='markerForm'>
                    <label style={labelStyles}>Nombre:</label>
                    <input style={inputStyles} type="text" name="name" value={name} maxLength={100} onChange={handleChange} />
                    <label style={labelStyles}>Descripción:</label>
                    <textarea style={{ ...inputStyles, resize: 'vertical' }} name="description" value={description} maxLength={1000} onChange={handleChange}></textarea>
                    <label style={labelStyles}>Coordenadas:</label>
                    <input
                        type="text"
                        value={JSON.parse(coords).lat !== 0 ? 'Y:'+JSON.parse(coords).lat : null}                    
                        style={inputStyles}
                        required
                    />
                    <input
                        type="text"
                        value={JSON.parse(coords).lng !== 0 ? 'Y:'+JSON.parse(coords).lng : null}                    
                        style={inputStyles}
                        required
                    />
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
                    <button style={{ ...buttonStyles, backgroundColor:'#282c34', color:'white',fontWeight:'bold', width:'100%'}} type="button" onClick={()=>{setNewMarker(false);}}>Colocar marcador existente</button>
                        <button style={{ ...buttonStyles, backgroundColor:'red', color:'white',fontWeight:'bold',marginTop:'0'}} type="button" onClick={cancelForm}>Cancelar</button>
                        <button style={{ ...buttonStyles, backgroundColor:'#007bff', color:'white',fontWeight:'bold',marginTop:'0'}} type="submit">Confirmar</button>                        
                    <span id="formError" style={errorStyles}></span>
                </form>
            ):(
                <form onSubmit={handleSubmit2} style={formStyles} id='markerForm'>
                    <div style={formHeaderStyles}>
                        <input style={searchStyles} placeholder='Buscar Marcador' value={searched} onChange={(e)=>{setSearched(e.target.value)}}></input>
                        <span id="formInfo" style={infoStyles}>Selecciona un marcador y haz click en el mapa para colocarlo</span>
                        <span id="formError" style={errorStyles}></span>                        
                        <button style={{ ...buttonStyles, backgroundColor:'#282c34', color:'white',fontWeight:'bold', width:'100%'}} type="button" onClick={()=>{setChanging(true);setNewMarker(true);}}>Crear nuevo marcador</button>
                        <button style={{ ...buttonStyles, backgroundColor:'red', color:'white',fontWeight:'bold',marginTop:'0'}} type="button" onClick={cancelForm}>Cancelar</button>
                        <button style={{ ...buttonStyles, backgroundColor:'#007bff', color:'white',fontWeight:'bold',marginTop:'0'}} type="submit">Confirmar</button>                        
                    </div>
                    {markers &&
                        markers
                            .filter(marker => marker.markerType === type)
                            .filter(marker => new RegExp(searched, "i").test(marker.markerName))                            
                            .map((marker, index) => (
                            <div style={markerCardSocketStyles} key={index}>
                                <PlaceMarkerCard
                                marker={marker}
                                key={marker.markerId}                                
                                factions={factions}
                                kins={kins}
                                selectedMarker={selectedMarker}
                                setSelectedMarker={setSelectedMarker}
                                />
                            </div>
                            ))
                    }                    
                </form>
            )}
        </div>
    );
};

export default NewMarker;