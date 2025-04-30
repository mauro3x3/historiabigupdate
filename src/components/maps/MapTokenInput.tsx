import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

// Permanent Mapbox token
const MAPBOX_TOKEN = "pk.eyJ1IjoibWF1cm9ramFlcjEyMyIsImEiOiJjbTh5dmt1aXAwNG0yMmpyeTdwbTJiMXVuIn0.rMZrAGudtcbignhhBK65rQ";

interface MapTokenInputProps {
  onTokenSubmit: () => void;
}

const MapTokenInput: React.FC<MapTokenInputProps> = ({ onTokenSubmit }) => {
  useEffect(() => {
    // Set the permanent token
    mapboxgl.accessToken = MAPBOX_TOKEN;
    onTokenSubmit();
  }, [onTokenSubmit]);

  // Return null since we don't need to render anything
  return null;
};

export default MapTokenInput;
