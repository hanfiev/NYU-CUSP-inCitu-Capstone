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

// get project id
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const project_id = urlParams.get('id')
console.log(project_id);

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}

function toggleDocuments() {
  document.getElementById('documents').classList.add("active")
  document.getElementById('documents-page').style.display = 'flex'
  document.getElementById('project-overview').style.display = 'none'
  document.getElementById('overview').classList.remove("active")
}

function toggleOverview() {
  document.getElementById('documents').classList.remove("active")
  document.getElementById('documents-page').style.display = 'none'
  document.getElementById('project-overview').style.display = 'flex'
  document.getElementById('overview').classList.add("active")
}

function togglePDF(e){
  document.getElementById('pdf-iframe').src = 'http://www.africau.edu/images/default/sample.pdf'
  let p = document.getElementsByTagName("p")
  for (i = 0; i < p.length; i++) {
      p[i].classList.remove("active");
  }
  e.classList.toggle("active");
}

var p = document.getElementsByTagName("p")
var i;

for (i = 0; i < p.length; i++) {
  p[i].addEventListener("click", function() {
    document.getElementById('pdf-iframe').src = 'http://www.africau.edu/images/default/sample.pdf'
    for (i = 0; i < p.length; i++) {
      p[i].classList.remove("active");
  }
  this.classList.toggle("active");
  });
}

var bblitems = document.getElementsByClassName("bbl-item");
var i;

for (i = 0; i < bblitems.length; i++) {
  bblitems[i].addEventListener("click", function() {
    for (i = 0; i < bblitems.length; i++) {
      bblitems[i].classList.remove("active");
  }
    this.classList.toggle("active");
    
  });
}

var zapAPI = 'https://zap-api-production.herokuapp.com/projects/'
zapData = {}

// if (project_id) {
//   fetch(zapAPI + project_id)
//   .then(response => response.json())
//   .then(data => zapData = data);
// }

if (project_id) {
  fetch('zapdata-sample.json')
  .then(response => response.json())
  .then(data => zapData = data);
}

if (zapData) {
  
}