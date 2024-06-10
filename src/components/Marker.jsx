import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { BsBoxFill, BsHouseFill, BsPersonFill } from 'react-icons/bs';

const Marker = ({ map, markerData, factionKin, hoveredMarker, setHoveredMarker }) => {

  useEffect(() => {

  if (!map || !markerData) return;
  const pos = JSON.parse(markerData.markerPosition);

  let markerColor = '#00000';

  if (factionKin) {
    if (markerData.factionColor != null) {
      markerColor = markerData.factionColor;
    }
  } else {
    if (markerData.kinColor != null) {
      markerColor = markerData.kinColor;
    }
  }
  
  const opacity = (hoveredMarker !== null && hoveredMarker.id !== markerData.markerId) ? 0.5 : 1.0;
  markerColor = `rgba(${parseInt(markerColor.slice(1, 3), 16)}, ${parseInt(markerColor.slice(3, 5), 16)}, ${parseInt(markerColor.slice(5, 7), 16)}, ${opacity})`;

  const newMarker = new mapboxgl.Marker({ color: markerColor, scale: (hoveredMarker !== null && hoveredMarker.id === markerData.markerId && hoveredMarker.coords === markerData.markerPosition) ? (2):(1.3) })
    .setLngLat([pos.lng, pos.lat])
    .addTo(map);
  
  let svgString = "";

  if(markerData.markerType == "person"){
    svgString = `<svg style="position:absolute;" xmlns="http://www.w3.org/2000/svg" viewBox="-4 4 24 24"> <path fill="white" d="${BsPersonFill().props.children[0].props.d}"></path></svg>`;
  }else if(markerData.markerType == "place"){
    svgString = `<svg style="position:absolute;" xmlns="http://www.w3.org/2000/svg" viewBox="-4 4 24 24"> <path fill="white" d="${BsHouseFill().props.children[0].props.d}"></path><path fill="white" d="${BsHouseFill().props.children[1].props.d}"></path></svg>`;
  }else if(markerData.markerType == "object"){
    svgString = `<svg style="position:absolute;" xmlns="http://www.w3.org/2000/svg" viewBox="-4 4 24 24"> <path fill="white" d="${BsBoxFill().props.children[0].props.d}"></path></svg>`;
  }
  
  const svgElement = new DOMParser().parseFromString(svgString, 'image/svg+xml').documentElement;
  
  newMarker.getElement().lastElementChild.lastElementChild.style.display = "none";
  newMarker.getElement().lastElementChild.appendChild(svgElement);

  newMarker.getElement().dataset.markerId = markerData.markerId;
  newMarker.getElement().dataset.markerFaction = markerData.markerFaction;
  newMarker.getElement().dataset.markerKin = markerData.markerKin;

  const popupContent = `
      <div style="font-family: Arial, sans-serif;">
        <h3 style="margin: 0;">${markerData.markerName}</h3>
        <p style="margin: 0;">${markerData.markerDescription}</p>
      </div>
    `;

    // Create a popup but don't attach it to the marker
    const popup = new mapboxgl.Popup({ offset: 50, closeButton: false })
      .setHTML(popupContent);

  const markerElement = newMarker.getElement();
  markerElement.addEventListener('mouseenter', () => {
    //setHoveredMarker(markerData.markerId);    
    popup.setLngLat(newMarker.getLngLat()).addTo(map);
  });
  markerElement.addEventListener('mouseleave', () => {
    //setHoveredMarker(null);    
    popup.remove();
  });

  return () => {
    newMarker.remove();
    popup.remove();    
  };
  }, [map, markerData, hoveredMarker]);

  return null;
};

export default Marker;