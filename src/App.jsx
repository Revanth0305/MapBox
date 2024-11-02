import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { addMarker } from './assets/addMarker';
//import { useHistory } from 'react-router-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import './App.css';

const INITIAL_CENTER = [77.4821, 12.9014]; // Kengeri coordinates
const INITIAL_ZOOM = 10.12;
const ORIGIN = "Kengeri";
const DESTINATIONS = ["Nagasandra", "Bangalore Palace", "Electronic City", "j.p nagar"]; // Destination city names

function App() {
  const mapRef = useRef();
  const mapContainerRef = useRef();
 // const history = useHistory();
  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);

  useEffect(() => {
    mapboxgl.accessToken = '';

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: zoom
    });

    const fetchCoordinates = async (city) => {
      try {
        const response = await fetch(
         ` https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();

        if (data.features.length) {
          const [lng, lat] = data.features[0].geometry.coordinates;
          return [lng, lat];
        } else {
          console.error(`City ${city} not found`);
          return null;
        }
      } catch (error) {
        console.error("Error fetching city coordinates:", error);
        return null;
      }
    };

    const calculateDistance = (coords1, coords2) => {
      const [lng1, lat1] = coords1;
      const [lng2, lat2] = coords2;

      const R = 6371; // Radius of the Earth in km
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLng = (lng2 - lng1) * (Math.PI / 180);
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in km
    };

    const setUpNearestRoute = async () => {
      const originCoords = await fetchCoordinates(ORIGIN);
      if (!originCoords) return;

      // Place a marker for Kengeri
      addMarker(mapRef.current, originCoords,'red');

      let nearestDestination = null;
      let nearestDistance = Infinity;

      // Find the nearest destination
      for (const destination of DESTINATIONS) {
        const destinationCoords = await fetchCoordinates(destination);
        if (!destinationCoords) continue;

        // Place markers for each destination
        addMarker(mapRef.current, destinationCoords,'blue');

        const distance = calculateDistance(originCoords, destinationCoords);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestDestination = destinationCoords;
        }
      }

      // Display the route to the nearest location
      if (nearestDestination) {
        const directions = new MapboxDirections({
          accessToken: mapboxgl.accessToken,
          unit: 'metric',
          profile: 'mapbox/driving'
        });

        directions.setOrigin(originCoords);
        directions.setDestination(nearestDestination);

        mapRef.current.addControl(directions, 'top-left');
      }
    };

    setUpNearestRoute();

    mapRef.current.on('move', () => {
      const mapCenter = mapRef.current.getCenter();
      const mapZoom = mapRef.current.getZoom();

      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);
  const handleAlert = () => {
    alert("Emergency Alert Sent!");
  };

  return (
    <>
      <div className="sidebar">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
      </div>
      <div id='map-container' ref={mapContainerRef} />
    
     {/* Alert Button */}
     <button className="alert-button" onClick={() => { alert("Emergency Alert Sent!"); window.location.href = "file:///C:/Users/pbhar/OneDrive/Desktop/index.html"}}>
     Send Alert 🚨
   </button>
   </>
  );
}

export default App;