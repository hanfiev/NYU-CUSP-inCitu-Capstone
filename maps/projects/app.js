mapboxgl.accessToken = 'pk.eyJ1IjoiaGFuZmlldmFuZGFudSIsImEiOiJjbDQ3aWdoN2EwaW93M2tyM2xqejFxNjhnIn0.GdmoXUuInsJ_i2OmR9StRg';
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/hanfievandanu/cl5n7thfo001716l6wa2mpe2p', // style URL
center: [-73.976,40.735], // starting position [lng, lat]
zoom: 15, // starting zoom
pitch: 55,
projection: 'globe' // display the map as a 3D globe
});
 
map.on('style.load', () => {
map.setFog({}); // Set the default atmosphere style
});