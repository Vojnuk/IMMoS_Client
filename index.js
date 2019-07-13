document.addEventListener("DOMContentLoaded", function(){

let map = L.map( document.getElementById("map") ).setView( [44.82, 20.45], 6 );

let tileProvider = 'https://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png';
let attribution = {
	maxZoom: 18,
	attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};
L.tileLayer( tileProvider, attribution).addTo(map);

let serverUrl = "https://immos.herokuapp.com/";
fetch(serverUrl,{
   //method: "GET",
   //mode: "no-cors",
 })
 .then( res => {
   return res.json(); })
  .then( geoData => {
    let marker = L.geoJSON(geoData).addTo(map)
    .bindPopup().addTo(map);

marker.on('click', onMarkerClick );        
  
function onMarkerClick(e){

  let name = geoData[0].properties.name;
  let buildings = geoData[0].properties.buildings;
  let sources = geoData[0].properties.sources;
  let books = geoData[0].properties.books;
  let picture = geoData[0].properties.buildings[0].picture; // just testing for belgrade picture

  let popup = e.target.getPopup();
  let table = document.createElement('table');
  table.border = "1px";
  table.style.borderCollapse = "separate";
  table.createTHead();
  table.tHead.append(name); 


  let row0 = table.insertRow(0);// problem of pushing other elements
  //row0.insertCell(0).append(picture);

  let row1 = table.insertRow(1);
  row1.insertCell(0).append("Грађевине:");
  for (let i = 0; i < buildings.length; i++ ){
    row1.insertCell([i+1]).append(buildings[i].name);
  }

  let row2 = table.insertRow(2);
  row2.insertCell(0).append("Извори:");
  for (let i = 0; i < sources.length; i++ ){
    row2.insertCell([i+1]).append(sources[i].name);
  }

  let row3 = table.insertRow(3);
  row3.insertCell(0).append("Књиге:");
  for (let i = 0; i < books.length; i++ ){
    row3.insertCell([i+1]).append(books[i].name);
  }
  


  popup.setContent(table);

  let img = document.createElement("img");
  img.src = picture;
  document.querySelector('table').appendChild(img);
}
});


document.getElementById("jsonButton").addEventListener('click', () => {
     fetch(serverUrl,{
      method: "GET",
      mode: "cors",
      headers: {
       //"Content-Type":"application/vnd.geo+json; charset=utf-8"
      }
    })
    .then( res => { return res.json(); })
    .then(body => {
      console.log(JSON.stringify(body)); 
    });
  });

});

