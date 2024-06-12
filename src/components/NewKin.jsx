import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewKin = ({ worldId, displayMarkers, setShowNewForm , getKins }) => {
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

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#000000');

    const cancelForm = () => {
        displayMarkers();
        getKins();
        setShowNewForm(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'name') {
            setName(value);
        } else if (name === 'description') {
            setDescription(value);
        } else if (name === 'color') {
            setColor(value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            kinWorld: worldId,
            kinName: name,
            kinDescription: description,
            kinColor: color,
        };
        console.log(formData);
        try {
            const response = await axios.post('https://loremapper-backend-b042c39916b5.herokuapp.com/kin/create', formData);
            const kinData = response.data.kinData;
            if (!kinData.created) {
                document.getElementById('formError').innerHTML = kinData.error;
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
            <h3 style={titleStyles}>Nueva cultura</h3>
            <form onSubmit={handleSubmit} style={formStyles} id='kinForm'>
                <label style={labelStyles}>Nombre:</label>
                <input style={inputStyles} id='kinNameForm' type="text" name="name" value={name} maxLength={100} onChange={handleChange} />
                <label style={labelStyles}>Descripción:</label>
                <textarea style={{ ...inputStyles, resize: 'vertical' }} id='kinDescriptionForm' name="description" value={description} maxLength={1000} onChange={handleChange}></textarea>
                <label style={labelStyles}>Color:</label>
                <input style={inputStyles} id='kinColorForm' type="color" name="color" value={color} onChange={handleChange} />
                <button style={{ ...buttonStyles, backgroundColor: 'red', color: 'white', fontWeight: 'bold' }} type="button" onClick={cancelForm}>Cancelar</button>
                <button style={{ ...buttonStyles, backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }} id='submitKinButton' type="submit">Confirmar</button>
                <span id="formError" style={errorStyles}></span>
            </form>
        </div>
    );
};

export default NewKin;