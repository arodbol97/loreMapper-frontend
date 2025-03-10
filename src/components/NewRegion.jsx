import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewRegion = ({ worldId, displayMarkers, setShowNewForm, getRegions }) => {
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
        width: '100%',
        color: 'white',
        textAlign: 'center',
        margin: '0',
        marginBottom: '10px',
    };

    const errorStyles = {
        width: '100%',
        textAlign: 'center',
        color: 'red',
        fontSize: '15px',
    };

    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [map, setMap] = useState('');

    const cancelForm = () => {
        displayMarkers();
        getRegions();
        setShowNewForm(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'name') {
            setName(value);
        } else if (name === 'position') {
            setPosition(value);
        } else if (name === 'map') {
            setMap(value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            regionWorld: worldId,
            regionName: name,
            regionPosition: position,
            regionMap: map,
        };
        console.log(formData);
        try {
            const response = await axios.post('https://lore-mapper-backend.vercel.app/region/create', formData);
            const regionData = response.data.regionData;
            if (!regionData.created) {
                document.getElementById('formError').innerHTML = regionData.error;
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
            <h3 style={titleStyles}>Nueva región</h3>
            <form onSubmit={handleSubmit} style={formStyles} id='regionForm'>
                <label style={labelStyles}>Nombre:</label>
                <input style={inputStyles} type="text" name="name" value={name} maxLength={100} onChange={handleChange} />
                <label style={labelStyles}>Posición:</label>
                <input style={inputStyles} type="text" name="position" value={position} onChange={handleChange} />
                <label style={labelStyles}>Mapa:</label>
                <input style={inputStyles} type="text" name="map" value={map} onChange={handleChange} />
                <button style={{ ...buttonStyles, backgroundColor: 'red', color: 'white', fontWeight: 'bold' }} type="button" onClick={cancelForm}>Cancelar</button>
                <button style={{ ...buttonStyles, backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }} type="submit">Confirmar</button>
                <span id="formError" style={errorStyles}></span>
            </form>
        </div>
    );
};

export default NewRegion;
