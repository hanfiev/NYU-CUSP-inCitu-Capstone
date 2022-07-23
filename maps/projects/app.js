mapboxgl.accessToken = 'pk.eyJ1IjoiaGFuZmlldmFuZGFudSIsImEiOiJjbDQ3aWdoN2EwaW93M2tyM2xqejFxNjhnIn0.GdmoXUuInsJ_i2OmR9StRg';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/hanfievandanu/cl5n7thfo001716l6wa2mpe2p', // style URL
  center: [-73.976, 40.735], // starting position [lng, lat]
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
    bblitems[i].addEventListener("click", function () {
      for (i = 0; i < bblitems.length; i++) {
        bblitems[i].classList.remove("active");
      }
      this.classList.toggle("active");

    });
  }
}

var zapAPI = 'https://cendi.nonliqu.id/hv/projects/'
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



if (project_id) {
  // fetch(zapAPI + project_id)
  fetch('zapdata-sample.json')
    .then(response => response.json())
    .then(async (data) => {
      zapData = data;
      await loadAttachment()
      await generateDocuments()
      await enableAccordion()
      await generatePDFlink()
      await projectOverview()
    });
}