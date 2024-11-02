import mapboxgl from 'mapbox-gl';

export const addMarker = (map, coordinates, color='red' ) => {
  // Creates a new marker at the specified coordinates
  new mapboxgl.Marker({ color })
    .setLngLat(coordinates)
    .addTo(map);

   
};