import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { BsPencilFill } from 'react-icons/bs';

const TempMarker = ({ map , setFormData , formData, marker}) => {

  useEffect(() => {

  if (!map) return;

  const tempMarker = new mapboxgl.Marker({ scale: 1.5 ,draggable: true })
    .setLngLat([JSON.parse(marker.markerPosition).lng, JSON.parse(marker.markerPosition).lat])
    .addTo(map);

  let svgString = `<svg style="position:absolute;" xmlns="http://www.w3.org/2000/svg" viewBox="-7 3 28 24"> <path fill="white" d="${BsPencilFill().props.children[0].props.d}"></path></svg>`;

  const svgElement = new DOMParser().parseFromString(svgString, 'image/svg+xml').documentElement;

  tempMarker.getElement().lastElementChild.lastElementChild.style.display = "none";
  tempMarker.getElement().lastElementChild.appendChild(svgElement);
  
  const handleClick = (e) => {
    tempMarker.setLngLat(e.lngLat);
    setFormData({
        ...formData,
        markerPosition: JSON.stringify({ lat: e.lngLat.lat, lng: e.lngLat.lng })
      });
  };

  const handleDrag = () => {
    const lngLat = tempMarker.getLngLat();
    setFormData({
      ...formData,
      markerPosition: JSON.stringify({ lat: lngLat.lat, lng: lngLat.lng })
    });
  };
  
  map.on('click', handleClick);
  tempMarker.on('drag', handleDrag);

  return () => {
    tempMarker.remove();
    map.off('click', handleClick);
    tempMarker.off('dragend', handleDrag);
  };
  }, [map]);

  return null;
};

export default TempMarker;