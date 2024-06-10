import React, { useState } from 'react';

const NewWorldCard = () => {
  const worldCardStyles = {
    backgroundColor: '#007bff',    
    color: 'white',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',    
    height: '240px',
    fontSize: '100px',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'scale(1.05)', 
    },
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
        ...worldCardStyles,
        transform: hoveredCard === true ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s',
      }}
      onMouseEnter={handleCardHover}
      onMouseLeave={handleCardLeave}>
      +      
    </div>
  );
};

export default NewWorldCard;