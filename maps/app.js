// initialize map
mapboxgl.accessToken = 'pk.eyJ1IjoiaGFuZmlldmFuZGFudSIsImEiOiJjbDQ3aWdoN2EwaW93M2tyM2xqejFxNjhnIn0.GdmoXUuInsJ_i2OmR9StRg';
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/hanfievandanu/cl5n7thfo001716l6wa2mpe2p', // style URL
center: [-73.976,40.735], // starting position [lng, lat]
zoom: 11, // starting zoom
pitch: 0,
projection: 'globe' // display the map as a 3D globe
});
 
map.on('style.load', () => {
map.setFog({}); // Set the default atmosphere style
});

ZAPdata = []

// geojson placeholder
projects = {
  "type": "FeatureCollection",
  "features": []
}

// retrieve the data and converting it to geojson format
function retrieveData(data) {
  ZAPdata = data
  for (i = 0; i < ZAPdata.length; i++) {
    // check if the length of polygon column at least consist of 4 point (turf requirements)
    if (ZAPdata[i].polygon.length > 3) {
      let feature = turf.centroid(turf.polygon([ZAPdata[i].polygon]));
      feature.properties = ZAPdata[i]
      projects.features.push(feature)
    }

    let borough = document.createElement('div')
    borough.classList.add('borough')
    borough.appendChild(document.createTextNode('Manhattan | 1')) //borough

    let projectName = document.createElement('div')
    projectName.classList.add('projectName')
    projectName.appendChild(document.createTextNode(ZAPdata[i]['dcp-projectname']))

    let projectType = document.createElement('div')
    projectType.classList.add('projectType')
    projectType.appendChild(document.createTextNode('ZONING APPLICATION | ULURP'))

    let content = document.createElement('div')
    content.classList.add('content')

    content.appendChild(borough)
    content.appendChild(projectName)
    content.appendChild(projectType)

    let img = document.createElement('div')
    img.classList.add('img')

    let section = document.createElement('div')
    section.classList.add('section')

    section.appendChild(img)
    section.appendChild(content)

    let card = document.createElement('div')
    card.classList.add('card')

    card.appendChild(section)

    document.getElementById('projectsList').append(card)
  }

  map.addSource('projects', {
    'type': 'geojson',
    'data': projects
  });

  // Add a new layer to visualize the polygon.
  map.addLayer({
    'id': 'projects',
    'type': 'circle',
    'source': 'projects', // reference the data source
    'layout': {},
    'paint': {
      'circle-color': '#0080ff', // blue color fill
    }
  });
}

var noticedCount = 0
var inPublicReviewCount = 0
var NoticedValue = 0
var InpublicreviewValue = 0


function statusCounter() {
  noticedCount = 0
  inPublicReviewCount = 0
  for (i = 0; i < projects_.length; i++) {
    if (projects_[i].properties['dcp-publicstatus'] == "Noticed") {
      noticedCount++
    } else {
      inPublicReviewCount++
    }
  }
  document.getElementById('noticedLabel').innerHTML = "Noticed (" + noticedCount + ")"
  document.getElementById('iprLabel').innerHTML = "In Public Review (" + inPublicReviewCount + ")"

  NoticedValue = (noticedCount / (noticedCount + inPublicReviewCount) * 100);
  InpublicreviewValue = (inPublicReviewCount / (noticedCount + inPublicReviewCount) * 100);
  updateBar()
}

function updateBar() {
  document.getElementById("noticedBar").style.width = NoticedValue + "%";
  document.getElementById("inpublicreviewBar").style.width = InpublicreviewValue + "%";
}

map.on('load', () => {
  fetch('data.json')
    .then(response => response.json())
    .then(data => retrieveData(data));

})

projects_ = []

map.on('moveend', () => {
  projects_ = map.queryRenderedFeatures({
    layers: ['projects']
  });
  document.getElementById("sumProjects").innerHTML = "There are " + projects_.length + " projects in the area, with details as follows:"
  statusCounter();
  console.log(projects_)
})