import React, { useState } from 'react';

const NewMapCard = () => {
  const MapCardStyles = {
    backgroundColor: '#282c34',
    color: 'white',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',    
    height: '240px',    
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'scale(1.05)', 
    },
  };

  const thumbnailStyles = {
    width: '100%',
    height: '200px',
    borderRadius: '10px 10px 0 0',    
    fontSize: '100px',
    backgroundColor: '#007bff',    
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const cardInfoStyles = {    
    width: '100%',
    color: 'white',
    textAlign: 'center',
    padding: '10px'
  };

  const [hoveredCard, setHoveredCard] = useState(false);  

  const handleCardHover = () => {
    setHoveredCard(true);
  };

  const handleCardLeave = () => {
    setHoveredCard(false);
  };  

  return (
    <div      
      style={{
        ...MapCardStyles,
        transform: hoveredCard === true ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s',
      }}
      onMouseEnter={handleCardHover}
      onMouseLeave={handleCardLeave}>
      <div style={thumbnailStyles}>+</div>       
      <div style={cardInfoStyles}>Nuevo mapa</div>
    </div>
  );
};

export default NewMapCard;