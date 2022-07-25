mapboxgl.accessToken = 'pk.eyJ1IjoiaGFuZmlldmFuZGFudSIsImEiOiJjbDQ3aWdoN2EwaW93M2tyM2xqejFxNjhnIn0.GdmoXUuInsJ_i2OmR9StRg';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/hanfievandanu/cl5n7thfo001716l6wa2mpe2p', // style URL
  center: [-73.976, 40.735], // starting position [lng, lat]
  zoom: 8, // starting zoom
  pitch: 55,
  projection: 'globe' // display the map as a 3D globe
});

map.on('style.load', () => {
  map.setFog({}); // Set the default atmosphere style
});


map.on('load', () => {
  // Add a data source containing GeoJSON data.
  map.addSource('project', {
    'type': 'geojson',
    'data': {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        // These coordinates outline Maine.
        'coordinates': [
          [
            [-67.13734, 45.13745],
            [-66.96466, 44.8097],
            [-68.03252, 44.3252],
            [-69.06, 43.98],
            [-70.11617, 43.68405],
            [-70.64573, 43.09008],
            [-70.75102, 43.08003],
            [-70.79761, 43.21973],
            [-70.98176, 43.36789],
            [-70.94416, 43.46633],
            [-71.08482, 45.30524],
            [-70.66002, 45.46022],
            [-70.30495, 45.91479],
            [-70.00014, 46.69317],
            [-69.23708, 47.44777],
            [-68.90478, 47.18479],
            [-68.2343, 47.35462],
            [-67.79035, 47.06624],
            [-67.79141, 45.70258],
            [-67.13734, 45.13745]
          ]
        ]
      }
    }
  });

  // Add a new layer to visualize the polygon.
  map.addLayer({
    'id': 'project',
    'type': 'fill',
    'source': 'project', // reference the data source
    'layout': {},
    'paint': {
      'fill-color': '#0080ff', // blue color fill
      'fill-opacity': 0.5
    }
  });

  if (project_id) {
    // fetch('zapdata-sample.json')
    fetch(zapAPI + project_id)
      .then(response => response.json())
      .then(async (data) => {
        zapData = data;
        await loadAttachment()
        await generateDocuments()
        await enableAccordion()
        await generatePDFlink()
        await projectOverview()
        await updateMap()
      });
  }
});

// get project id
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const project_id = urlParams.get('id')
console.log(project_id);

function enableAccordion() {
  let acc = document.getElementsByClassName("accordion");
  let i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
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

function generatePDFlink() {
  let p = document.getElementsByTagName("p")
  let i;

  for (i = 0; i < p.length; i++) {
    p[i].addEventListener("click", function () {
      let source = this.dataset.source
      let pdfViewer = 'https://docs.google.com/viewer?url='
      let docAPI = 'https://zap-api-production.herokuapp.com/document/artifact'
      let embed = '&embedded=true'
      // console.log(this.dataset.source)
      // document.getElementById('pdf-iframe').src = docAPI + source
      document.getElementById('pdf-iframe').setAttribute('src', pdfViewer + docAPI + source + embed)

      for (i = 0; i < p.length; i++) {
        p[i].classList.remove("active");
      }
      this.classList.toggle("active");
    });
  }
}

function generateBBLLink() {
  var bblitems = document.getElementsByClassName("bbl-item");
  var i;

  for (i = 0; i < bblitems.length; i++) {
    bblitems[i].addEventListener("click", function (evt) {
      updateBBLdata(evt)
      for (i = 0; i < bblitems.length; i++) {
        bblitems[i].classList.remove("active");
      }
      this.classList.toggle("active");

    });
  }
}

var zapAPI = 'https://incitu-hv.herokuapp.com/public/hv/projects/'
zapData = {}
attachments = {}

function loadAttachment() {
  attachments = zapData.included.filter(element => element.type == "artifacts")
  console.log(attachments)
}

function generateDocuments() {
  for (i = 0; i < attachments.length; i++) {
    // console.log(attachments[i].attributes)
    let categoryName = attachments[i].attributes["dcp-name"].split("-")[1]
    let catNameBtn = document.createElement('button')
    catNameBtn.classList.add('accordion')
    catNameBtn.appendChild(document.createTextNode(categoryName))

    // console.log(catNameBtn)
    let panelDiv = document.createElement('div')
    panelDiv.classList.add('panel')

    // console.log(categoryName)
    for (j = 0; j < attachments[i].attributes.documents.length; j++) {
      let documentAtr = attachments[i].attributes.documents[j]
      let documentName = documentAtr.name.replace("_", " ")
      let documentURL = documentAtr.serverRelativeUrl
      // console.log(documentName)
      // console.log(documentURL)

      let pdfDoc = document.createElement('p')
      pdfDoc.appendChild(document.createTextNode(documentName))
      pdfDoc.setAttribute("data-source", documentURL)
      panelDiv.appendChild(pdfDoc)
    }
    // console.log(panelDiv)

    filesCard = document.getElementById("files-card")
    filesCard.appendChild(catNameBtn)
    filesCard.appendChild(panelDiv)

  }
}

function generateBBL() {
  for (i = 0; i < zapData.data.attributes.bbls.length; i++) {
    let bbl = document.createElement('div')
    bbl.classList.add('bbl-item')
    let bblname = zapData.data.attributes.bbls[i]
    bbl.appendChild(document.createTextNode(bblname))
    document.getElementById('bbl-list').appendChild(bbl)
  }
}

bblData = []

function fetchBBLdata() {

  let bbls = document.getElementsByClassName('bbl-item')

  for (i = 0; i < bbls.length; i++) {
    let bbl = bbls[i].innerHTML
    let plutoAPI = 'https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/ArcGIS/rest/services/MAPPLUTO/FeatureServer/0/query?where=BBL+%3D+' + bbl + '&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=false&returnCentroid=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=false&quantizationParameters=&sqlFormat=none&f=pjson&token='

    fetch(plutoAPI)
      .then(response => response.json())
      .then(async (data) => {
        plutoData = data;
        bblData.push({
          "bbl": bbl,
          "data": plutoData
        })
      });
  }

}

function updateBBLdata(evt) {
  let bbl = evt.target.innerHTML
  let bblSelected = bblData.filter(x => x.bbl === bbl)
  let attributes = bblSelected[0].data.features[0].attributes

  document.getElementById("current-address").innerHTML = attributes.Address
  document.getElementById("current-zoningcode").innerHTML = attributes.ZoneDist1
  document.getElementById("current-landuse").innerHTML = attributes.LandUse
  document.getElementById("current-lotarea").innerHTML = attributes.LotArea
  document.getElementById("current-buildingarea").innerHTML = attributes.BldgArea
  document.getElementById("current-block").innerHTML = attributes.Block
  document.getElementById("current-builtFAR").innerHTML = attributes.BuiltFAR
  document.getElementById("current-commFAR").innerHTML = attributes.CommFAR
  document.getElementById("current-facFAR").innerHTML = attributes.FacilFAR
  document.getElementById("current-resFAR").innerHTML = attributes.ResidFAR

}

function updateMap() {
  let geojsonSource = map.getSource('project');
  let geojson = zapData.data.attributes["bbl-featurecollection"].features[0]
  let centroid = turf.centroid(geojson).geometry.coordinates
  // Update the data after the GeoJSON source was created
  geojsonSource.setData(geojson)

  map.flyTo({
    center: centroid,
    zoom: 16,
    speed: 0.4,
    essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });
}

async function fillValue() {
  document.getElementById('project-name').innerHTML = zapData.data.attributes['dcp-projectname']
  document.getElementById('brief-content').innerHTML = zapData.data.attributes['dcp-projectbrief']
  document.getElementById('action-content').innerHTML = actions
  document.getElementById('ceqr-content').innerHTML = zapData.data.attributes['dcp-ceqrnumber']
  document.getElementById('id-content').innerHTML = zapData.data['id']
  document.getElementById('applicant-content').innerHTML = zapData.data.attributes['dcp-applicant-customer-value']
  document.getElementById('borough-content').innerHTML = zapData.data.attributes['dcp-borough'] + " | " + zapData.data.attributes['dcp-validatedcommunitydistricts']
  document.getElementById('status-content').innerHTML = zapData.data.attributes['dcp-publicstatus']


  await generateBBL()
  await generateBBLLink()
  await fetchBBLdata()
  // console.log(zapData)
  await updateMap()
}

async function projectOverview() {
  actionsFilter = zapData.included.filter(element => element.type == "actions")
  actions = []
  for (i = 0; i < actionsFilter.length; i++) {
    actions.push(actionsFilter[i].attributes['dcp-name'])
  }
  actions = [...new Set(actions)]

  await fillValue()

}



