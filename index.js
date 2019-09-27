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
    return res.json();
  })
  .then( geoData => {
    //console.log(geoData);
    let marker = L.geoJSON(geoData, {
      coordsToLatLng: function (coords) {
          // latitude , longitude, altitude
          //return new L.LatLng(coords[1], coords[0], coords[2]); //Normal behavior
          return new L.LatLng(coords[0], coords[1], coords[2]);
      }
      }).addTo(map)
    .bindPopup().addTo(map);

marker.on('click', onMarkerClick);


 function onMarkerClick (e){
  let settlement = e.sourceTarget.feature.properties ;
  let name = settlement.name;
  let buildings = settlement.buildings;
  let sources = settlement.sources;
  let books = settlement.books;
  
  
  let insertPicture = function (){
    let picture = document.createElement('img');
    picture.src = settlement.buildings[0].picture;
    picture.style.display="block";
    picture.style.margin = "0 auto";
    return picture;
  };
    

  let popup = e.target.getPopup();
  let table = document.createElement('table');
  table.style.borderCollapse = "collapse";
  

  if(settlement.name !== undefined){
    table.createTHead();
    table.tHead.append(name); 
  }

  try{
  let row0 = table.insertRow();// cell problem of pushing other cells
  row0.insertCell(0).appendChild( insertPicture());
  }catch(err){
    console.error("ERR:" + err);
  }

  if (settlement.buildings !== undefined){
    let row1 = table.insertRow(1);
    row1.insertCell(0).append("Грађевине:");
    for (let i = 0; i < buildings.length; i++ ){
      row1.insertCell([i+1]).append(buildings[i].name);
    }
  }
  if (settlement.sources !== undefined){
    let row2 = table.insertRow();
    row2.insertCell(0).append("Извори:");
    for (let i = 0; i < sources.length; i++ ){
      row2.insertCell([i+1]).append(sources[i].name);
    }
  }
  if (settlement.books !== undefined){
    let row3 = table.insertRow();
    row3.insertCell(0).append("Књиге:");
    for (let i = 0; i < books.length; i++ ){
      row3.insertCell([i+1]).append(books[i].name);
    }
  }
  popup.setContent(table); 
  
  let rows = document.querySelector('table').rows.length;
  for (let i = 0; i < rows; i++){
    document.querySelector('table').rows[i].style.borderBottom = "1px solid green";
  }

  // side view of settlements
let settlementDataView = document.getElementById('settlementDataView');

if (settlementDataView.querySelector('img') !== null){
    settlementDataView.removeChild(settlementDataView.querySelector('img'));
  }else{
    try{
    settlementDataView.appendChild(insertPicture());
    }catch(err){console.error("ERR:" + err);}
  }
  }//end of onMarkerClick

});

map.addEventListener('click', ()=>{
  if (settlementDataView.contains( settlementDataView.querySelector('img') ) ){
    settlementDataView.removeChild(settlementDataView.querySelector('img'));
  }
});



});

