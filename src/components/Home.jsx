import React, {useEffect, useState} from 'react';
import WorldList from './WorldList';
import axios from 'axios';
import { FaPlus , FaMapMarkerAlt } from "react-icons/fa";
import { ImBlocked } from "react-icons/im";
import { BsTrashFill , BsPencilFill  } from 'react-icons/bs';
import { BiSolidShieldAlt2 } from "react-icons/bi";
import { GiDna1 } from "react-icons/gi";

const Home = ({handleComponentChange, user}) => {    
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

  const userCardStyles = {
    display: 'flex',    
    alignItems: 'center',
    justifyContent: 'space-evenly',
    textAlign: 'center',
    width: '100%',
    transition: 'transform 0.3s',
    color: 'white',
    padding: '5px',
    '&:hover': {
      transform: 'scale(1.05)',
    },
    border: '2.5px solid #282c34',
    marginRight: '10px'
  };

  const infoStyles = {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    padding: '0',
    margin: '20px',
    color: 'white',    
    wordSpacing: '0.2em',  
    lineHeight: 1.5,
  };

  const columnStyles = {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    lineHeight: 1.5,
    marginBottom: '2em',
    wordSpacing: '0.2em',  
    margin:'0 10px'
  };

  const consoleStyles = {
    padding: '1% 1%',
    margin: '0 10px',    
    display: 'flex',
    justifyContent: 'space-between',
    border: '2px solid #282c34',
  };

  const searchStyles = {
    display: 'flex',    
    width: '100%',    
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
    width:'calc(100% - 20px)',
    margin: '5px 10px',    
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

  const [worlds, setWorlds] = useState([]);

  const getWorlds = async () => {
    try {          
      const response = await axios.get(`https://lore-mapper-backend.vercel.app//world/`);
      setWorlds(response.data.worlds);          
    } catch (error) {
      console.error('Request error: ', error);
    }
  };

  useEffect(()=>{
    getWorlds();
  },[]);

  return (
    <div style={divStyles}>
      <div style={infoStyles}>
        <WorldList handleComponentChange={handleComponentChange} user={user} worlds={worlds} getWorlds={getWorlds}/>
      </div>   
    </div>
  );
};

export default Home;