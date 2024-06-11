import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import axios from 'axios';
import Marker from './Marker';
import MarkerMenu from './MarkerMenu';
import FactionMenu from './FactionMenu';
import KinMenu from './KinMenu';
import RegionMenu from './RegionMenu';

mapboxgl.accessToken = 'pk.eyJ1IjoiYXJvZGJvbCIsImEiOiJjbHI1NjQxOGQxc3NrMnJvMXhtNXh5YmZ6In0.0SwIm1c8uBwOJBSiV3DHUQ';

const MapBox = ({ mapId , handleComponentChange, user , worldId, mapData}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [factionKin, setFactionKin] = useState(true);  
  const [showRegions, setShowRegions] = useState(true);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [rerender, setRerender] = useState(false);

  let hiddenMarkers = [];

  const mapStyles = {
    height: '100%',
    width: '100%',
  };

  const fetchMapData = async () => {
    try {
      const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/map/fromId/${mapId}`);
      return response.data.map;
    } catch (error) {
      console.error('Error fetching background image:', error);
      return null;
    }
  };

  const displayMarkers = async () => {
    try {
      const response = await axios.get(`https://loremapper-backend-b042c39916b5.herokuapp.com/marker/fromMapId/${mapId}`);
      setMarkers(
        response.data.markers
          .filter(marker => !hiddenMarkers.includes(marker.markerPosition))
          .sort((a, b) => {
            const aLat = JSON.parse(a.markerPosition).lat;
            const bLat = JSON.parse(b.markerPosition).lat;
            return bLat - aLat;
      }));
    } catch (error) {
      console.error('Error fetching markers:', error);
    }
  };

  const hideMarker = async (toHide = false, toShow = false, clean = false) => {
    
    if (toHide !== false) {
      hiddenMarkers = [...hiddenMarkers, toHide];
    }
    if (toShow !== false) {
      hiddenMarkers = hiddenMarkers.filter(marker => marker !== toShow);
    }
    if (clean !== false) {
      hiddenMarkers = [];
    }
  };  

  const initMap = async () => {
    const mapData = await fetchMapData();

    if (!mapData) {
      return;
    }

    const img = new Image();
    let imageWidth = null;
    let imageHeight = null;
    img.src = '' + mapData.mapImage;

    img.onload = () => {
      const newWidth = 100;
      const newHeight = (newWidth * img.height) / img.width - 10;

      imageWidth = newWidth;
      imageHeight = newHeight;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            backgroundImg: {
              type: 'image',
              url: '' + mapData.mapImage,
              coordinates: [
                [-imageWidth / 2, imageHeight / 2],
                [imageWidth / 2, imageHeight / 2],
                [imageWidth / 2, -imageHeight / 2],
                [-imageWidth / 2, -imageHeight / 2],
              ],
            },
          },
          layers: [
            {
              id: 'background-layer',
              type: 'raster',
              source: 'backgroundImg',
              paint: {
                'raster-fade-duration': 0,
              },
            },
          ],
        },
        center: [0, 0],
        zoom: 0,
        maxBounds: [
          [-2 * imageWidth / 2, -1.3 * imageHeight / 2],
          [2 * imageWidth / 2, 1.3 * imageHeight / 2],
        ],
        projection: 'mercator',
        pitchWithRotate: false,
        dragRotate: false,
        touchZoomRotate: false,
        keyboard: {
          rotate: false
        }
      });
      displayMarkers();
    };
  }; 

  useEffect(() => {
    //if (!map.current) {
      initMap();
    //}
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapId]);

  return (
    <div style={mapStyles}>
      <div ref={mapContainer} style={mapStyles} className="map-container">
        {markers.map((marker,index) => (
          <Marker 
            key={index} 
            map={map.current}  
            markerData={marker} 
            factionKin={factionKin} 
            hoveredMarker={hoveredMarker} 
            setHoveredMarker={setHoveredMarker}/>            
        ))}
      </div>
      {mapId && <MarkerMenu 
        worldId={worldId} 
        mapId={mapId} 
        mapData={mapData} 
        map={map.current} 
        user={user} 
        handleComponentChange={handleComponentChange} 
        displayMarkers={displayMarkers} 
        hideMarker={hideMarker}  
        hoveredMarker={hoveredMarker} 
        setHoveredMarker={setHoveredMarker}
        rerender={rerender}/>}
        {mapId && factionKin ? (
          <FactionMenu 
            worldId={worldId} 
            mapId={mapId} 
            map={map.current} 
            user={user} 
            handleComponentChange={handleComponentChange} 
            displayMarkers={displayMarkers} 
            hideMarker={hideMarker} 
            setFactionKin={setFactionKin} 
            hoveredMarker={hoveredMarker} 
            setHoveredMarker={setHoveredMarker}
            rerender={rerender}
            setRerender={setRerender}/>
        ) : (
          <KinMenu 
            worldId={worldId} 
            mapId={mapId} 
            map={map.current} 
            user={user} 
            handleComponentChange={handleComponentChange} 
            displayMarkers={displayMarkers} 
            hideMarker={hideMarker} 
            setFactionKin={setFactionKin} 
            hoveredMarker={hoveredMarker} 
            setHoveredMarker={setHoveredMarker}
            rerender={rerender}
            setRerender={setRerender}/>
        )}         
      
      {false && <RegionMenu 
        worldId={worldId} 
        mapId={mapId} 
        map={map.current} 
        user={user} 
        handleComponentChange={handleComponentChange} 
        displayMarkers={displayMarkers} 
        hideMarker={hideMarker}
        />}
    </div>
  );
};

export default MapBox;
