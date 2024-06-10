import React, { useEffect, useState } from 'react';
import { BiSolidShieldAlt2 } from "react-icons/bi";
import { GiDna1 } from "react-icons/gi";

const PlaceMarkerCard = ({marker, factions, kins, selectedMarker, setSelectedMarker}) => {
  const mapCardStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
    width: '95%',
    transition: 'transform 0.3s',
    color: 'white',
    padding: '5px',
    '&:hover': {
      transform: 'scale(1.05)',
    },
    border: '2.5px solid #282c34',
    marginRight: '10px',
    backgroundColor: selectedMarker === marker.markerId ? '#007bff':'',
  };

  const buttonsStyles = {
    display: 'flex',
    cursor: 'pointer'
  };

  const spanStyles = {
    overflowX: 'hidden',
    width: '100%',
    paddingBottom: '20px',
  };

  const cardHeaderStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    cursor: 'pointer',
    minHeight: '67px'
  };

  const factionStyles = {
    display: 'flex',
    alignItems: 'center',    
    justifyContent: 'center',
    color: 'white',
    height:'26px',
    width:'26px',
    marginRight:'5px',
    borderRadius: '20px'
  };

  const kinStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    height:'26px',
    width:'26px',
    marginRight:'5px',
    borderRadius: '20px'
  };

  const [hoveredCard, setHoveredCard] = useState(null);          

  const handleCardHover = (index) => {
    setHoveredCard(index);    
  };

  const handleCardLeave = () => {
    setHoveredCard(null);    
  };  

  useEffect(()=>{
  },[selectedMarker]);

  return (    
    <div
      key={marker.markerId}
      style={{
        ...mapCardStyles,
        transform: hoveredCard === marker.markerId || selectedMarker === marker.markerId ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.3s',        
      }}
      onMouseEnter={() => handleCardHover(marker.markerId)}
      onMouseLeave={handleCardLeave}>
        <div style={cardHeaderStyles} onClick={()=>{setSelectedMarker(marker.markerId)}}>
          <div style={buttonsStyles}>
            {factions && <div style={{...factionStyles,backgroundColor: factions.find(faction => faction.factionId === marker.markerFaction) ? (factions.find(faction => faction.factionId === marker.markerFaction).factionColor):('black')}}><BiSolidShieldAlt2 size={18}/></div>}
            {kins && <div style={{...kinStyles,backgroundColor: kins.find(kin => kin.kinId === marker.markerKin) ? (kins.find(kin => kin.kinId === marker.markerKin).kinColor):('black')}}><GiDna1 size={18}/></div>}
          </div>                      
          <span style={spanStyles}>{marker.markerName}</span>
        </div>        
    </div>
  );
};

export default PlaceMarkerCard;